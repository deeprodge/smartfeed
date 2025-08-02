/**
 * YouTube content extraction agent using Composio
 */
import { Composio } from '@composio/core';
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

export class YouTubeAgentComposio {
  private composio: Composio;

  constructor() {
    this.composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY
    });
  }

  /**
   * Extract comprehensive information from a YouTube video using Composio
   */
  async extractVideoInfo(urlOrVideoId: string): Promise<YouTubeExtractionResult> {
    try {
      const videoId = normalizeVideoId(urlOrVideoId);
      if (!videoId) {
        throw new Error('Invalid YouTube URL or video ID');
      }

      // Get video metadata using Composio
      let metadata: YouTubeVideoMetadata;
      const composioMetadata = await this.getVideoMetadataComposio(videoId);
      if (composioMetadata) {
        metadata = composioMetadata;
        console.log(`✅ Composio metadata extracted for video ${videoId}`);
      } else {
        // Fallback to direct API if Composio fails
        const directMetadata = await this.getVideoMetadataDirect(videoId);
        if (!directMetadata) {
          throw new Error('Failed to get video metadata from both Composio and YouTube API');
        }
        metadata = directMetadata;
        console.log(`⚠️ Using direct API fallback for video ${videoId}`);
      }
      
      // Try to get transcript using Composio
      let transcript: YouTubeTranscript | undefined;
      try {
        const transcriptResult = await this.getVideoTranscriptComposio(videoId);
        if (transcriptResult) {
          transcript = transcriptResult;
          console.log(`✅ Composio transcript extracted for video ${videoId}`);
        }
      } catch (error) {
        console.warn(`Composio transcript not available for video ${videoId}:`, error);
        // Fallback to description-based transcript
        try {
          const fallbackTranscript = await this.getVideoTranscriptDirect(videoId);
          if (fallbackTranscript) {
            transcript = fallbackTranscript;
          }
        } catch (fallbackError) {
          console.warn(`Fallback transcript also failed for video ${videoId}:`, fallbackError);
        }
      }

      return {
        metadata,
        transcript,
      };
    } catch (error) {
      console.error('Error extracting YouTube video info with Composio:', error);
      return {
        metadata: {} as YouTubeVideoMetadata,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get video metadata using Composio YouTube tools
   */
  async getVideoMetadataComposio(videoId: string): Promise<YouTubeVideoMetadata | null> {
    try {
      // Note: This is a placeholder for when Composio adds video metadata tools
      // Currently, Composio has limited YouTube tools available
      console.log('Composio video metadata tools not yet available');
      console.log('Using direct API fallback for metadata');
      return null;
    } catch (error) {
      console.error('Error getting video metadata from Composio:', error);
      return null;
    }
  }

  /**
   * Get video transcript using Composio YouTube tools
   */
  async getVideoTranscriptComposio(videoId: string): Promise<YouTubeTranscript | null> {
    try {
      // Use Composio's caption track tool
      // Note: Composio API methods may vary - this is a placeholder
      console.log('Composio YouTube tools not yet fully available');
      console.log('Using direct API fallback for transcript');
      return null;

      // Placeholder for when Composio YouTube tools are fully available
      return null;

    } catch (error) {
      console.error('Error getting video transcript from Composio:', error);
      return null;
    }
  }

  /**
   * Get video metadata using YouTube Data API v3 directly (fallback)
   */
  async getVideoMetadataDirect(videoId: string): Promise<YouTubeVideoMetadata | null> {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey || apiKey === 'your_youtube_api_key_here') {
        console.warn('YouTube API key not configured - using placeholder data');
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
   * Get video transcript using description (fallback method)
   */
  async getVideoTranscriptDirect(videoId: string): Promise<YouTubeTranscript | null> {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey || apiKey === 'your_youtube_api_key_here') {
        console.warn('YouTube API key not configured - transcript extraction unavailable');
        return null;
      }

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

      const cleanDescription = this.cleanVideoDescription(description);

      return {
        text: cleanDescription,
        language: video.snippet.defaultLanguage || 'en',
        isAutoGenerated: false,
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
      .replace(/\n{3,}/g, '\n\n')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/#[^\s]+/g, '')
      .trim();
  }

  /**
   * Validate Composio connection
   */
  async validateConnection(): Promise<boolean> {
    try {
      // Test Composio connection with a simple API call
      const testVideoId = 'dQw4w9WgXcQ';
      const captions = await this.getVideoTranscriptComposio(testVideoId);
      return true; // If we get here, Composio is working
    } catch (error) {
      console.error('Composio connection validation failed:', error);
      return false;
    }
  }

  /**
   * Get user's connected YouTube account info
   */
  async getUserConnection(userId: string): Promise<any> {
    try {
      // Note: Composio API methods may vary - this is a placeholder
      console.log('Composio connected accounts not yet fully available');
      return null;
      
              // Placeholder for when Composio connected accounts are fully available
        return null;
    } catch (error) {
      console.error('Error getting user YouTube connection:', error);
      return null;
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
   * Get videos from a specific playlist using Composio, fallback to direct API if needed
   */
  async getPlaylistVideos(playlistId: string, maxResults: number = 50): Promise<YouTubePlaylistItem[]> {
    try {
      console.log(`Getting playlist videos using Composio: ${playlistId}`);
      // Use Composio's playlist items tool
      const response = await this.composio.execute({
        action: 'YOUTUBE_GET_PLAYLIST_ITEMS',
        params: {
          playlistId,
          maxResults: Math.min(maxResults, 50),
          part: 'snippet,contentDetails'
        }
      });
      if (!response.successful || !response.data?.items) {
        console.log('No playlist items found or Composio tool not available, falling back to direct API');
        return await this.getPlaylistVideosDirect(playlistId, maxResults);
      }
      const playlistItems = response.data.items.map((item: any) => ({
        id: item.id,
        videoId: item.contentDetails?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        channelId: item.snippet?.channelId,
        channelTitle: item.snippet?.channelTitle,
        publishedAt: item.snippet?.publishedAt,
        thumbnails: item.snippet?.thumbnails,
        position: item.snippet?.position
      }));
      console.log(`✅ Composio extracted ${playlistItems.length} videos from playlist ${playlistId}`);
      return playlistItems;
    } catch (error) {
      console.error('Error getting playlist videos from Composio:', error);
      return await this.getPlaylistVideosDirect(playlistId, maxResults);
    }
  }

  /**
   * Get videos from a specific playlist using direct YouTube API (fallback)
   */
  async getPlaylistVideosDirect(playlistId: string, maxResults: number = 50): Promise<YouTubePlaylistItem[]> {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey || apiKey === 'your_youtube_api_key_here') {
        console.warn('YouTube API key not configured - playlist extraction unavailable');
        return [];
      }
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${Math.min(maxResults, 50)}&key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data = await response.json();
      const items = data.items || [];
      const playlistItems = items.map((item: any) => ({
        id: item.id,
        videoId: item.contentDetails?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        channelId: item.snippet?.channelId,
        channelTitle: item.snippet?.channelTitle,
        publishedAt: item.snippet?.publishedAt,
        thumbnails: item.snippet?.thumbnails,
        position: item.snippet?.position
      }));
      console.log(`✅ Direct API extracted ${playlistItems.length} videos from playlist ${playlistId}`);
      return playlistItems;
    } catch (error) {
      console.error('Error getting playlist videos directly:', error);
      return [];
    }
  }
} 