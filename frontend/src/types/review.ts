export type ReviewStatus = "pending" | "in-progress" | "completed" | "failed";

export interface ReviewIssue {
  title: string;
  detail: string;
}

export interface ReviewResult {
  score: number;
  issues: ReviewIssue[];
  security: string[];
  performance: string[];
  summary?: string;
}

export interface ReviewDoc {
  id: string;
  code: string;
  language: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
  result?: ReviewResult | null;
}
