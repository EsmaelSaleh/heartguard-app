# HeartGuard

A cardiac risk assessment web application built with React + Vite + TypeScript + Tailwind CSS. Full production build — all pages connected to the Express API and PostgreSQL database (no mock data in the critical path).

## Architecture

- **Frontend**: React 19 + TypeScript + Vite, served on port 5000
- **Backend**: Express + TypeScript (`tsx watch`), port 3001
- **Styling**: Tailwind CSS v3 + Framer Motion animations
- **Routing**: React Router DOM v7
- **Database**: Replit PostgreSQL (connection via `DATABASE_URL` env var)
- **Auth**: httpOnly cookie sessions (30-day expiry), bcrypt (12 rounds). Also supports `Authorization: Bearer <token>` header for mobile clients.
- **Mobile support**: CORS allows all origins (including no-origin mobile requests). Login/signup return `token` in JSON body alongside the cookie so mobile apps can store and send the token manually.

## User Flow

1. `/` Landing page
2. `/signup` → Register (no session created) → Success screen → redirect to `/login`
3. `/login` → Sets session → checks `/api/onboarding/status`
   - No profile → `/onboarding/welcome` → basic-info → lifestyle → medical-history → `/risk-assessment/vitals`
   - Has profile → `/dashboard`
4. `/risk-assessment/vitals` → enter metrics → pass via router state to `/risk-assessment/ecg`
5. `/risk-assessment/ecg` → optional ECG upload → POST `/api/assessment` → `/risk-report`
6. `/risk-report` → loads from `/api/assessment/latest`, dynamic AI analysis
7. `/dashboard` → smart: shows empty state (no assessments) OR full dashboard with real data
8. `/chatbot` → persisted conversation via `/api/chat/*`

## Database Schema

All tables use UUID primary keys via `gen_random_uuid()`.

### `users`
- `id` UUID PK, `email` UNIQUE, `password_hash`, `full_name`, `created_at`, `updated_at`

### `sessions`
- `id` UUID PK, `user_id` FK→users, `token` UNIQUE, `expires_at`, `created_at`

### `user_profiles`
- `id` UUID PK, `user_id` FK→users UNIQUE, `gender`, `date_of_birth`, timestamps

### `lifestyle_data`
- `id` UUID PK, `user_id` FK→users UNIQUE, `cigarettes_per_day`, timestamps

### `medical_history`
- `id` UUID PK, `user_id` FK→users UNIQUE, `conditions TEXT[]`, `has_test_results BOOLEAN`, timestamps

### `risk_assessments`
- `id` UUID PK, `user_id` FK→users, `cholesterol NUMERIC`, `bmi NUMERIC`, `heart_rate INTEGER`, `glucose NUMERIC`, `pulse_pressure NUMERIC`, `ecg_file_url TEXT`, `risk_score NUMERIC`, `risk_level VARCHAR`, `created_at`
- **AI fields** (added via startup migration): `ecg_classification TEXT`, `tabular_risk NUMERIC(6,4)`, `combined_risk_score NUMERIC(6,4)`, `analysis_findings TEXT`, `diet_plan TEXT`, `exercise_rec TEXT`, `lifestyle_rec TEXT`, `medical_rec TEXT`
- Risk scoring: low < 33, moderate 33–66, high > 66 (derived from `combined_risk_score × 100`)

### `chat_messages`
- `id` UUID PK, `user_id` FK→users, `role VARCHAR`, `content TEXT`, `created_at`

## API Endpoints

All routes prefixed `/api/`, proxied from Vite (port 5000) to Express (port 3001).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account only (no session) |
| POST | `/api/auth/signup` | — | Create account + session |
| POST | `/api/auth/login` | — | Log in, sets session cookie |
| POST | `/api/auth/logout` | ✓ | Destroys session |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/onboarding/status` | ✓ | All onboarding data |
| PUT | `/api/onboarding/profile` | ✓ | Save gender + date_of_birth |
| PUT | `/api/onboarding/lifestyle` | ✓ | Save cigarettes_per_day |
| PUT | `/api/onboarding/medical-history` | ✓ | Save conditions + has_test_results |
| POST | `/api/assessment` | ✓ | Submit vitals + optional ECG file (multipart/form-data), calls external AI, returns risk score |
| GET | `/api/assessment/latest` | ✓ | Most recent assessment |
| GET | `/api/assessment/history` | ✓ | All past assessments |
| GET | `/api/chat/messages` | ✓ | Fetch chat history |
| POST | `/api/chat/message` | ✓ | Send message, get AI response |
| DELETE | `/api/chat/messages` | ✓ | Clear chat history |
| GET | `/api/health` | — | Server health check |

## Key Implementation Notes

- PostgreSQL NUMERIC fields return as strings — normalized via `parseAssessment()` in dashboard/report
- Vitals passed from VitalsPage → ECGPage via React Router location state (not localStorage)
- `/dashboard-results` redirects to `/dashboard` for backward compatibility
- Chat uses keyword-based stub responses (ready for OpenAI swap via `server/routes/chat.ts`)
- All onboarding saves use `ON CONFLICT (user_id) DO UPDATE` (safe upsert)
- **Real AI integration**: `POST /api/assessment` calls `https://esmael-saleh-heartguardassessment.hf.space/comprehensive_assessment` (multipart/form-data with `file` + `patient_data_json`). Falls back to local score calculation if external API fails or times out (30s timeout). Sends a 1×1 blank PNG placeholder when no ECG is uploaded.
- Patient data for AI is built at assessment time from user's profile (gender, DOB→age), lifestyle (cigsPerDay), and medical history (conditions → prevalentHyp, prevalentStroke, diabetes)
- Risk score: `combined_risk_score × 100` (integer, 0–100). Risk level: < 33 low, 33–65 moderate, ≥ 66 high
- Risk report shows AI-generated analysis_findings + per-category recommendations (diet, exercise, lifestyle, medical); falls back to locally-generated text for older assessments that lack AI fields
- DB schema additions run as idempotent `ALTER TABLE … ADD COLUMN IF NOT EXISTS` on every server startup

## Running the App

```bash
npm run dev      # Frontend — Vite on port 5000
npm run server   # Backend  — Express on port 3001
```
