// ============================================
// Meridian Dynamics — Tool Registry
// ============================================
// Every tool used by Meridian, its API details,
// connector status, and Lineage tracking level.

export type ConnectorStatus = 'planned' | 'in_progress' | 'ready' | 'live';
export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'manual';
export type LineageLevel = 'full' | 'summary' | 'hash_only';

export interface ToolConfig {
  id: string;
  name: string;
  category: string;
  apiType: string;
  plan: string;              // free tier, trial, etc.
  monthlyCost: number;       // $0 for free
  connectorStatus: ConnectorStatus;
  syncFrequency: SyncFrequency;
  lineageLevel: LineageLevel;
  departments: string[];     // which departments use this
  lineageTracks: string;     // what Lineage records from this tool
}

export const TOOLS: ToolConfig[] = [
  // ── Phase 1 Connectors (Sprint 2-3) ──
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    apiType: 'Events API + Web API',
    plan: 'Free workspace',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'realtime',
    lineageLevel: 'full',
    departments: ['engineering', 'legal', 'finance', 'people', 'sales', 'support'],
    lineageTracks: 'Messages, threads, reactions, channel history. Decision provenance from conversations.',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Code & Dev',
    apiType: 'REST + GraphQL + Webhooks',
    plan: 'Free org + repos',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'realtime',
    lineageLevel: 'full',
    departments: ['engineering'],
    lineageTracks: 'Commits, PRs, reviews, CI results, code changes. Vibe coding lineage.',
  },
  {
    id: 'okta',
    name: 'Okta',
    category: 'Identity',
    apiType: 'SCIM + Events API',
    plan: 'Developer account (free)',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'realtime',
    lineageLevel: 'full',
    departments: ['engineering', 'legal', 'finance', 'people', 'sales', 'support'],
    lineageTracks: 'Auth events, session starts, MFA method, device binding. Identity confidence.',
  },

  // ── Phase 2 Connectors (Sprint 4+) ──
  {
    id: 'jira',
    name: 'Jira',
    category: 'Project Management',
    apiType: 'REST',
    plan: 'Free (10 users)',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'hourly',
    lineageLevel: 'full',
    departments: ['engineering', 'legal'],
    lineageTracks: 'Tickets, sprints, assignments, status changes. Decision → implementation tracking.',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    category: 'Documentation',
    apiType: 'REST',
    plan: 'Free (10 users)',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'hourly',
    lineageLevel: 'summary',
    departments: ['engineering', 'support'],
    lineageTracks: 'Page creates, edits, version history. Knowledge provenance.',
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    category: 'Contracts',
    apiType: 'REST',
    plan: 'Developer sandbox (free)',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'realtime',
    lineageLevel: 'full',
    departments: ['legal', 'sales'],
    lineageTracks: 'Contract uploads, signature events, envelope status. Legal decision tracking.',
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace',
    category: 'Email & Productivity',
    apiType: 'Gmail API + Calendar API',
    plan: 'Business Starter ($7/user)',
    monthlyCost: 35, // 5 accounts
    connectorStatus: 'planned',
    syncFrequency: 'hourly',
    lineageLevel: 'summary',
    departments: ['people', 'finance', 'legal'],
    lineageTracks: 'Email threads for approval chains. Calendar events for meeting provenance.',
  },

  // ── Future Connectors ──
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    apiType: 'REST/SOQL',
    plan: 'Developer Edition (free)',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'hourly',
    lineageLevel: 'summary',
    departments: ['sales', 'support'],
    lineageTracks: 'Contacts, deals, activities, forecasts. Who touched what deal, when.',
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    category: 'Support',
    apiType: 'REST',
    plan: 'Trial + sandbox',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'hourly',
    lineageLevel: 'full',
    departments: ['support'],
    lineageTracks: 'Tickets, routing, resolution, CSAT. Shadow Mode comparison target.',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    category: 'Monitoring',
    apiType: 'REST',
    plan: 'Free tier',
    monthlyCost: 0,
    connectorStatus: 'planned',
    syncFrequency: 'hourly',
    lineageLevel: 'hash_only',
    departments: ['engineering'],
    lineageTracks: 'System health context for incident correlation.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'AI Dev Tool',
    apiType: 'Extension API / Usage Logs',
    plan: 'Pro ($20/mo)',
    monthlyCost: 20,
    connectorStatus: 'planned',
    syncFrequency: 'realtime',
    lineageLevel: 'full',
    departments: ['engineering'],
    lineageTracks: 'AI suggestions accepted/rejected/modified. Vibe coding lineage gold.',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: 'AI Dev Tool',
    apiType: 'Usage logs',
    plan: 'Individual ($10/mo)',
    monthlyCost: 10,
    connectorStatus: 'planned',
    syncFrequency: 'daily',
    lineageLevel: 'summary',
    departments: ['engineering'],
    lineageTracks: 'Code suggestion acceptance rate, files touched.',
  },
];

// ── Helper Functions ───────────────────────────────────────

export function getToolsByDepartment(deptId: string): ToolConfig[] {
  return TOOLS.filter(t => t.departments.includes(deptId));
}

export function getToolsByStatus(status: ConnectorStatus): ToolConfig[] {
  return TOOLS.filter(t => t.connectorStatus === status);
}

export function getMonthlyToolCost(): number {
  return TOOLS.reduce((sum, t) => sum + t.monthlyCost, 0);
}

export function getPhase1Tools(): ToolConfig[] {
  return TOOLS.filter(t => ['slack', 'github', 'okta'].includes(t.id));
}
