import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set. Please add it to Secrets.');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey });

app.post('/api/parse-note', async (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a dental clinic assistant. Today is ${todayStr}. Extract visit info from this note and return ONLY valid JSON, no markdown.
Ensure the "discipline" matches one of the provided options exactly.
{
  "date": "YYYY-MM-DD or empty string",
  "procedure": "procedure name or empty string",
  "discipline": "one of: Comprehensive Care, Endodontics, Oral & Maxillofacial Surgery, Orthodontics, Pediatric Dentistry, Periodontics, Prosthodontics, Implant Dentistry, Dental Hygiene, Special Needs Dentistry, Oral Medicine & Pathology, General Dentistry",
  "nextAppt": "YYYY-MM-DD calculated from today if follow-up timeframe mentioned, or empty string",
  "notes": "additional notes or empty string"
}
Note: "${note}"`
      }]
    });

    const rawText = message.content[0].text.trim();
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error('Failed to parse AI response as JSON:', rawText);
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try rephrasing your note.' });
    }
    res.json(parsed);
  } catch (err) {
    console.error('AI Parse Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to parse note' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3001, '0.0.0.0', () => {
  console.log('API server running on port 3001');
});
