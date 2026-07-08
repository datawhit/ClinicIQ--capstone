import { buildPriorityItem } from './priorityService.js';

export class WorkflowIntelligenceService {
  constructor() {
    this.name = 'WorkflowIntelligenceService';
  }

  getPriorityItem(context = {}) {
    return buildPriorityItem(context);
  }

  buildPriorityItems(items = []) {
    return items.map((item) => this.getPriorityItem(item));
  }
}

export default new WorkflowIntelligenceService();
