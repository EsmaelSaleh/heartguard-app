# HeartGuard

A cardiac risk assessment web application built with React + Vite + TypeScript + Tailwind CSS.

## Architecture

- **Frontend**: React 19 + TypeScript + Vite, served on port 5000
- **Styling**: Tailwind CSS v3 + Framer Motion animations
- **Routing**: React Router DOM v7
- **Database**: Replit PostgreSQL (connection via `DATABASE_URL` env var)

## Database Schema

All tables use UUID primary keys via `gen_random_uuid()`.

### `users`
Core authentication table.
- `id` UUID PK
- `email` VARCHAR(255) UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL
- `full_name` VARCHAR(255)
- `created_at`, `updated_at` TIMESTAMP

### `sessions`
Token-based session management.
- `id` UUID PK
- `user_id` UUID FK → users
- `token` TEXT UNIQUE NOT NULL
- `expires_at` TIMESTAMP NOT NULL
- `created_at` TIMESTAMP

### `user_profiles`
Onboarding Step 1 — basic info.
- `id` UUID PK
- `user_id` UUID FK → users (UNIQUE — one profile per user)
- `gender` VARCHAR(20)
- `date_of_birth` DATE
- `created_at`, `updated_at` TIMESTAMP

### `lifestyle_data`
Onboarding Step 2 — lifestyle habits.
- `id` UUID PK
- `user_id` UUID FK → users (UNIQUE)
- `cigarettes_per_day` INTEGER DEFAULT 0
- `created_at`, `updated_at` TIMESTAMP

### `medical_history`
Onboarding Step 3 — medical conditions.
- `id` UUID PK
- `user_id` UUID FK → users (UNIQUE)
- `conditions` TEXT[] DEFAULT '{}' — e.g. ['Hypertension', 'Diabetes']
- `has_test_results` BOOLEAN DEFAULT FALSE
- `created_at`, `updated_at` TIMESTAMP

### `risk_assessments`
Clinical vitals + ECG upload + calculated risk score. Multiple assessments per user allowed.
- `id` UUID PK
- `user_id` UUID FK → users
- `cholesterol` NUMERIC(6,2) — mg/dL
- `bmi` NUMERIC(5,2) — kg/m²
- `heart_rate` INTEGER — BPM
- `glucose` NUMERIC(6,2) — mg/dL
- `pulse_pressure` NUMERIC(6,2) — mmHg
- `ecg_file_url` TEXT — uploaded ECG image URL
- `risk_score` NUMERIC(5,2) — 0–100
- `risk_level` VARCHAR(20) — 'low' | 'moderate' | 'high'
- `created_at` TIMESTAMP

### `chat_messages`
Chatbot conversation history.
- `id` UUID PK
- `user_id` UUID FK → users
- `role` VARCHAR(20) CHECK IN ('user', 'assistant')
- `content` TEXT NOT NULL
- `created_at` TIMESTAMP

## Build Order

1. ✅ Database — schema designed and provisioned
2. 🔲 Backend — Express API server (auth, assessments, chatbot endpoints)
3. 🔲 Signup / Login — wire existing UI to real auth endpoints

## Running the App

```bash
npm run dev
```

Starts the Vite dev server on `http://0.0.0.0:5000`.
