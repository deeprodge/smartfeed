export interface User {
  id: string;
  email: string;
  x_access_token?: string;
  youtube_access_token?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  user_id: string;
  platform: 'x' | 'youtube';
  external_id: string;
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  media_urls?: string[];
  category?: 'learn' | 'plan' | 'ideate' | 'cook' | 'shop';
  confidence_score?: number;
  summary?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Embedding {
  id: string;
  content_item_id: string;
  embedding_vector: number[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
} 