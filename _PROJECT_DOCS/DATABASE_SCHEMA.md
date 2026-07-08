# Database Schema

## Core tables
The schema is defined in db.js and initialized on server startup.

### users
Stores user accounts.
- id: serial primary key
- name: text
- email: unique text
- password_hash: text
- year: text
- created_at: timestamp

### patients
Stores the patient roster and treatment-state data.
- id: text primary key
- user_id: foreign key to users
- alias: text
- chart_number: text
- procedure: text
- discipline: text
- last_visit: text
- treatment_start: text
- expected_completion: text
- next_appt: text
- next_appt_time: text
- treatment_complete: boolean
- lab_status: text
- lab_sent_date: text
- lab_received_date: text
- pre_auth: text
- pre_auth_submitted_date: text
- notes: text
- handoff_partner: text
- handoff_partner_year: text
- handoff_notes: text
- patient_language: text
- is_primary_provider: boolean
- shared_with_d3: boolean
- created_at / updated_at: timestamps

### visit_logs
Stores individual visit history for each patient.
- id: serial primary key
- patient_id: foreign key to patients
- visit_date: text
- procedure: text
- notes: text
- cdt_code: text
- created_at: timestamp

### student_notes
Stores user-created notes.
- id: text primary key
- user_id: foreign key to users
- title: text
- body: text
- category: text
- pinned: boolean
- updated_at: text

### rotations
Stores clinical rotations and recurring schedule information.
- id: text primary key
- user_id: foreign key to users
- site: text
- type: text
- start_date: text
- end_date: text
- recurring: boolean
- recurring_day: text
- notes: text
- color: text
- time: text

### user_settings
Stores personalization settings.
- user_id: primary key foreign key to users
- graduation_date: text
- custom_goals: JSONB
- clinic_schedule: JSONB

### changelog
Stores a simple audit trail for user actions.
- id: text primary key
- timestamp: timestamp
- user_id: foreign key to users
- user_name: text
- user_year: text
- action_type: text
- patient_alias: text
- description: text

### providers
Stores provider directory entries.
- id: text primary key
- user_id: foreign key to users
- name: text
- role: text
- discipline: text
- phone: text
- email: text
- notes: text
- created_at: timestamp

## Schema migrations / adjustments
The initialization script also applies two ALTER TABLE statements to add is_primary_provider and shared_with_d3 to the patients table if they are missing.

## Needs Verification
- There is no separate migration system or versioned migration folder in the repo.
- The schema is created directly by the startup script, so production schema evolution relies on this code path.
