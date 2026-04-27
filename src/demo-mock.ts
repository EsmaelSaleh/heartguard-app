// Temporary demo mode — used ONLY for screenshots. Remove after screenshots are taken.

const DEMO_ASSESSMENT = {
  id: 'demo-001',
  user_id: 'demo-user',
  cholesterol: 218,
  bmi: 27.4,
  heart_rate: 74,
  glucose: 98,
  pulse_pressure: 48,
  ecg_file_url: null,
  ecg_classification: 'Normal Sinus Rhythm',
  tabular_risk: '0.4200',
  combined_risk_score: '0.4700',
  risk_score: 47,
  risk_level: 'moderate',
  analysis_findings: 'Your cardiovascular risk profile shows a moderate risk level. Key contributing factors include borderline cholesterol levels and a slightly elevated BMI. Your heart rate and glucose levels are within normal range. With targeted lifestyle modifications, you can significantly reduce your risk within 3–6 months.',
  diet_plan: 'Adopt a Mediterranean-style diet rich in omega-3 fatty acids, leafy greens, and whole grains. Limit saturated fats to under 7% of daily calories. Increase soluble fibre intake through oats, legumes, and fruits.',
  exercise_rec: 'Aim for at least 150 minutes of moderate-intensity aerobic exercise per week (brisk walking, cycling, swimming). Add 2 sessions of resistance training weekly.',
  lifestyle_rec: 'Maintain a consistent sleep schedule of 7–9 hours per night. Practice stress management through mindfulness or yoga. Avoid smoking and limit alcohol intake.',
  medical_rec: 'Schedule a follow-up lipid panel in 3 months to monitor cholesterol. Discuss statin eligibility with your GP. Measure blood pressure at home weekly.',
  created_at: '2026-04-20T09:30:00.000Z',
};

const DEMO_HISTORY = [
  { ...DEMO_ASSESSMENT, id: 'demo-001', risk_score: 47, combined_risk_score: '0.4700', created_at: '2026-04-20T09:30:00.000Z' },
  { ...DEMO_ASSESSMENT, id: 'demo-002', risk_score: 52, combined_risk_score: '0.5200', created_at: '2026-03-15T10:00:00.000Z' },
  { ...DEMO_ASSESSMENT, id: 'demo-003', risk_score: 55, combined_risk_score: '0.5500', created_at: '2026-02-10T08:45:00.000Z' },
  { ...DEMO_ASSESSMENT, id: 'demo-004', risk_score: 61, combined_risk_score: '0.6100', created_at: '2026-01-05T14:20:00.000Z' },
  { ...DEMO_ASSESSMENT, id: 'demo-005', risk_score: 58, combined_risk_score: '0.5800', created_at: '2025-12-01T11:10:00.000Z' },
];

const DEMO_SESSIONS = [
  { id: 's1', title: 'Heart rate concerns', created_at: '2026-04-20T09:00:00Z', updated_at: '2026-04-20T09:15:00Z', last_message: 'Thank you, that was very helpful!', message_count: 6 },
  { id: 's2', title: 'Diet recommendations', created_at: '2026-04-18T14:00:00Z', updated_at: '2026-04-18T14:30:00Z', last_message: 'I will try the Mediterranean diet.', message_count: 8 },
  { id: 's3', title: 'Exercise after assessment', created_at: '2026-04-15T10:00:00Z', updated_at: '2026-04-15T10:20:00Z', last_message: 'Great, I will start tomorrow.', message_count: 4 },
];

const DEMO_MESSAGES = [
  { id: 'm1', role: 'user', content: 'What does a moderate risk score mean for me?', created_at: '2026-04-20T09:01:00Z' },
  { id: 'm2', role: 'assistant', content: 'A moderate risk score of 47 means you have some cardiovascular risk factors that should be addressed, but your overall risk is manageable. The main areas to focus on are your cholesterol levels and BMI. With consistent lifestyle changes — particularly a heart-healthy diet and regular exercise — you can meaningfully lower your score within 3–6 months.\n\n**Key steps for you:**\n- Reduce saturated fat intake\n- Aim for 30 min of brisk walking daily\n- Schedule a cholesterol recheck in 3 months', created_at: '2026-04-20T09:02:00Z' },
  { id: 'm3', role: 'user', content: 'What foods should I avoid?', created_at: '2026-04-20T09:05:00Z' },
  { id: 'm4', role: 'assistant', content: 'To help manage your cholesterol and BMI, try to limit:\n\n- **Saturated fats**: red meat, full-fat dairy, processed meats\n- **Trans fats**: fried foods, packaged pastries\n- **Refined carbs**: white bread, sugary drinks\n- **Sodium**: canned soups, fast food\n\nInstead, focus on oily fish, avocados, nuts, legumes, and plenty of vegetables. A Mediterranean-style diet is strongly recommended for your profile.', created_at: '2026-04-20T09:06:00Z' },
];

const DEMO_ONBOARDING = {
  profile: { gender: 'male', date_of_birth: '1990-06-15' },
  lifestyle: { cigarettes_per_day: 0 },
  medical_history: { conditions: [], has_test_results: true },
  complete: true,
};

const ROUTES: Record<string, unknown> = {
  '/api/auth/me': { user: { id: 'demo-user', email: 'esmael@heartguard.io', full_name: 'Esmael Saleh' } },
  '/api/onboarding/status': DEMO_ONBOARDING,
  '/api/assessment/latest': { assessment: DEMO_ASSESSMENT },
  '/api/assessment/history': { assessments: DEMO_HISTORY },
  '/api/chat/sessions': { sessions: DEMO_SESSIONS },
  '/api/chat/messages': { messages: DEMO_MESSAGES },
};

export function installDemoFetchMock() {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    const path = url.startsWith('/') ? url.split('?')[0] : new URL(url).pathname;

    // Match known demo routes
    for (const [route, data] of Object.entries(ROUTES)) {
      if (path === route || path.startsWith(route + '?')) {
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Swallow write calls silently (POST/PUT/DELETE to API)
    if ((init?.method === 'POST' || init?.method === 'PUT' || init?.method === 'DELETE') && path.startsWith('/api/')) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return originalFetch(input, init);
  };
}
