// Block Types
export const BLOCK_TYPES = {
  PLANNER_SECTION: 'planner_section',
  PRD_SECTION: 'prd_section',
  FEATURE: 'feature',
  SUB_FEATURE: 'sub_feature',
  RULE: 'rule',
  USER_FLOW: 'user_flow',
  FLOW_STEP: 'flow_step',
  DATA_ENTITY: 'data_entity',
  FIELD: 'field',
  NOTE: 'note',
};

export const BLOCK_TYPE_CONFIG = {
  [BLOCK_TYPES.PLANNER_SECTION]: {
    label: 'Planner Section',
    icon: 'LayoutDashboard',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  [BLOCK_TYPES.PRD_SECTION]: {
    label: 'PRD Section',
    icon: 'FileText',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  [BLOCK_TYPES.FEATURE]: {
    label: 'Feature',
    icon: 'Puzzle',
    color: '#10b981',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  [BLOCK_TYPES.SUB_FEATURE]: {
    label: 'Sub-feature',
    icon: 'GitBranch',
    color: '#14b8a6',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
  },
  [BLOCK_TYPES.RULE]: {
    label: 'Rule',
    icon: 'ShieldCheck',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  [BLOCK_TYPES.USER_FLOW]: {
    label: 'User Flow',
    icon: 'Workflow',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
  },
  [BLOCK_TYPES.FLOW_STEP]: {
    label: 'Flow Step',
    icon: 'ArrowRight',
    color: '#a78bfa',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/30',
  },
  [BLOCK_TYPES.DATA_ENTITY]: {
    label: 'Data Entity',
    icon: 'Database',
    color: '#ec4899',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
  },
  [BLOCK_TYPES.FIELD]: {
    label: 'Field',
    icon: 'Hash',
    color: '#f472b6',
    bgColor: 'bg-pink-400/10',
    borderColor: 'border-pink-400/30',
  },
  [BLOCK_TYPES.NOTE]: {
    label: 'Note',
    icon: 'StickyNote',
    color: '#6b7280',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
  },
};

// Block Statuses
export const BLOCK_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  NEEDS_REVIEW: 'needs_review',
  DONE: 'done',
  DEPRECATED: 'deprecated',
};

export const BLOCK_STATUS_CONFIG = {
  [BLOCK_STATUSES.NOT_STARTED]: {
    label: 'Not Started',
    color: '#52525b',
    bgColor: 'bg-zinc-500/10',
    borderColor: 'border-zinc-700',
    textColor: 'text-zinc-400',
  },
  [BLOCK_STATUSES.IN_PROGRESS]: {
    label: 'In Progress',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-900',
    textColor: 'text-blue-400',
  },
  [BLOCK_STATUSES.BLOCKED]: {
    label: 'Blocked',
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-900',
    textColor: 'text-red-400',
  },
  [BLOCK_STATUSES.NEEDS_REVIEW]: {
    label: 'Needs Review',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-900',
    textColor: 'text-amber-400',
  },
  [BLOCK_STATUSES.DONE]: {
    label: 'Done',
    color: '#10b981',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-900',
    textColor: 'text-green-400',
  },
  [BLOCK_STATUSES.DEPRECATED]: {
    label: 'Deprecated',
    color: '#71717a',
    bgColor: 'bg-zinc-500/10',
    borderColor: 'border-zinc-800',
    textColor: 'text-zinc-500',
    strikethrough: true,
  },
};

// Block Priorities
export const BLOCK_PRIORITIES = {
  MUST: 'must',
  SHOULD: 'should',
  NICE: 'nice',
  OPTIONAL: 'optional',
};

export const BLOCK_PRIORITY_CONFIG = {
  [BLOCK_PRIORITIES.MUST]: {
    label: 'Must Have',
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-700',
    textColor: 'text-red-400',
  },
  [BLOCK_PRIORITIES.SHOULD]: {
    label: 'Should Have',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-700',
    textColor: 'text-orange-400',
  },
  [BLOCK_PRIORITIES.NICE]: {
    label: 'Nice to Have',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-700',
    textColor: 'text-blue-400',
  },
  [BLOCK_PRIORITIES.OPTIONAL]: {
    label: 'Optional',
    color: '#6b7280',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-700',
    textColor: 'text-gray-400',
  },
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  APPS: 'app_planner_apps',
  BLOCKS: 'app_planner_blocks',
  COLLAPSED: 'app_planner_collapsed',
  SETTINGS: 'app_planner_settings',
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create new block template
export const createBlock = (type, parentId = null, appId, order = 0) => ({
  id: generateId(),
  type,
  title: `New ${BLOCK_TYPE_CONFIG[type]?.label || 'Block'}`,
  description: '',
  status: BLOCK_STATUSES.NOT_STARTED,
  priority: null,
  parent_id: parentId,
  app_id: appId,
  order,
  notes: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Create new app template
export const createApp = (name) => ({
  id: generateId(),
  name,
  description: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});
