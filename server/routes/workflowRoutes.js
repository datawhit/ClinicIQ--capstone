import express from 'express';
import workflowIntelligenceService from '../services/workflow/workflowIntelligenceService.js';

const router = express.Router();

router.post('/priority', (req, res) => {
  try {
    const priorityItem = workflowIntelligenceService.getPriorityItem(req.body || {});
    res.json(priorityItem);
  } catch (error) {
    console.error('Workflow priority route failed:', error);
    res.status(500).json({ error: 'Unable to generate workflow priority' });
  }
});

router.post('/priority/bulk', (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    const priorityItems = workflowIntelligenceService.buildPriorityItems(items);
    res.json(priorityItems);
  } catch (error) {
    console.error('Workflow priority bulk route failed:', error);
    res.status(500).json({ error: 'Unable to generate workflow priorities' });
  }
});

export default router;
