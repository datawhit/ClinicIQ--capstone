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

// ── IMPORT ROSTER ──────────────────────────────────────────────────────────────
app.post('/api/patients/import', requireAuth, async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) return res.status(400).json({ error: 'No rows provided' });
  let created = 0, skipped = 0, errors = [];
  for (const r of rows) {
    try {
      const chartNumber = (r.chartNumber || '').trim();
      const procedure   = (r.procedure || '').trim();
      const discipline  = (r.discipline || 'General Dentistry').trim();
      const lastVisit   = (r.lastVisit || '').trim();
      if (!chartNumber && !procedure) { skipped++; continue; }
      const { rows: existing } = await pool.query('SELECT COUNT(*) FROM patients WHERE user_id=$1', [req.session.userId]);
      const count = parseInt(existing[0].count);
      const id = `PT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,5)}`;
      const year = new Date().getFullYear();
      const alias = chartNumber ? `Chart-${chartNumber}` : `P-${year}-${String(count + 1).padStart(3, '0')}`;
      await pool.query(`
        INSERT INTO patients (id,user_id,alias,chart_number,procedure,discipline,last_visit,treatment_start,
          expected_completion,next_appt,next_appt_time,treatment_complete,lab_status,lab_sent_date,
          lab_received_date,pre_auth,pre_auth_submitted_date,notes,handoff_partner,handoff_partner_year,
          handoff_notes,patient_language,is_primary_provider,shared_with_d3)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
        [id, req.session.userId, alias, chartNumber, procedure, discipline,
         lastVisit, '', '', null, '', false, 'None', '', '', 'Not Submitted', '',
         '', '', 'D3', '', 'English', true, false]
      );
      if (lastVisit && procedure) {
        await pool.query(
          'INSERT INTO visit_logs (patient_id,visit_date,procedure,notes,cdt_code) VALUES ($1,$2,$3,$4,$5)',
          [id, lastVisit, procedure, 'Imported from roster CSV.', '']
        );
      }
      created++;
      await new Promise(r => setTimeout(r, 2)); // tiny delay to prevent ID collision
    } catch (err) {
      errors.push(err.message);
    }
  }
  res.json({ created, skipped, errors: errors.slice(0, 5) });
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

// ── Demo Seed ─────────────────────────────────────────────────────────────────

app.post('/api/demo/seed', requireAuth, async (req, res) => {
  const uid = req.session.userId;
  const uid36 = () => `${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2,4).toUpperCase()}`;

  const demoPatients = [
    {
      chartNumber:"1047823", procedure:"Root Canal - Molar", discipline:"Endodontics",
      treatmentStart:"2026-01-15", expectedCompletion:"2026-04-15",
      nextAppt:"2026-04-02", nextApptTime:"09:00", treatmentComplete:false,
      labStatus:"None", labSentDate:"", labReceivedDate:"",
      preAuth:"Approved", preAuthSubmittedDate:"2026-01-20",
      notes:"Patient tolerated well. Final restoration pending. Prefers morning appointments.",
      isPrimaryProvider:true, patientLanguage:"English",
      handoffPartner:"Marcus Reid", handoffPartnerYear:"D3",
      handoffNotes:"Crown placement still pending. Patient prefers morning appointments.",
      visits:[
        { date:"2026-01-15", procedure:"Initial Exam", notes:"Treatment plan accepted." },
        { date:"2026-02-10", procedure:"Root Canal - Molar", notes:"First appointment, access opened." },
        { date:"2026-03-20", procedure:"Root Canal - Molar", notes:"Obturation complete. Sent for crown prep." }
      ]
    },
    {
      chartNumber:"1047824", procedure:"Crown Delivery", discipline:"Prosthodontics",
      treatmentStart:"2026-01-15", expectedCompletion:"2026-04-01",
      nextAppt:null, nextApptTime:"", treatmentComplete:false,
      labStatus:"Received", labSentDate:"2026-02-20", labReceivedDate:"2026-03-15",
      preAuth:"Submitted", preAuthSubmittedDate:"2026-02-01",
      notes:"Lab received. Need to schedule delivery appointment urgently.",
      isPrimaryProvider:true, patientLanguage:"Spanish",
      handoffPartner:"", handoffPartnerYear:"D3", handoffNotes:"",
      visits:[
        { date:"2026-01-15", procedure:"Crown Prep", notes:"Prep complete, impressions taken." },
        { date:"2026-03-18", procedure:"Try-in", notes:"Crown fits well, minor adjustment needed." }
      ]
    },
    {
      chartNumber:"1047825", procedure:"Implant Stage 2", discipline:"Implant Dentistry",
      treatmentStart:"2025-11-20", expectedCompletion:"2026-06-01",
      nextAppt:"2026-04-05", nextApptTime:"10:30", treatmentComplete:false,
      labStatus:"Sent", labSentDate:"2026-03-10", labReceivedDate:"",
      preAuth:"Approved", preAuthSubmittedDate:"2025-12-10",
      notes:"Stage 1 osseointegration confirmed. Abutment placement scheduled.",
      isPrimaryProvider:true, patientLanguage:"Mandarin",
      handoffPartner:"Priya Patel", handoffPartnerYear:"D3",
      handoffNotes:"Osseointegration confirmed. Next stage April 5.",
      visits:[
        { date:"2025-11-20", procedure:"Implant Placement", notes:"Stage 1 placed, healing abutment placed." },
        { date:"2026-01-15", procedure:"Osseointegration Check", notes:"Good bone contact, proceeding to stage 2." },
        { date:"2026-03-10", procedure:"Abutment Impression", notes:"Sent to lab for custom abutment." }
      ]
    },
    {
      chartNumber:"1047826", procedure:"Scaling & Root Planing", discipline:"Periodontics",
      treatmentStart:"2026-02-01", expectedCompletion:"2026-05-01",
      nextAppt:null, nextApptTime:"", treatmentComplete:false,
      labStatus:"None", labSentDate:"", labReceivedDate:"",
      preAuth:"Denied", preAuthSubmittedDate:"2026-01-25",
      notes:"Pre-auth denied. Need to resubmit with additional documentation from attending.",
      isPrimaryProvider:true, patientLanguage:"Haitian Creole",
      handoffPartner:"", handoffPartnerYear:"D3", handoffNotes:"",
      visits:[
        { date:"2026-02-01", procedure:"Perio Exam", notes:"Full mouth probing complete. SRP treatment plan accepted." },
        { date:"2026-03-05", procedure:"SRP - Upper Right", notes:"Quadrant 1 complete. Patient tolerated well." }
      ]
    },
    {
      chartNumber:"1047827", procedure:"Extraction - Impacted", discipline:"Oral & Maxillofacial Surgery",
      treatmentStart:"2026-03-01", expectedCompletion:"2026-04-15",
      nextAppt:"2026-04-01", nextApptTime:"14:00", treatmentComplete:false,
      labStatus:"None", labSentDate:"", labReceivedDate:"",
      preAuth:"Approved", preAuthSubmittedDate:"2026-02-15",
      notes:"Post-op healing well. Suture removal today.",
      isPrimaryProvider:true, patientLanguage:"English",
      handoffPartner:"Jordan Kim", handoffPartnerYear:"D3",
      handoffNotes:"Suture removal April 1. Good case for D3 observation.",
      visits:[
        { date:"2026-03-01", procedure:"Consultation", notes:"CBCT reviewed with attending. Extraction approved." },
        { date:"2026-03-15", procedure:"Extraction - Impacted Molar", notes:"Procedure complete. Sutures placed." },
        { date:"2026-03-22", procedure:"Post-op Check", notes:"Healing well, mild swelling resolving." }
      ]
    },
    {
      chartNumber:"1047828", procedure:"Complete Denture", discipline:"Prosthodontics",
      treatmentStart:"2026-01-20", expectedCompletion:"2026-05-15",
      nextAppt:"2026-04-02", nextApptTime:"09:30", treatmentComplete:false,
      labStatus:"Sent", labSentDate:"2026-03-12", labReceivedDate:"",
      preAuth:"Approved", preAuthSubmittedDate:"2026-01-25",
      notes:"Final impression sent to lab. Wax try-in appointment scheduled.",
      isPrimaryProvider:true, patientLanguage:"Russian",
      handoffPartner:"", handoffPartnerYear:"D3", handoffNotes:"",
      visits:[
        { date:"2026-01-20", procedure:"Preliminary Impression", notes:"Initial records taken." },
        { date:"2026-02-10", procedure:"Final Impression", notes:"Border molded, final impression complete." },
        { date:"2026-03-12", procedure:"Jaw Relations", notes:"VDO established. Sent to lab for wax try-in." }
      ]
    },
    {
      chartNumber:"1047829", procedure:"Composite Restoration", discipline:"General Dentistry",
      treatmentStart:"2026-03-25", expectedCompletion:"2026-04-10",
      nextAppt:"2026-04-10", nextApptTime:"11:00", treatmentComplete:false,
      labStatus:"None", labSentDate:"", labReceivedDate:"",
      preAuth:"Not Submitted", preAuthSubmittedDate:"",
      notes:"Multiple composite restorations planned. First quadrant complete.",
      isPrimaryProvider:true, patientLanguage:"English",
      handoffPartner:"Marcus Reid", handoffPartnerYear:"D3",
      handoffNotes:"Simple composites — good learning case for D3.",
      visits:[
        { date:"2026-03-25", procedure:"Composite - 3 surfaces", notes:"Upper right quadrant complete. Patient happy with result." }
      ]
    },
    {
      chartNumber:"1047830", procedure:"Orthodontic Retention", discipline:"Orthodontics",
      treatmentStart:"2025-09-01", expectedCompletion:"2026-05-01",
      nextAppt:"2026-04-01", nextApptTime:"15:00", treatmentComplete:false,
      labStatus:"None", labSentDate:"", labReceivedDate:"",
      preAuth:"Not Submitted", preAuthSubmittedDate:"",
      notes:"Retention phase. Monthly monitoring appointments ongoing.",
      isPrimaryProvider:false, patientLanguage:"English",
      handoffPartner:"Dr. Chen", handoffPartnerYear:"D4",
      handoffNotes:"Monthly monitoring. Almost ready for debond.",
      visits:[
        { date:"2025-09-01", procedure:"Banding", notes:"Full banding complete." },
        { date:"2025-11-15", procedure:"Adjustment", notes:"Wire change, good progress." },
        { date:"2026-01-20", procedure:"Adjustment", notes:"Spaces closing well." },
        { date:"2026-02-28", procedure:"Adjustment", notes:"Almost ready for debond." }
      ]
    }
  ];

  const demoRotations = [
    { site:"Bellevue Hospital", type:"Hospital Dentistry", startDate:"2026-04-08", endDate:"2026-04-08", recurring:false, recurringDay:"", notes:"Dr. Patel supervising. Bring loupes and clinic coat.", color:"#6b21a8", time:"08:00" },
    { site:"NYC Health + Hospitals — Woodhull", type:"Community Health", startDate:"2026-04-01", endDate:"2026-04-30", recurring:true, recurringDay:"tuesday", notes:"Every Tuesday in April. Ortho and general cases.", color:"#0891b2", time:"09:00" }
  ];

  const demoNotes = [
    { title:"Pre-clinic checklist", body:"- Review patient charts\n- Check lab status\n- Confirm pre-auth\n- Bring loupes\n- Check attending schedule", category:"Clinical", pinned:true },
    { title:"SRP technique notes", body:"Dr. Chen feedback: work on wrist angulation on posterior teeth. Use modified pen grasp on mandibular anteriors.", category:"Study", pinned:false },
    { title:"Insurance resubmission — P-2026-004", body:"Pre-auth denied for SRP. Need to attach perio charting with 4mm+ pockets and radiographs. Resubmit through EDI by April 5.", category:"Patient", pinned:false }
  ];

  try {
    // Clear existing data for this user
    await pool.query('DELETE FROM patients WHERE user_id=$1', [uid]);
    await pool.query('DELETE FROM rotations WHERE user_id=$1', [uid]);
    await pool.query('DELETE FROM student_notes WHERE user_id=$1', [uid]);

    const year = new Date().getFullYear();
    const insertedPatients = [];

    // Insert demo patients + visits
    for (let i = 0; i < demoPatients.length; i++) {
      const p = demoPatients[i];
      const id = `PT-${uid36()}`;
      const alias = `P-${year}-${String(i + 1).padStart(3, '0')}`;
      const lastVisit = p.visits.length > 0 ? p.visits[p.visits.length - 1].date : p.treatmentStart;

      await pool.query(`
        INSERT INTO patients (id,user_id,alias,chart_number,procedure,discipline,last_visit,treatment_start,
          expected_completion,next_appt,next_appt_time,treatment_complete,lab_status,lab_sent_date,
          lab_received_date,pre_auth,pre_auth_submitted_date,notes,handoff_partner,handoff_partner_year,
          handoff_notes,patient_language,is_primary_provider,shared_with_d3)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
        [id, uid, alias, p.chartNumber, p.procedure, p.discipline, lastVisit,
         p.treatmentStart, p.expectedCompletion, p.nextAppt||null, p.nextApptTime||'',
         p.treatmentComplete, p.labStatus, p.labSentDate||'', p.labReceivedDate||'',
         p.preAuth, p.preAuthSubmittedDate||'', p.notes, p.handoffPartner||'',
         p.handoffPartnerYear||'D3', p.handoffNotes||'', p.patientLanguage||'English',
         p.isPrimaryProvider !== false, false]
      );

      const visitRows = [];
      for (const v of p.visits) {
        const { rows } = await pool.query(
          'INSERT INTO visit_logs (patient_id,visit_date,procedure,notes,cdt_code) VALUES ($1,$2,$3,$4,$5) RETURNING *',
          [id, v.date, v.procedure, v.notes||'', '']
        );
        visitRows.push({ id: rows[0].id, date: rows[0].visit_date, procedure: rows[0].procedure, notes: rows[0].notes, cdtCode: rows[0].cdt_code });
      }

      insertedPatients.push({
        id, alias, chartNumber: p.chartNumber, procedure: p.procedure, discipline: p.discipline,
        lastVisit, treatmentStart: p.treatmentStart, expectedCompletion: p.expectedCompletion,
        nextAppt: p.nextAppt||null, nextApptTime: p.nextApptTime||'', treatmentComplete: p.treatmentComplete,
        labStatus: p.labStatus, labSentDate: p.labSentDate||'', labReceivedDate: p.labReceivedDate||'',
        preAuth: p.preAuth, preAuthSubmittedDate: p.preAuthSubmittedDate||'', notes: p.notes,
        handoffPartner: p.handoffPartner||'', handoffPartnerYear: p.handoffPartnerYear||'D3',
        handoffNotes: p.handoffNotes||'', patientLanguage: p.patientLanguage||'English',
        isPrimaryProvider: p.isPrimaryProvider !== false, sharedWithD3: false,
        visitLog: visitRows,
      });
    }

    // Insert demo rotations
    const insertedRotations = [];
    for (const r of demoRotations) {
      const id = `ROT-${uid36()}`;
      await pool.query(
        'INSERT INTO rotations (id,user_id,site,type,start_date,end_date,recurring,recurring_day,notes,color,time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [id, uid, r.site, r.type, r.startDate, r.endDate, r.recurring, r.recurringDay||'', r.notes||'', r.color||'#6b21a8', r.time||'08:00']
      );
      insertedRotations.push({ id, site: r.site, type: r.type, startDate: r.startDate, endDate: r.endDate, recurring: r.recurring, recurringDay: r.recurringDay||'', notes: r.notes||'', color: r.color||'#6b21a8', time: r.time||'08:00' });
    }

    // Insert demo notes
    const insertedNotes = [];
    for (const n of demoNotes) {
      const id = `NOTE-${uid36()}`;
      const now = new Date().toISOString();
      await pool.query(
        'INSERT INTO student_notes (id,user_id,title,body,category,pinned,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [id, uid, n.title, n.body, n.category||'General', n.pinned||false, now]
      );
      insertedNotes.push({ id, title: n.title, body: n.body, category: n.category||'General', pinned: n.pinned||false, updatedAt: now });
    }

    console.log(`Demo seed: ${insertedPatients.length} patients, ${insertedRotations.length} rotations, ${insertedNotes.length} notes for user ${uid}`);
    res.json({ patients: insertedPatients, rotations: insertedRotations, notes: insertedNotes });
  } catch (err) {
    console.error('Demo seed error:', err.message);
    res.status(500).json({ error: 'Failed to seed demo data' });
  }
});

// ── Changelog ─────────────────────────────────────────────────────────────────

function uid36() { return Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase(); }

app.post('/api/changelog', requireAuth, async (req, res) => {
  try {
    const { user_name, user_year, action_type, patient_alias, description } = req.body;
    const id = `CL-${uid36()}`;
    await pool.query(
      'INSERT INTO changelog (id,user_id,user_name,user_year,action_type,patient_alias,description) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id, req.session.userId, user_name||'', user_year||'', action_type||'', patient_alias||'', description||'']
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log change' });
  }
});

app.get('/api/changelog', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM changelog WHERE user_id=$1 ORDER BY timestamp DESC LIMIT 50',
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch changelog' });
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
