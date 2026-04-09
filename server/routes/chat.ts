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

    const assistantContent = generateHeartHealthResponse(userMessage);

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

// Heart health Q&A response engine
// Replace this function body with an OpenAI/Claude API call when ready
function generateHeartHealthResponse(message: string): string {
  const lower = message.toLowerCase();

  // Diet & nutrition
  if (lower.includes('food') || lower.includes('diet') || lower.includes('eat') || lower.includes('nutrition') || lower.includes('meal')) {
    return `A heart-healthy diet focuses on:\n\n• **Fruits & vegetables** – aim for 5+ servings a day; rich in antioxidants and fibre\n• **Whole grains** – oats, brown rice, quinoa lower LDL cholesterol\n• **Healthy fats** – avocados, olive oil, nuts; replace saturated fats from red meat and dairy\n• **Fatty fish** – salmon, mackerel, sardines 2× per week for omega-3s\n• **Legumes** – beans and lentils reduce blood pressure and cholesterol\n• **Limit** – processed foods, added sugars, salt (aim for <2,300 mg sodium/day), and trans fats\n\nThe Mediterranean and DASH diets are both clinically proven to reduce cardiovascular risk. Always tailor your diet with a registered dietitian.`;
  }

  // Exercise
  if (lower.includes('exercise') || lower.includes('workout') || lower.includes('physical activity') || lower.includes('fitness') || lower.includes('walk')) {
    return `Regular physical activity is one of the most powerful tools for heart health:\n\n• **Aerobic exercise** – at least 150 min of moderate activity per week (brisk walking, cycling, swimming) or 75 min of vigorous activity (running, HIIT)\n• **Strength training** – 2+ sessions per week improves metabolism and reduces cardiovascular risk\n• **Reduce sitting** – break up long sedentary periods every 30–60 minutes\n\nBenefits include: lower blood pressure, improved cholesterol, better blood sugar control, reduced inflammation, and stronger heart muscle.\n\nIf you have an existing heart condition, consult your cardiologist before starting a new exercise programme.`;
  }

  // Blood pressure
  if (lower.includes('blood pressure') || lower.includes('hypertension') || lower.includes('systolic') || lower.includes('diastolic') || lower.includes('mmhg')) {
    return `Blood pressure is the force of blood against artery walls, measured in mmHg:\n\n• **Normal** – below 120/80 mmHg\n• **Elevated** – 120–129 / less than 80\n• **Stage 1 Hypertension** – 130–139 / 80–89\n• **Stage 2 Hypertension** – 140+ / 90+\n• **Hypertensive Crisis** – above 180/120 — seek emergency care\n\nHigh blood pressure damages arteries over time and dramatically raises the risk of heart attack, stroke, and kidney disease. It often has no symptoms — that's why it's called the "silent killer."\n\n**How to lower it:** reduce sodium, exercise regularly, limit alcohol, quit smoking, manage stress, and take prescribed medications as directed.`;
  }

  // Cholesterol
  if (lower.includes('cholesterol') || lower.includes('ldl') || lower.includes('hdl') || lower.includes('triglyceride')) {
    return `Cholesterol is a fatty substance carried in your blood. Not all cholesterol is harmful:\n\n• **LDL ("bad")** – deposits in artery walls; target <100 mg/dL (or <70 if high risk)\n• **HDL ("good")** – removes LDL from arteries; target >60 mg/dL\n• **Triglycerides** – another blood fat; target <150 mg/dL\n• **Total cholesterol** – desirable below 200 mg/dL\n\n**To improve your profile:**\n• Eat oats, nuts, and olive oil\n• Exercise regularly\n• Avoid trans fats and limit saturated fats\n• Quit smoking\n• Statins or other medications may be recommended by your doctor\n\nA lipid panel blood test (fasting) gives you a full picture.`;
  }

  // Symptoms — chest pain, shortness of breath
  if (lower.includes('chest pain') || lower.includes('chest tightness') || lower.includes('heart attack') || lower.includes('shortness of breath') || lower.includes('breathless')) {
    return `⚠️ **Important:** If you are currently experiencing chest pain, pressure, tightness, or sudden shortness of breath — please call emergency services (911) immediately. These can be signs of a heart attack.\n\nCommon warning signs of a heart attack:\n• Chest pain, pressure, squeezing, or fullness\n• Pain spreading to the arm, back, neck, or jaw\n• Shortness of breath (with or without chest pain)\n• Nausea, cold sweat, or lightheadedness\n\nWomen may experience more subtle symptoms: unusual fatigue, indigestion, or mild discomfort without obvious chest pain.\n\n**Do not wait** — call emergency services. Early treatment dramatically improves outcomes. I'm an informational tool and cannot replace emergency medical care.`;
  }

  // Smoking
  if (lower.includes('smok') || lower.includes('cigarette') || lower.includes('tobacco') || lower.includes('nicotine') || lower.includes('quit')) {
    return `Smoking is one of the leading causes of heart disease. It:\n\n• Damages the lining of your arteries, accelerating plaque build-up (atherosclerosis)\n• Raises blood pressure and heart rate\n• Reduces oxygen delivery to the heart\n• Increases blood clot risk\n• Lowers HDL ("good") cholesterol\n\n**Good news:** The benefits of quitting start within 20 minutes.\n• After 1 year — heart attack risk drops by 50%\n• After 5 years — stroke risk equals that of a non-smoker\n• After 15 years — heart disease risk equals that of someone who never smoked\n\n**Quitting strategies:** nicotine replacement therapy (patches, gum), prescription medications (varenicline, bupropion), counselling, and support groups all significantly increase success rates.`;
  }

  // Stress
  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('mental health') || lower.includes('depression') || lower.includes('relax')) {
    return `Chronic stress directly harms your heart. It triggers the release of cortisol and adrenaline, which:\n\n• Raise blood pressure and heart rate\n• Promote inflammation in the arteries\n• Increase blood clotting risk\n• Drive unhealthy coping behaviours (overeating, smoking, alcohol)\n\n**Evidence-based ways to reduce stress:**\n• **Mindfulness & meditation** – even 10 minutes daily lowers cortisol\n• **Regular exercise** – releases endorphins and reduces stress hormones\n• **Quality sleep** – 7–9 hours per night is essential for cardiovascular recovery\n• **Social connection** – strong relationships are protective against heart disease\n• **Therapy** – CBT is effective for both anxiety and heart health outcomes\n• **Limit news and screen time** especially before bed\n\nIf stress or anxiety feels unmanageable, speak to a mental health professional.`;
  }

  // Sleep
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired') || lower.includes('rest')) {
    return `Sleep is critical for heart health. Poor sleep is independently linked to higher risk of heart attack, stroke, high blood pressure, and obesity.\n\n**Recommendations:**\n• Adults need **7–9 hours** per night\n• Consistent sleep and wake times regulate your circadian rhythm\n• Sleep apnea (pauses in breathing during sleep) significantly raises cardiovascular risk — talk to your doctor if you snore heavily or feel unrefreshed after sleep\n\n**Tips for better sleep:**\n• Keep your bedroom cool, dark, and quiet\n• Avoid screens for 1 hour before bed\n• Limit caffeine after 2 PM\n• Avoid alcohol — it disrupts sleep quality\n• Regular exercise improves sleep depth`;
  }

  // Alcohol
  if (lower.includes('alcohol') || lower.includes('drink') || lower.includes('wine') || lower.includes('beer')) {
    return `Alcohol and heart health is nuanced:\n\n**Moderate consumption** (up to 1 drink/day for women, 2 for men) has been associated with slightly higher HDL cholesterol in some studies, though recent research questions whether any amount is truly "safe."\n\n**Heavy or binge drinking** clearly harms the heart:\n• Raises blood pressure significantly\n• Causes arrhythmias (irregular heartbeat), especially "holiday heart syndrome"\n• Weakens the heart muscle (alcoholic cardiomyopathy)\n• Raises triglyceride levels\n• Adds empty calories contributing to obesity\n\nIf you don't currently drink, there's no heart-health reason to start. If you do drink, keep it moderate and discuss with your doctor, especially if you have existing heart conditions or take medications.`;
  }

  // Diabetes / blood sugar
  if (lower.includes('glucose') || lower.includes('blood sugar') || lower.includes('diabetes') || lower.includes('insulin')) {
    return `Diabetes is a major cardiovascular risk factor. People with type 2 diabetes are 2–4× more likely to develop heart disease.\n\n**Blood glucose ranges (fasting):**\n• Normal – 70–99 mg/dL\n• Pre-diabetes – 100–125 mg/dL\n• Diabetes – 126 mg/dL or above\n\n**Why it harms the heart:**\n• High glucose damages blood vessel walls\n• Promotes atherosclerosis (plaque build-up)\n• Often occurs alongside high blood pressure and cholesterol\n\n**Managing blood sugar for heart health:**\n• Reduce refined carbohydrates and added sugars\n• Eat high-fibre foods (vegetables, legumes, whole grains)\n• Exercise regularly — muscles absorb glucose during activity\n• Lose weight if overweight — even 5–10% loss improves insulin sensitivity\n• Follow your doctor's medication plan`;
  }

  // BMI / weight
  if (lower.includes('bmi') || lower.includes('weight') || lower.includes('obese') || lower.includes('overweight') || lower.includes('lose weight')) {
    return `Body weight significantly affects cardiovascular health:\n\n**BMI ranges:**\n• Underweight – below 18.5\n• Healthy weight – 18.5–24.9\n• Overweight – 25–29.9\n• Obese – 30 and above\n\nExcess weight — especially abdominal fat — increases blood pressure, raises LDL cholesterol, promotes insulin resistance, and strains the heart.\n\n**Heart-healthy weight loss:**\n• Aim for 0.5–1 kg (1–2 lbs) per week — slow, sustainable loss is best\n• Combine calorie reduction with regular exercise\n• Focus on whole foods, not crash diets\n• Strength training helps maintain muscle mass during weight loss\n• Even modest weight loss (5–10% of body weight) meaningfully reduces cardiovascular risk\n\nA healthcare provider or dietitian can create a personalised plan.`;
  }

  // Medications
  if (lower.includes('medication') || lower.includes('statin') || lower.includes('aspirin') || lower.includes('beta blocker') || lower.includes('medicine') || lower.includes('drug')) {
    return `Several medications are used to protect heart health. Common classes include:\n\n• **Statins** (e.g. atorvastatin, rosuvastatin) – lower LDL cholesterol and reduce heart attack risk\n• **ACE inhibitors / ARBs** – lower blood pressure, protect the kidneys, and reduce heart failure risk\n• **Beta-blockers** – slow heart rate, lower blood pressure, and reduce heart attack risk\n• **Aspirin** – low-dose aspirin may be recommended for people who've had a heart attack (not universally advised for primary prevention)\n• **Blood thinners** – warfarin, apixaban, rivaroxaban prevent blood clots in atrial fibrillation\n\n⚠️ Never start, stop, or adjust heart medications without consulting your doctor. Some medications have important interactions and side effects that need monitoring.`;
  }

  // Arrhythmia / palpitations / irregular heartbeat
  if (lower.includes('palpitation') || lower.includes('irregular') || lower.includes('arrhythmia') || lower.includes('afib') || lower.includes('atrial fibrillation') || lower.includes('flutter')) {
    return `Heart palpitations are sensations of your heart racing, fluttering, or skipping a beat. They're often harmless but can sometimes indicate an arrhythmia.\n\n**Common triggers:**\n• Caffeine or stimulants\n• Stress and anxiety\n• Dehydration\n• Alcohol\n• Lack of sleep\n\n**Atrial fibrillation (AFib)** is the most common serious arrhythmia — the upper chambers of the heart beat chaotically, increasing stroke risk by 5×. Symptoms include irregular heartbeat, fatigue, shortness of breath, and dizziness.\n\n**See a doctor if palpitations:**\n• Are frequent or prolonged\n• Come with chest pain, shortness of breath, or fainting\n• Occur after physical activity\n\nAn ECG (electrocardiogram) can diagnose most arrhythmias.`;
  }

  // Stroke
  if (lower.includes('stroke') || lower.includes('tia') || lower.includes('transient')) {
    return `A stroke occurs when blood supply to part of the brain is cut off — either by a clot (ischaemic stroke, 87% of cases) or a burst blood vessel (haemorrhagic stroke).\n\n**FAST warning signs:**\n• **F**ace drooping on one side\n• **A**rm weakness — unable to raise both arms\n• **S**peech difficulty — slurred or strange\n• **T**ime to call emergency services immediately\n\n**Cardiovascular risk factors that increase stroke risk:** high blood pressure (the #1 risk factor), AFib, high cholesterol, diabetes, smoking, obesity.\n\n**Prevention:** managing these risk factors is the most effective strategy. Anticoagulants (blood thinners) are often prescribed for people with AFib to prevent stroke.`;
  }

  // Family history / genetics
  if (lower.includes('family history') || lower.includes('genetic') || lower.includes('hereditary') || lower.includes('inherited')) {
    return `Family history is a significant — but not destiny-defining — risk factor for heart disease.\n\n**High-risk indicators:**\n• A first-degree relative (parent or sibling) with heart disease before age 55 (men) or 65 (women)\n• Family history of sudden cardiac death, high cholesterol, or diabetes\n\n**What you can do:**\n• Tell your doctor — they may recommend earlier or more frequent screening\n• Get a lipid panel and blood pressure checked regularly\n• Focus harder on modifiable risk factors (diet, exercise, smoking, stress)\n• Ask about genetic testing for conditions like familial hypercholesterolaemia (FH)\n\nHaving a family history means you may need to work harder at prevention, but heart disease is not inevitable.`;
  }

  // General greeting or unclear
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.match(/^(good morning|good afternoon|good evening)/) ) {
    return `Hello! I'm your Heart Health Assistant. I'm here to answer your questions about cardiovascular health, including:\n\n• Diet and nutrition for a healthy heart\n• Exercise and physical activity\n• Managing blood pressure, cholesterol, and blood sugar\n• Understanding heart conditions and symptoms\n• Lifestyle changes to reduce cardiovascular risk\n• Medications and when to see a doctor\n\nWhat would you like to know?`;
  }

  // Fallback
  return `That's a great question about heart health. While I don't have a specific answer ready for that exact topic, here's what I can help you with:\n\n• **Diet & nutrition** – heart-healthy foods and eating patterns\n• **Exercise** – how much and what type is best\n• **Blood pressure & cholesterol** – understanding your numbers\n• **Symptoms** – what warning signs to watch for\n• **Risk factors** – diabetes, smoking, stress, sleep, obesity\n• **Medications** – common heart drugs explained\n• **Family history** – how genetics affect your risk\n\nTry asking me about any of these topics, or rephrase your question and I'll do my best to help. Remember — for personal medical decisions, always consult a qualified healthcare professional.`;
}

export default router;
