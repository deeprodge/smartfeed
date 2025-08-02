import { XBookmarkData } from '../ai/claude';

export function validateXBookmarksRequest(data: any): data is XBookmarkData[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(item => 
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.created_at === 'string' &&
    typeof item.author_id === 'string' &&
    typeof item.public_metrics === 'object' &&
    (item.notes === undefined || typeof item.notes === 'string')
  );
}

export function validateTweetId(id: string): boolean {
  // Twitter/X tweet IDs are typically 19-20 digit numbers as strings
  return /^\d{19,20}$/.test(id);
}

export function validateTimestamp(timestamp: string): boolean {
  // Validate ISO 8601 timestamp
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
}

export function sanitizeText(text: string): string {
  // Remove any potentially harmful characters and trim whitespace
  return text.trim().replace(/[\x00-\x1f\x7f]/g, '');
} 