import { Router, Response } from 'express';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/chat/messages — fetch full conversation history for the user
router.get('/messages', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [req.userId]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/chat/message — send a user message and receive an AI response
router.post('/message', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { content } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    res.status(400).json({ error: 'Message content is required' });
    return;
  }

  const userMessage = content.trim();

  try {
    await pool.query(
      'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
      [req.userId, 'user', userMessage]
    );

    const assistantContent = generateResponse(userMessage);

    const saved = await pool.query(
      'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, 'assistant', assistantContent]
    );

    res.json({ message: saved.rows[0] });
  } catch (err) {
    console.error('Chat message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// DELETE /api/chat/messages — clear the user's full chat history
router.delete('/messages', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query('DELETE FROM chat_messages WHERE user_id = $1', [req.userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Chat clear error:', err);
    res.status(500).json({ error: 'Failed to clear messages' });
  }
});

// Stub response generator — swap this with an AI API call (e.g. OpenAI) when ready
function generateResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('cholesterol')) {
    return 'Cholesterol is a fatty substance in your blood. High total cholesterol (above 200 mg/dL) increases heart disease risk. A diet low in saturated fat, regular exercise, and sometimes medication can help. Please consult your doctor for personalised advice.';
  }
  if (lower.includes('heart rate') || lower.includes('pulse')) {
    return 'A normal resting heart rate for adults is 60–100 BPM. Athletes often have lower rates. A consistently high rate may indicate stress, dehydration, or an underlying condition. Always discuss abnormal readings with your doctor.';
  }
  if (lower.includes('bmi') || lower.includes('weight')) {
    return 'BMI (Body Mass Index) estimates body fat from height and weight. A healthy BMI is 18.5–24.9. Values above 25 suggest overweight, and above 30 indicate obesity — both increase cardiovascular risk. Diet and exercise remain the most effective interventions.';
  }
  if (lower.includes('glucose') || lower.includes('blood sugar') || lower.includes('diabetes')) {
    return 'Fasting blood glucose of 70–99 mg/dL is normal. Values between 100–125 indicate pre-diabetes, and ≥126 mg/dL suggests diabetes. Elevated glucose is a significant cardiovascular risk factor. Regular monitoring and a low-sugar diet are key.';
  }
  if (lower.includes('risk') || lower.includes('score')) {
    return 'Your HeartGuard risk score is calculated from cholesterol, BMI, heart rate, blood glucose, and pulse pressure. A score below 33 is low risk, 33–66 is moderate, and above 66 is high. Complete a risk assessment to see your personalised score.';
  }
  if (lower.includes('ecg') || lower.includes('electrocardiogram')) {
    return 'An ECG (electrocardiogram) records the electrical activity of your heart. Abnormalities can reveal arrhythmias, blockages, or enlargement. HeartGuard lets you upload your ECG strip for inclusion in your risk profile. Always have your ECG interpreted by a cardiologist.';
  }

  return "I'm HeartGuard's AI health assistant. I can help you understand your heart health metrics, interpret your risk assessment results, and answer general cardiovascular health questions. Remember — I'm a screening tool, not a substitute for professional medical advice.";
}

export default router;
