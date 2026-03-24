// ============================================
// Meridian Dynamics — Organization Configuration
// ============================================
// The complete organizational structure: departments, personas,
// identity tiers, and auth methods. This is the source of truth
// for all demo scenarios and Lineage identity attribution.

export type AuthTier = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Persona {
  id: string;
  name: string;
  role: string;
  department: DepartmentId;
  email: string;               // @meridiandynamics.dev
  authTier: AuthTier;
  confidenceScore: number;     // 0.00 - 1.00
  device: string;
  authMethod: string;
  tools: string[];             // Tool IDs this persona uses
}

export interface Department {
  id: DepartmentId;
  name: string;
  icon: string;
  headcount: number;
  description: string;
  tools: string[];
  personas: Persona[];
}

export type DepartmentId = 
  | 'engineering' 
  | 'legal' 
  | 'finance' 
  | 'people' 
  | 'sales' 
  | 'support';

// ── Identity Confidence Tiers ──────────────────────────────

export const AUTH_TIERS: Record<AuthTier, { label: string; confidenceRange: [number, number]; description: string }> = {
  platinum: {
    label: '🔒 Platinum',
    confidenceRange: [0.98, 1.0],
    description: 'YubiKey + biometric. Hardware token required. Highest assurance.',
  },
  gold: {
    label: '🟡 Gold',
    confidenceRange: [0.90, 0.97],
    description: 'Biometric (Touch ID / Face ID) + SSO. Strong device binding.',
  },
  silver: {
    label: '🟢 Silver',
    confidenceRange: [0.80, 0.89],
    description: 'SSO + MFA (authenticator app). Standard enterprise auth.',
  },
  bronze: {
    label: '🔵 Bronze',
    confidenceRange: [0.60, 0.79],
    description: 'Password + MFA. Minimum acceptable for Lineage recording.',
  },
};

// ── The 24 Named Personas ──────────────────────────────────

export const PERSONAS: Persona[] = [
  // ── Engineering (62 total, 4 named) ──
  {
    id: 'marcus_chen',
    name: 'Marcus Chen',
    role: 'VP Engineering',
    department: 'engineering',
    email: 'marcus.chen@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['github', 'jira', 'slack', 'datadog', 'zoom'],
  },
  {
    id: 'priya_sharma',
    name: 'Priya Sharma',
    role: 'Lead Architect',
    department: 'engineering',
    email: 'priya.sharma@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['github', 'jira', 'confluence', 'slack', 'cursor'],
  },
  {
    id: 'jake_morrison',
    name: 'Jake Morrison',
    role: 'Senior Developer',
    department: 'engineering',
    email: 'jake.morrison@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['github', 'jira', 'cursor', 'copilot', 'slack', 'datadog'],
  },
  {
    id: 'aisha_okonkwo',
    name: 'Aisha Okonkwo',
    role: 'QA Lead',
    department: 'engineering',
    email: 'aisha.okonkwo@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['github', 'jira', 'slack', 'datadog'],
  },

  // ── Legal & Compliance (12 total, 4 named) ──
  {
    id: 'diana_reeves',
    name: 'Diana Reeves',
    role: 'General Counsel',
    department: 'legal',
    email: 'diana.reeves@meridiandynamics.dev',
    authTier: 'platinum',
    confidenceScore: 0.99,
    device: 'MacBook Pro M4 + YubiKey 5',
    authMethod: 'yubikey_biometric',
    tools: ['docusign', 'ironclad', 'onetrust', 'outlook', 'slack'],
  },
  {
    id: 'tom_nakamura',
    name: 'Tom Nakamura',
    role: 'Sr. Compliance Officer',
    department: 'legal',
    email: 'tom.nakamura@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['onetrust', 'jira', 'confluence', 'slack'],
  },
  {
    id: 'laura_medina',
    name: 'Laura Medina',
    role: 'Contract Attorney',
    department: 'legal',
    email: 'laura.medina@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['docusign', 'ironclad', 'outlook', 'slack'],
  },
  {
    id: 'ben_schwartz',
    name: 'Ben Schwartz',
    role: 'Data Privacy Analyst',
    department: 'legal',
    email: 'ben.schwartz@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['onetrust', 'jira', 'slack'],
  },
  {
    id: 'jessica_torres',
    name: 'Jessica Torres',
    role: 'Legal Paralegal',
    department: 'legal',
    email: 'jessica.torres@meridiandynamics.dev',
    authTier: 'bronze',
    confidenceScore: 0.72,
    device: 'Dell Latitude 5540',
    authMethod: 'password_mfa',
    tools: ['outlook', 'slack', 'sharepoint'],
  },

  // ── Finance & Operations (28 total, 4 named) ──
  {
    id: 'catherine_park',
    name: 'Catherine Park',
    role: 'CFO',
    department: 'finance',
    email: 'catherine.park@meridiandynamics.dev',
    authTier: 'platinum',
    confidenceScore: 0.99,
    device: 'MacBook Pro M4 + YubiKey 5',
    authMethod: 'yubikey_biometric',
    tools: ['netsuite', 'stripe', 'slack', 'zoom', 'email'],
  },
  {
    id: 'ryan_obrien',
    name: "Ryan O'Brien",
    role: 'VP Finance',
    department: 'finance',
    email: 'ryan.obrien@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['netsuite', 'stripe', 'coupa', 'slack', 'excel'],
  },
  {
    id: 'nadia_hassan',
    name: 'Nadia Hassan',
    role: 'Procurement Manager',
    department: 'finance',
    email: 'nadia.hassan@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['coupa', 'netsuite', 'slack', 'excel'],
  },
  {
    id: 'derek_wu',
    name: 'Derek Wu',
    role: 'Financial Analyst',
    department: 'finance',
    email: 'derek.wu@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['netsuite', 'excel', 'slack'],
  },

  // ── People & Talent (18 total, 4 named) ──
  {
    id: 'michelle_torres',
    name: 'Michelle Torres',
    role: 'CHRO',
    department: 'people',
    email: 'michelle.torres@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['bamboohr', '15five', 'slack', 'zoom', 'google_workspace'],
  },
  {
    id: 'alex_kim',
    name: 'Alex Kim',
    role: 'Head of Recruiting',
    department: 'people',
    email: 'alex.kim@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['greenhouse', 'bamboohr', 'slack', 'zoom'],
  },
  {
    id: 'jordan_blake',
    name: 'Jordan Blake',
    role: 'HR Business Partner',
    department: 'people',
    email: 'jordan.blake@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['bamboohr', '15five', 'slack', 'google_workspace'],
  },
  {
    id: 'sonia_gupta',
    name: 'Sonia Gupta',
    role: 'People Analytics Lead',
    department: 'people',
    email: 'sonia.gupta@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['bamboohr', '15five', 'slack', 'excel'],
  },

  // ── Sales & Revenue (85 total, 4 named) ──
  {
    id: 'james_rodriguez',
    name: 'James Rodriguez',
    role: 'CRO',
    department: 'sales',
    email: 'james.rodriguez@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['salesforce', 'gong', 'slack', 'zoom'],
  },
  {
    id: 'tanya_ivanova',
    name: 'Tanya Ivanova',
    role: 'VP Enterprise Sales',
    department: 'sales',
    email: 'tanya.ivanova@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['salesforce', 'gong', 'outreach', 'slack'],
  },
  {
    id: 'chris_adeyemi',
    name: 'Chris Adeyemi',
    role: 'Account Executive',
    department: 'sales',
    email: 'chris.adeyemi@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['salesforce', 'outreach', 'slack', 'zoom'],
  },
  {
    id: 'rachel_foster',
    name: 'Rachel Foster',
    role: 'Revenue Ops Lead',
    department: 'sales',
    email: 'rachel.foster@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['salesforce', 'slack', 'excel'],
  },

  // ── Customer Success (45 total, 4 named) ──
  {
    id: 'pat_henderson',
    name: 'Pat Henderson',
    role: 'VP Customer Success',
    department: 'support',
    email: 'pat.henderson@meridiandynamics.dev',
    authTier: 'gold',
    confidenceScore: 0.95,
    device: 'MacBook Pro M4',
    authMethod: 'biometric_touchid',
    tools: ['zendesk', 'intercom', 'salesforce', 'slack', 'zoom'],
  },
  {
    id: 'mei_lin',
    name: 'Mei Lin',
    role: 'Head of Support',
    department: 'support',
    email: 'mei.lin@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['zendesk', 'intercom', 'confluence', 'slack'],
  },
  {
    id: 'david_kowalski',
    name: 'David Kowalski',
    role: 'Senior Support Engineer',
    department: 'support',
    email: 'david.kowalski@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['zendesk', 'jira', 'slack', 'datadog'],
  },
  {
    id: 'fatima_alrashid',
    name: 'Fatima Al-Rashid',
    role: 'Knowledge Base Manager',
    department: 'support',
    email: 'fatima.alrashid@meridiandynamics.dev',
    authTier: 'silver',
    confidenceScore: 0.85,
    device: 'MacBook Pro M3',
    authMethod: 'sso_mfa',
    tools: ['confluence', 'zendesk', 'slack', 'loom'],
  },
];

// ── Department Registry ────────────────────────────────────

export const DEPARTMENTS: Department[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    icon: '🛠️',
    headcount: 62,
    description: 'Product development, infrastructure, QA. Heavy AI tool usage. Primary target for vibe coding lineage.',
    tools: ['github', 'jira', 'cursor', 'copilot', 'datadog', 'slack', 'confluence'],
    personas: PERSONAS.filter(p => p.department === 'engineering'),
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: '⚖️',
    headcount: 12,
    description: 'Contract review, IP, regulatory compliance, data privacy. Primary target for 1-department trustless demo.',
    tools: ['docusign', 'ironclad', 'onetrust', 'outlook', 'slack'],
    personas: PERSONAS.filter(p => p.department === 'legal'),
  },
  {
    id: 'finance',
    name: 'Finance & Operations',
    icon: '💰',
    headcount: 28,
    description: 'FP&A, procurement, budget approval, vendor management. Key stakeholder for ROI proof.',
    tools: ['netsuite', 'stripe', 'coupa', 'excel', 'slack'],
    personas: PERSONAS.filter(p => p.department === 'finance'),
  },
  {
    id: 'people',
    name: 'People & Talent',
    icon: '👥',
    headcount: 18,
    description: 'Recruiting, onboarding, performance management. Sensitive data — the Talent Intelligence proving ground.',
    tools: ['bamboohr', 'greenhouse', '15five', 'slack', 'google_workspace'],
    personas: PERSONAS.filter(p => p.department === 'people'),
  },
  {
    id: 'sales',
    name: 'Sales & Revenue',
    icon: '📈',
    headcount: 85,
    description: 'Enterprise sales, SDR, account management, revenue operations. Cross-functional with Legal and Finance.',
    tools: ['salesforce', 'gong', 'outreach', 'slack', 'zoom'],
    personas: PERSONAS.filter(p => p.department === 'sales'),
  },
  {
    id: 'support',
    name: 'Customer Success',
    icon: '🎧',
    headcount: 45,
    description: 'Support, onboarding, retention. Shadow Mode comparison target — existing support AI vs. AIOS.',
    tools: ['zendesk', 'intercom', 'confluence', 'slack', 'loom'],
    personas: PERSONAS.filter(p => p.department === 'support'),
  },
];

// ── Helper Functions ───────────────────────────────────────

export function getPersona(id: string): Persona | undefined {
  return PERSONAS.find(p => p.id === id);
}

export function getDepartment(id: DepartmentId): Department | undefined {
  return DEPARTMENTS.find(d => d.id === id);
}

export function getPersonasByDepartment(deptId: DepartmentId): Persona[] {
  return PERSONAS.filter(p => p.department === deptId);
}

export function getPersonasByAuthTier(tier: AuthTier): Persona[] {
  return PERSONAS.filter(p => p.authTier === tier);
}
