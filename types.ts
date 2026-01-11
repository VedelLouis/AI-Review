
export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum Category {
  BUG = 'bug',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  READABILITY = 'readability',
  BEST_PRACTICE = 'best_practice'
}

export interface AnalysisFinding {
  category: Category;
  finding: string;
  reasoning: string;
  severity: Severity;
}

export interface Recommendation {
  title: string;
  description: string;
  fixedCode?: string;
}

export interface ReviewResult {
  summary: string;
  score: number; // 0-100
  analysis: AnalysisFinding[];
  recommendations: Recommendation[];
}

export interface ReviewHistoryItem {
  id: string;
  timestamp: number;
  code: string;
  language: string;
  result: ReviewResult;
}
