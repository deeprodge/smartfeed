export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchRequest {
  query: string;
  category?: string;
  platform?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  platform: string;
  category: string;
  url: string;
  score: number;
  created_at: string;
}

export interface IngestionRequest {
  platform: 'x' | 'youtube';
  user_id: string;
  force_refresh?: boolean;
}

export interface ClassificationRequest {
  content: string;
  platform: string;
  metadata?: Record<string, any>;
}

export interface ClassificationResponse {
  category: string;
  confidence_score: number;
  reasoning?: string;
}

export interface SummaryRequest {
  content: string;
  platform: string;
  max_words?: number;
}

export interface SummaryResponse {
  summary: string;
  key_points?: string[];
  word_count: number;
} 