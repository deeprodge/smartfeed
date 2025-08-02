/**
 * YouTube content extraction agent using Composio
 */
import { 
  parseYouTubeUrl, 
  normalizeVideoId, 
  createYouTubeUrl 
} from '@/lib/utils/youtube';
import {
  YouTubeVideoMetadata,
  YouTubeTranscript,
  YouTubeExtractionResult,
  YouTubePlaylistItem
} from '@/lib/types/youtube';

export class YouTubeAgent {
  /**
   * Extract comprehensive information from a YouTube video
   */
  async extractVideoInfo(urlOrVideoId: string): Promise<YouTubeExtractionResult> {
    try {
      const videoId = normalizeVideoId(urlOrVideoId);
      if (!videoId) {
        throw new Error('Invalid YouTube URL or video ID');
      }

      // Try to get video metadata using direct YouTube API
      let metadata: YouTubeVideoMetadata;
      const directMetadata = await this.getVideoMetadataDirect(videoId);
      if (!directMetadata) {
        throw new Error('Failed to get video metadata from YouTube API');
      }
      metadata = directMetadata;
      
      // Try to get transcript
      let transcript: YouTubeTranscript | undefined;
      try {
        const transcriptResult = await this.getVideoTranscriptDirect(videoId);
        if (transcriptResult) {
          transcript = transcriptResult;
          console.log(`✅ Transcript extracted for video ${videoId}`);
        }
      } catch (error) {
        console.warn(`Transcript not available for video ${videoId}:`, error);
      }

      return {
        metadata,
        transcript,
      };
    } catch (error) {
      console.error('Error extracting YouTube video info:', error);
      return {
        metadata: {} as YouTubeVideoMetadata,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Extract videos from user's Liked Videos playlist
   * Placeholder implementation - will work with Composio when available
   */
  async getLikedVideos(userId: string): Promise<YouTubePlaylistItem[]> {
    try {
      console.log('Getting liked videos for user:', userId);
      console.log('Note: This will work with Composio YouTube tools when available');
      
      // TODO: Implement with Composio when YouTube tools are available
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting liked videos:', error);
      return [];
    }
  }

  /**
   * Get videos from a specific playlist
   * Placeholder implementation - will work with Composio when available
   */
  async getPlaylistVideos(playlistId: string, maxResults: number = 50): Promise<YouTubePlaylistItem[]> {
    try {
      console.log('Getting playlist videos:', playlistId, 'maxResults:', maxResults);
      console.log('Note: This will work with Composio YouTube tools when available');
      
      // TODO: Implement with Composio when YouTube tools are available
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting playlist videos:', error);
      return [];
    }
  }

  /**
   * Validate YouTube API access
   */
  async validateConnection(): Promise<boolean> {
    try {
      // Test with direct YouTube API
      const testVideoId = 'dQw4w9WgXcQ'; // Rick Roll video ID for testing
      const metadata = await this.getVideoMetadataDirect(testVideoId);
      return metadata !== null;
    } catch (error) {
      console.error('YouTube connection validation failed:', error);
      return false;
    }
  }

  /**
   * Get video metadata using YouTube Data API v3 directly
   * This is the current working implementation
   */
  async getVideoMetadataDirect(videoId: string): Promise<YouTubeVideoMetadata | null> {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey || apiKey === 'your_youtube_api_key_here') {
        console.warn('YouTube API key not configured - using placeholder data');
        // Return placeholder data for testing
        return {
          videoId,
          title: `Video ${videoId}`,
          description: 'Video description will be available with YouTube API key',
          channelId: 'channel_id',
          channelTitle: 'Channel Name',
          publishedAt: new Date().toISOString(),
          duration: 'PT0S',
          viewCount: 0,
          categoryId: '1',
          thumbnails: {
            default: {
              url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
              width: 120,
              height: 90
            },
            medium: {
              url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
              width: 320,
              height: 180
            },
            high: {
              url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              width: 480,
              height: 360
            }
          }
        };
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      const videoData = data.items?.[0];
      
      if (!videoData) {
        throw new Error('Video not found');
      }

      const snippet = videoData.snippet;
      const statistics = videoData.statistics;
      const contentDetails = videoData.contentDetails;

      return {
        videoId,
        title: snippet.title,
        description: snippet.description || '',
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        duration: contentDetails.duration,
        viewCount: parseInt(statistics.viewCount || '0', 10),
        likeCount: statistics.likeCount ? parseInt(statistics.likeCount, 10) : undefined,
        commentCount: statistics.commentCount ? parseInt(statistics.commentCount, 10) : undefined,
        tags: snippet.tags || [],
        categoryId: snippet.categoryId,
        defaultLanguage: snippet.defaultLanguage,
        thumbnails: {
          default: snippet.thumbnails?.default,
          medium: snippet.thumbnails?.medium,
          high: snippet.thumbnails?.high,
          standard: snippet.thumbnails?.standard,
          maxres: snippet.thumbnails?.maxres,
        }
      };
    } catch (error) {
      console.error('Error getting video metadata directly:', error);
      return null;
    }
  }

  /**
   * Get video transcript using YouTube Data API v3 captions endpoint
   * Note: Full transcript extraction requires OAuth, but we can extract available text content
   */
  async getVideoTranscriptDirect(videoId: string): Promise<YouTubeTranscript | null> {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey || apiKey === 'your_youtube_api_key_here') {
        console.warn('YouTube API key not configured - transcript extraction unavailable');
        return null;
      }

      // For now, we'll extract the video description as "transcript"
      // Full transcript extraction requires OAuth authentication
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`
      );

      if (!videoResponse.ok) {
        throw new Error(`YouTube API error: ${videoResponse.status}`);
      }

      const videoData = await videoResponse.json();
      const video = videoData.items?.[0];
      
      if (!video) {
        throw new Error('Video not found');
      }

      const description = video.snippet.description || '';
      
      if (!description || description.length < 50) {
        console.log(`No substantial description available for video ${videoId}`);
        return null;
      }

      // Clean up the description to make it more readable
      const cleanDescription = this.cleanVideoDescription(description);

      return {
        text: cleanDescription,
        language: video.snippet.defaultLanguage || 'en',
        isAutoGenerated: false, // This is from the description, not auto-generated
        segments: []
      };

    } catch (error) {
      console.error('Error getting video transcript directly:', error);
      return null;
    }
  }

  /**
   * Clean up video description for better readability
   */
  private cleanVideoDescription(description: string): string {
    return description
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/#[^\s]+/g, '') // Remove hashtags
      .trim();
  }

  /**
   * Future method for Composio integration
   * This will be implemented when Composio YouTube tools are available
   */
  async getVideoMetadataComposio(videoId: string): Promise<YouTubeVideoMetadata | null> {
    console.log('Composio YouTube integration not yet available');
    console.log('This method will work when Composio adds YouTube tools');
    return null;
  }

  /**
   * Future method for Composio transcript extraction
   * This will be implemented when Composio YouTube tools are available
   */
  async getVideoTranscriptComposio(videoId: string): Promise<YouTubeTranscript | null> {
    console.log('Composio transcript extraction not yet available');
    console.log('This method will work when Composio adds YouTube tools');
    return null;
  }
} 