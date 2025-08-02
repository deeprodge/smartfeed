/**
 * YouTube URL parsing and validation utilities
 */

export interface YouTubeVideoInfo {
  videoId: string;
  playlistId?: string;
  timestamp?: number;
}

// YouTube URL patterns
const YOUTUBE_PATTERNS = {
  // Standard: https://www.youtube.com/watch?v=VIDEO_ID
  standard: /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  
  // Short: https://youtu.be/VIDEO_ID
  short: /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  
  // Embed: https://www.youtube.com/embed/VIDEO_ID
  embed: /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  
  // Playlist: https://www.youtube.com/playlist?list=PLAYLIST_ID
  playlist: /(?:youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]+)/,
  
  // Watch with playlist: https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
  watchWithPlaylist: /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(?:.*&list=)([a-zA-Z0-9_-]+)/,
  
  // Timestamp: &t=123s or #t=123
  timestamp: /[&?#]t=(\d+)s?/
};

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Try each pattern
  for (const [patternName, pattern] of Object.entries(YOUTUBE_PATTERNS)) {
    if (patternName === 'playlist' || patternName === 'timestamp') continue;
    
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parse YouTube URL and extract all available information
 */
export function parseYouTubeUrl(url: string): YouTubeVideoInfo | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  const result: YouTubeVideoInfo = { videoId };

  // Extract playlist ID if present
  const playlistMatch = url.match(YOUTUBE_PATTERNS.watchWithPlaylist);
  if (playlistMatch && playlistMatch[2]) {
    result.playlistId = playlistMatch[2];
  }

  // Extract timestamp if present
  const timestampMatch = url.match(YOUTUBE_PATTERNS.timestamp);
  if (timestampMatch && timestampMatch[1]) {
    result.timestamp = parseInt(timestampMatch[1], 10);
  }

  return result;
}

/**
 * Validate if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Generate standard YouTube URL from video ID
 */
export function createYouTubeUrl(videoId: string, timestamp?: number): string {
  let url = `https://www.youtube.com/watch?v=${videoId}`;
  if (timestamp) {
    url += `&t=${timestamp}s`;
  }
  return url;
}

/**
 * Extract video ID from various input formats (URL or direct ID)
 */
export function normalizeVideoId(input: string): string | null {
  // If it's already a video ID (11 characters, alphanumeric + _ -)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }
  
  // Otherwise, try to extract from URL
  return extractYouTubeVideoId(input);
} 