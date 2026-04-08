import { Router, Response } from 'express';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/assessment — submit vitals and get a risk score
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { cholesterol, bmi, heart_rate, glucose, pulse_pressure, ecg_file_url } = req.body;

  if (!cholesterol || !bmi || !heart_rate || !glucose || !pulse_pressure) {
    res.status(400).json({ error: 'All vitals fields are required: cholesterol, bmi, heart_rate, glucose, pulse_pressure' });
    return;
  }

  const vitals = {
    cholesterol: Number(cholesterol),
    bmi: Number(bmi),
    heart_rate: Number(heart_rate),
    glucose: Number(glucose),
    pulse_pressure: Number(pulse_pressure),
  };

  const risk_score = calculateRiskScore(vitals);
  const risk_level = risk_score < 33 ? 'low' : risk_score < 66 ? 'moderate' : 'high';

  try {
    const result = await pool.query(
      `INSERT INTO risk_assessments
         (user_id, cholesterol, bmi, heart_rate, glucose, pulse_pressure, ecg_file_url, risk_score, risk_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.userId,
        vitals.cholesterol,
        vitals.bmi,
        vitals.heart_rate,
        vitals.glucose,
        vitals.pulse_pressure,
        ecg_file_url || null,
        risk_score,
        risk_level,
      ]
    );
    res.status(201).json({ assessment: result.rows[0] });
  } catch (err) {
    console.error('Assessment save error:', err);
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// GET /api/assessment/latest — most recent assessment for the logged-in user
router.get('/latest', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM risk_assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.userId]
    );
    res.json({ assessment: result.rows[0] || null });
  } catch (err) {
    console.error('Assessment fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// GET /api/assessment/history — all assessments, newest first
router.get('/history', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM risk_assessments WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ assessments: result.rows });
  } catch (err) {
    console.error('Assessment history error:', err);
    res.status(500).json({ error: 'Failed to fetch assessment history' });
  }
});

// Risk score calculation based on standard cardiovascular risk thresholds
function calculateRiskScore({
  cholesterol,
  bmi,
  heart_rate,
  glucose,
  pulse_pressure,
}: {
  cholesterol: number;
  bmi: number;
  heart_rate: number;
  glucose: number;
  pulse_pressure: number;
}): number {
  let score = 0;

  // Cholesterol (optimal: <200, borderline: 200-239, high: ≥240 mg/dL)
  if (cholesterol >= 240) score += 25;
  else if (cholesterol >= 200) score += 15;
  else if (cholesterol < 125) score += 10;

  // BMI (normal: 18.5-24.9, overweight: 25-29.9, obese: ≥30)
  if (bmi >= 30) score += 20;
  else if (bmi >= 25) score += 10;
  else if (bmi < 18.5) score += 5;

  // Resting heart rate (normal: 60-100 BPM)
  if (heart_rate > 100) score += 15;
  else if (heart_rate < 50) score += 10;

  // Fasting glucose (normal: 70-99, pre-diabetic: 100-125, diabetic: ≥126 mg/dL)
  if (glucose >= 126) score += 20;
  else if (glucose >= 100) score += 10;
  else if (glucose < 70) score += 5;

  // Pulse pressure (normal: 40-60 mmHg; elevated >60 is a cardiac risk factor)
  if (pulse_pressure > 80) score += 20;
  else if (pulse_pressure > 60) score += 10;
  else if (pulse_pressure < 25) score += 10;

  return Math.min(score, 100);
}

export default router;
