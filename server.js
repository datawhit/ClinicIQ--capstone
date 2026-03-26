import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import bcrypt from 'bcryptjs';
import pool, { initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set. Please add it to Secrets.');
  process.exit(1);
}
const anthropic = new Anthropic({ apiKey });

const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'cliniq-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  next();
};

// ── Auth routes ──────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, year } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, year) VALUES ($1,$2,$3,$4) RETURNING id, name, email, year',
      [name, email.toLowerCase(), hash, year || 'D3']
    );
    const user = result.rows[0];
    // seed default settings
    await pool.query(
      'INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [user.id]
    );
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userYear = user.year;
    res.json({ user: { id: user.id, name: user.name, email: user.email, year: user.year } });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, name, year } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });
  try {
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    let user = result.rows[0];
    if (!user) {
      // auto-register on first login
      const hash = await bcrypt.hash(password || 'testing-placeholder', 10);
      const ins = await pool.query(
        'INSERT INTO users (name, email, password_hash, year) VALUES ($1,$2,$3,$4) RETURNING id, name, email, year',
        [name || email.split('@')[0], email.toLowerCase(), hash, year || 'D3']
      );
      user = ins.rows[0];
      await pool.query('INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [user.id]);
    }
    // NOTE: password verification bypassed for testing phase — re-enable before production
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userYear = user.year;
    res.json({ user: { id: user.id, name: user.name, email: user.email, year: user.year } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!result.rows[0]) return res.status(404).json({ error: 'No account found with that email' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email.toLowerCase()]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Reset error:', err.message);
    res.status(500).json({ error: 'Reset failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/auth/me', async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  try {
    const r = await pool.query('SELECT id, name, email, year FROM users WHERE id=$1', [req.session.userId]);
    res.json({ user: r.rows[0] || null });
  } catch {
    res.json({ user: null });
  }
});

// ── Patients ─────────────────────────────────────────────────────────────────

app.get('/api/patients', requireAuth, async (req, res) => {
  try {
    const { rows: patients } = await pool.query(
      'SELECT * FROM patients WHERE user_id=$1 ORDER BY created_at ASC',
      [req.session.userId]
    );
    const { rows: visits } = await pool.query(
      `SELECT vl.* FROM visit_logs vl
       JOIN patients p ON vl.patient_id = p.id
       WHERE p.user_id=$1 ORDER BY vl.visit_date ASC`,
      [req.session.userId]
    );
    const result = patients.map(p => ({
      id: p.id,
      alias: p.alias,
      chartNumber: p.chart_number,
      procedure: p.procedure,
      discipline: p.discipline,
      lastVisit: p.last_visit,
      treatmentStart: p.treatment_start,
      expectedCompletion: p.expected_completion,
      nextAppt: p.next_appt,
      nextApptTime: p.next_appt_time,
      treatmentComplete: p.treatment_complete,
      labStatus: p.lab_status,
      labSentDate: p.lab_sent_date,
      labReceivedDate: p.lab_received_date,
      preAuth: p.pre_auth,
      preAuthSubmittedDate: p.pre_auth_submitted_date,
      notes: p.notes,
      handoffPartner: p.handoff_partner,
      handoffPartnerYear: p.handoff_partner_year,
      handoffNotes: p.handoff_notes,
      patientLanguage: p.patient_language,
      isPrimaryProvider: p.is_primary_provider !== false,
      sharedWithD3: p.shared_with_d3 || false,
      visitLog: visits
        .filter(v => v.patient_id === p.id)
        .map(v => ({ id: v.id, date: v.visit_date, procedure: v.procedure, notes: v.notes, cdtCode: v.cdt_code })),
    }));
    res.json(result);
  } catch (err) {
    console.error('Get patients error:', err.message);
    res.status(500).json({ error: 'Failed to load patients' });
  }
});

app.post('/api/patients', requireAuth, async (req, res) => {
  const p = req.body;
  try {
    const { rows: existing } = await pool.query('SELECT COUNT(*) FROM patients WHERE user_id=$1', [req.session.userId]);
    const count = parseInt(existing[0].count);
    // Use timestamp-based ID to guarantee uniqueness regardless of deletes/gaps
    const id = `PT-${Date.now().toString(36).toUpperCase()}`;
    const year = new Date().getFullYear();
    const alias = p.alias || `P-${year}-${String(count + 1).padStart(3, '0')}`;
    await pool.query(`
      INSERT INTO patients (id,user_id,alias,chart_number,procedure,discipline,last_visit,treatment_start,
        expected_completion,next_appt,next_appt_time,treatment_complete,lab_status,lab_sent_date,
        lab_received_date,pre_auth,pre_auth_submitted_date,notes,handoff_partner,handoff_partner_year,
        handoff_notes,patient_language,is_primary_provider,shared_with_d3)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
      [id, req.session.userId, alias, p.chartNumber||'', p.procedure||'', p.discipline||'General Dentistry',
       p.lastVisit||'', p.treatmentStart||'', p.expectedCompletion||'', p.nextAppt||null,
       p.nextApptTime||'', p.treatmentComplete||false, p.labStatus||'None', p.labSentDate||'',
       p.labReceivedDate||'', p.preAuth||'Not Submitted', p.preAuthSubmittedDate||'',
       p.notes||'', p.handoffPartner||'', p.handoffPartnerYear||'D3', p.handoffNotes||'',
       p.patientLanguage||'English', p.isPrimaryProvider !== false, p.sharedWithD3||false]
    );
    // seed initial visit if provided
    if (p.lastVisit && p.procedure) {
      await pool.query(
        'INSERT INTO visit_logs (patient_id,visit_date,procedure,notes,cdt_code) VALUES ($1,$2,$3,$4,$5)',
        [id, p.lastVisit, p.procedure, 'Initial visit.', '']
      );
    }
    // return full patient
    const { rows } = await pool.query('SELECT * FROM patients WHERE id=$1', [id]);
    const { rows: visits } = await pool.query('SELECT * FROM visit_logs WHERE patient_id=$1 ORDER BY visit_date ASC', [id]);
    const row = rows[0];
    res.json({
      id: row.id, alias: row.alias, chartNumber: row.chart_number,
      procedure: row.procedure, discipline: row.discipline, lastVisit: row.last_visit,
      treatmentStart: row.treatment_start, expectedCompletion: row.expected_completion,
      nextAppt: row.next_appt, nextApptTime: row.next_appt_time, treatmentComplete: row.treatment_complete,
      labStatus: row.lab_status, labSentDate: row.lab_sent_date, labReceivedDate: row.lab_received_date,
      preAuth: row.pre_auth, preAuthSubmittedDate: row.pre_auth_submitted_date, notes: row.notes,
      handoffPartner: row.handoff_partner, handoffPartnerYear: row.handoff_partner_year,
      handoffNotes: row.handoff_notes, patientLanguage: row.patient_language,
      isPrimaryProvider: row.is_primary_provider !== false,
      sharedWithD3: row.shared_with_d3 || false,
      visitLog: visits.map(v => ({ id: v.id, date: v.visit_date, procedure: v.procedure, notes: v.notes, cdtCode: v.cdt_code })),
    });
  } catch (err) {
    console.error('Add patient error:', err.message);
    res.status(500).json({ error: 'Failed to add patient' });
  }
});

app.put('/api/patients/:id', requireAuth, async (req, res) => {
  const p = req.body;
  try {
    await pool.query(`
      UPDATE patients SET
        chart_number=$1, procedure=$2, discipline=$3, last_visit=$4, treatment_start=$5,
        expected_completion=$6, next_appt=$7, next_appt_time=$8, treatment_complete=$9,
        lab_status=$10, lab_sent_date=$11, lab_received_date=$12, pre_auth=$13,
        pre_auth_submitted_date=$14, notes=$15, handoff_partner=$16, handoff_partner_year=$17,
        handoff_notes=$18, patient_language=$19, is_primary_provider=$20, shared_with_d3=$21,
        updated_at=NOW()
      WHERE id=$22 AND user_id=$23`,
      [p.chartNumber||'', p.procedure||'', p.discipline||'General Dentistry',
       p.lastVisit||'', p.treatmentStart||'', p.expectedCompletion||'',
       p.nextAppt||null, p.nextApptTime||'', p.treatmentComplete||false,
       p.labStatus||'None', p.labSentDate||'', p.labReceivedDate||'',
       p.preAuth||'Not Submitted', p.preAuthSubmittedDate||'', p.notes||'',
       p.handoffPartner||'', p.handoffPartnerYear||'D3', p.handoffNotes||'',
       p.patientLanguage||'English', p.isPrimaryProvider !== false, p.sharedWithD3||false,
       req.params.id, req.session.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Update patient error:', err.message);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

app.delete('/api/patients/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM patients WHERE id=$1 AND user_id=$2', [req.params.id, req.session.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

// ── Visit Logs ────────────────────────────────────────────────────────────────

app.post('/api/patients/:id/visits', requireAuth, async (req, res) => {
  const { date, procedure, notes, cdtCode, nextAppt } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO visit_logs (patient_id,visit_date,procedure,notes,cdt_code) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.params.id, date, procedure, notes||'', cdtCode||'']
    );
    // update patient lastVisit and nextAppt
    await pool.query(
      'UPDATE patients SET last_visit=$1, procedure=$2, next_appt=$3, updated_at=NOW() WHERE id=$4 AND user_id=$5',
      [date, procedure, nextAppt||null, req.params.id, req.session.userId]
    );
    const v = rows[0];
    res.json({ id: v.id, date: v.visit_date, procedure: v.procedure, notes: v.notes, cdtCode: v.cdt_code });
  } catch (err) {
    console.error('Add visit error:', err.message);
    res.status(500).json({ error: 'Failed to log visit' });
  }
});

app.delete('/api/patients/:id/visits/:visitId', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM visit_logs WHERE id=$1 AND patient_id=$2', [req.params.visitId, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete visit' });
  }
});

// ── Student Notes ─────────────────────────────────────────────────────────────

app.get('/api/notes', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM student_notes WHERE user_id=$1 ORDER BY pinned DESC, updated_at DESC', [req.session.userId]);
    res.json(rows.map(n => ({ id: n.id, title: n.title, body: n.body, category: n.category, pinned: n.pinned, updatedAt: n.updated_at })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load notes' });
  }
});

app.post('/api/notes', requireAuth, async (req, res) => {
  const { id, title, body, category, pinned, updatedAt } = req.body;
  try {
    await pool.query(
      'INSERT INTO student_notes (id,user_id,title,body,category,pinned,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id, req.session.userId, title||'', body||'', category||'General', pinned||false, updatedAt]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

app.put('/api/notes/:id', requireAuth, async (req, res) => {
  const { title, body, category, pinned, updatedAt } = req.body;
  try {
    await pool.query(
      'UPDATE student_notes SET title=$1,body=$2,category=$3,pinned=$4,updated_at=$5 WHERE id=$6 AND user_id=$7',
      [title||'', body||'', category||'General', pinned||false, updatedAt, req.params.id, req.session.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM student_notes WHERE id=$1 AND user_id=$2', [req.params.id, req.session.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// ── Rotations ─────────────────────────────────────────────────────────────────

app.get('/api/rotations', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM rotations WHERE user_id=$1 ORDER BY start_date ASC', [req.session.userId]);
    res.json(rows.map(r => ({
      id: r.id, site: r.site, type: r.type, startDate: r.start_date, endDate: r.end_date,
      recurring: r.recurring, recurringDay: r.recurring_day, notes: r.notes, color: r.color, time: r.time,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load rotations' });
  }
});

app.post('/api/rotations', requireAuth, async (req, res) => {
  const r = req.body;
  try {
    await pool.query(
      'INSERT INTO rotations (id,user_id,site,type,start_date,end_date,recurring,recurring_day,notes,color,time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
      [r.id, req.session.userId, r.site, r.type||'', r.startDate, r.endDate, r.recurring||false, r.recurringDay||'', r.notes||'', r.color||'#0891b2', r.time||'08:00']
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save rotation' });
  }
});

app.put('/api/rotations/:id', requireAuth, async (req, res) => {
  const r = req.body;
  try {
    await pool.query(
      'UPDATE rotations SET site=$1,type=$2,start_date=$3,end_date=$4,recurring=$5,recurring_day=$6,notes=$7,color=$8,time=$9 WHERE id=$10 AND user_id=$11',
      [r.site, r.type||'', r.startDate, r.endDate, r.recurring||false, r.recurringDay||'', r.notes||'', r.color||'#0891b2', r.time||'08:00', req.params.id, req.session.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rotation' });
  }
});

app.delete('/api/rotations/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM rotations WHERE id=$1 AND user_id=$2', [req.params.id, req.session.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete rotation' });
  }
});

// Batch replace all rotations (used on settings save)
app.put('/api/rotations', requireAuth, async (req, res) => {
  const rotations = req.body;
  try {
    await pool.query('DELETE FROM rotations WHERE user_id=$1', [req.session.userId]);
    for (const r of rotations) {
      if (!r.site || !r.startDate || !r.endDate) continue;
      await pool.query(
        'INSERT INTO rotations (id,user_id,site,type,start_date,end_date,recurring,recurring_day,notes,color,time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [r.id, req.session.userId, r.site, r.type||'', r.startDate, r.endDate, r.recurring||false, r.recurringDay||'', r.notes||'', r.color||'#0891b2', r.time||'08:00']
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Batch save rotations error:', err.message);
    res.status(500).json({ error: 'Failed to save rotations' });
  }
});

// ── User Settings ─────────────────────────────────────────────────────────────

app.get('/api/settings', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM user_settings WHERE user_id=$1', [req.session.userId]);
    if (!rows[0]) {
      await pool.query('INSERT INTO user_settings (user_id) VALUES ($1)', [req.session.userId]);
      return res.json({ graduationDate: '2026-05-15', customGoals: [], clinicSchedule: {} });
    }
    const s = rows[0];
    res.json({ graduationDate: s.graduation_date, customGoals: s.custom_goals || [], clinicSchedule: s.clinic_schedule || {} });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

app.put('/api/settings', requireAuth, async (req, res) => {
  const { graduationDate, customGoals, clinicSchedule } = req.body;
  try {
    await pool.query(
      `INSERT INTO user_settings (user_id,graduation_date,custom_goals,clinic_schedule)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id) DO UPDATE SET graduation_date=$2,custom_goals=$3,clinic_schedule=$4`,
      [req.session.userId, graduationDate, JSON.stringify(customGoals), JSON.stringify(clinicSchedule)]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// ── AI routes ─────────────────────────────────────────────────────────────────

app.post('/api/parse-note', async (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) return res.status(400).json({ error: 'Note text is required' });
    const todayStr = new Date().toISOString().split('T')[0];
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a dental clinic assistant. Today is ${todayStr}. Extract visit info from this note and return ONLY valid JSON, no markdown.
{"date":"YYYY-MM-DD or empty string","procedure":"procedure name or empty string","discipline":"one of: Comprehensive Care, Endodontics, Oral & Maxillofacial Surgery, Orthodontics, Pediatric Dentistry, Periodontics, Prosthodontics, Implant Dentistry, Dental Hygiene, Special Needs Dentistry, Oral Medicine & Pathology, General Dentistry","nextAppt":"YYYY-MM-DD or empty string","notes":"additional notes or empty string"}
Note: "${note}"`
      }]
    });
    const rawText = message.content[0].text.trim();
    try {
      res.json(JSON.parse(rawText));
    } catch {
      res.status(500).json({ error: 'AI returned invalid JSON. Please try rephrasing your note.' });
    }
  } catch (err) {
    console.error('AI Parse Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to parse note' });
  }
});

app.post('/api/parse', async (req, res) => {
  try {
    const { model, max_tokens, messages, system } = req.body;
    const params = { model: model || 'claude-sonnet-4-20250514', max_tokens: max_tokens || 1000, messages: messages || [] };
    if (system) params.system = system;
    const message = await anthropic.messages.create(params);
    res.json(message);
  } catch (err) {
    console.error('API Proxy Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to process request' });
  }
});

// ── Static / SPA ──────────────────────────────────────────────────────────────

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────

initDb().then(() => {
  app.listen(3001, '0.0.0.0', () => {
    console.log('ClinIQ API server running on port 3001');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});
