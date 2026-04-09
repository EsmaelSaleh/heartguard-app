import { Router, Response } from 'express';
import { InferenceClient } from '@huggingface/inference';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const HF_MODEL = 'Qwen/Qwen2.5-72B-Instruct';

const SYSTEM_PROMPT = `You are HeartGuard AI, a knowledgeable and empathetic heart health assistant. Your role is to help users understand cardiovascular health topics clearly and accurately.

Guidelines:
- Answer only heart health, cardiology, and related wellness topics (diet, exercise, stress, sleep, medications, symptoms, risk factors).
- If a user describes an emergency (chest pain, stroke symptoms, difficulty breathing, etc.), immediately and urgently tell them to call emergency services (911).
- Be warm, supportive, and use plain language. Avoid unnecessary jargon.
- Format responses using short paragraphs or bullet points for readability.
- Always recommend consulting a doctor or cardiologist for personal medical decisions.
- Do NOT answer questions unrelated to health or wellness.
- Keep responses concise but thorough — aim for 150-300 words.
- Never repeat the user's question back at them. Just answer directly.`;

function getClient(): InferenceClient | null {
  if (!HF_TOKEN) return null;
  return new InferenceClient(HF_TOKEN);
}

async function callHuggingFace(
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error('HUGGINGFACE_API_TOKEN not set');

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...conversationHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const completion = await client.chatCompletion({
    model: HF_MODEL,
    messages,
    max_tokens: 500,
    temperature: 0.65,
    top_p: 0.9,
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from HuggingFace');
  return text;
}

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
    // Save user message first
    await pool.query(
      'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
      [req.userId, 'user', userMessage]
    );

    // Fetch recent conversation history for context (last 12 messages, oldest first)
    const historyResult = await pool.query(
      'SELECT role, content FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT 12',
      [req.userId]
    );
    const conversationHistory = historyResult.rows.reverse();

    let assistantContent: string;

    if (!HF_TOKEN) {
      assistantContent =
        'The AI assistant is not configured. Please add the HUGGINGFACE_API_TOKEN secret to enable real AI responses.';
    } else {
      try {
        assistantContent = await callHuggingFace(conversationHistory);
      } catch (aiErr) {
        console.error('HuggingFace AI error:', aiErr);
        assistantContent =
          "I'm having a moment of trouble reaching the AI service. Please try sending your message again — it usually resolves quickly.";
      }
    }

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

export default router;
