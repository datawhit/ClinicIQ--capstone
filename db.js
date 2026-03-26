import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      year TEXT NOT NULL DEFAULT 'D3',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      alias TEXT,
      chart_number TEXT NOT NULL,
      procedure TEXT DEFAULT '',
      discipline TEXT DEFAULT 'General Dentistry',
      last_visit TEXT DEFAULT '',
      treatment_start TEXT DEFAULT '',
      expected_completion TEXT DEFAULT '',
      next_appt TEXT,
      next_appt_time TEXT DEFAULT '',
      treatment_complete BOOLEAN DEFAULT false,
      lab_status TEXT DEFAULT 'None',
      lab_sent_date TEXT DEFAULT '',
      lab_received_date TEXT DEFAULT '',
      pre_auth TEXT DEFAULT 'Not Submitted',
      pre_auth_submitted_date TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      handoff_partner TEXT DEFAULT '',
      handoff_partner_year TEXT DEFAULT 'D3',
      handoff_notes TEXT DEFAULT '',
      patient_language TEXT DEFAULT 'English',
      is_primary_provider BOOLEAN DEFAULT true,
      shared_with_d3 BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS visit_logs (
      id SERIAL PRIMARY KEY,
      patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
      visit_date TEXT NOT NULL,
      procedure TEXT NOT NULL,
      notes TEXT DEFAULT '',
      cdt_code TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS student_notes (
      id TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT DEFAULT '',
      body TEXT DEFAULT '',
      category TEXT DEFAULT 'General',
      pinned BOOLEAN DEFAULT false,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rotations (
      id TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      site TEXT NOT NULL,
      type TEXT DEFAULT '',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      recurring BOOLEAN DEFAULT false,
      recurring_day TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      color TEXT DEFAULT '#0891b2',
      time TEXT DEFAULT '08:00'
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      graduation_date TEXT DEFAULT '2026-05-15',
      custom_goals JSONB DEFAULT '[]',
      clinic_schedule JSONB DEFAULT '{}'
    );
  `);
  // Migrate existing tables — safe to run multiple times
  await pool.query(`
    ALTER TABLE patients ADD COLUMN IF NOT EXISTS is_primary_provider BOOLEAN DEFAULT true;
    ALTER TABLE patients ADD COLUMN IF NOT EXISTS shared_with_d3 BOOLEAN DEFAULT false;
  `);
  console.log('Database schema initialized');
}

export default pool;
