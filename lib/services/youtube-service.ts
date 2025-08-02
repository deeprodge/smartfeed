/**
 * YouTube-specific service layer combining agent and content service
 */
import { YouTubeAgent } from '@/lib/agents/youtube-agent';
import { YouTubeAgentComposio } from '@/lib/agents/youtube-agent-composio';
import { ContentService, CreateContentItemRequest } from './content-service';
import { parseYouTubeUrl, createYouTubeUrl } from '@/lib/utils/youtube';
import { ContentItem } from '@/lib/types/database';
import { YouTubeExtractionResult } from '@/lib/types/youtube';

export interface ProcessYouTubeVideoResult {
  success: boolean;
  contentItem?: ContentItem;
  error?: string;
  alreadyExists?: boolean;
  usedComposio?: boolean;
}

export class YouTubeService {
  private youtubeAgent: YouTubeAgent;
  private composioAgent: YouTubeAgentComposio;
  private contentService: ContentService;

  constructor() {
    this.youtubeAgent = new YouTubeAgent();
    this.composioAgent = new YouTubeAgentComposio();
    this.contentService = new ContentService();
  }

  /**
   * Process a single YouTube video URL
   * Tries Composio first, falls back to direct API
   */
  async processVideoUrl(userId: string, youtubeUrl: string): Promise<ProcessYouTubeVideoResult> {
    try {
      console.log(`Processing YouTube URL: ${youtubeUrl}`);

      // Check if content already exists
      const parsedUrl = parseYouTubeUrl(youtubeUrl);
      if (!parsedUrl) {
        return {
          success: false,
          error: 'Invalid YouTube URL'
        };
      }

      const existingContent = await this.contentService.contentExists(
        userId, 
        'youtube', 
        parsedUrl.videoId
      );

      if (existingContent) {
        return {
          success: true,
          alreadyExists: true,
          error: 'Video already exists in your content'
        };
      }

      // Try Composio first
      let extractionResult: YouTubeExtractionResult;
      let usedComposio = false;

      try {
        console.log('🔄 Trying Composio extraction...');
        extractionResult = await this.composioAgent.extractVideoInfo(youtubeUrl);
        usedComposio = true;
        console.log('✅ Composio extraction successful');
      } catch (composioError) {
        console.log('⚠️ Composio extraction failed, using direct API fallback');
        console.log('Error:', composioError);
        
        // Fallback to direct API
        extractionResult = await this.youtubeAgent.extractVideoInfo(youtubeUrl);
        usedComposio = false;
      }

      if (!extractionResult.metadata) {
        return {
          success: false,
          error: 'Failed to extract video information'
        };
      }

      // Prepare content data
      const contentData = this.prepareContentData(
        userId, 
        extractionResult, 
        youtubeUrl, 
        parsedUrl.timestamp
      );

      // Create content item
      const contentItem = await this.contentService.createContentItem(contentData);

      return {
        success: true,
        contentItem,
        usedComposio
      };

    } catch (error) {
      console.error('Error processing YouTube video:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process multiple videos from user's Liked Videos
   */
  async processLikedVideos(userId: string): Promise<ProcessYouTubeVideoResult[]> {
    try {
      const likedVideos = await this.composioAgent.getLikedVideos(userId); // Assuming composioAgent is the primary agent for liked videos
      const results: ProcessYouTubeVideoResult[] = [];

      for (const video of likedVideos) {
        const videoUrl = createYouTubeUrl(video.videoId);
        const result = await this.processVideoUrl(userId, videoUrl);
        results.push(result);

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return results;
    } catch (error) {
      console.error('Error processing liked videos:', error);
      return [{
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }];
    }
  }

  /**
   * Process videos from a specific playlist
   */
  async processPlaylistVideos(userId: string, playlistId: string): Promise<ProcessYouTubeVideoResult[]> {
    try {
      const playlistVideos = await this.composioAgent.getPlaylistVideos(playlistId); // Assuming composioAgent is the primary agent for playlist videos
      const results: ProcessYouTubeVideoResult[] = [];

      for (const video of playlistVideos) {
        const videoUrl = createYouTubeUrl(video.videoId);
        const result = await this.processVideoUrl(userId, videoUrl);
        results.push(result);

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return results;
    } catch (error) {
      console.error('Error processing playlist videos:', error);
      return [{
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }];
    }
  }

  /**
   * Prepare content data for database storage
   */
  private prepareContentData(
    userId: string, 
    extractionResult: YouTubeExtractionResult, 
    originalUrl: string,
    timestamp?: number
  ): CreateContentItemRequest {
    const { metadata, transcript } = extractionResult;
    
    // Use transcript if available, otherwise use description
    const content = transcript?.text || metadata.description || '';
    
    // Create media URLs array from thumbnails
    const mediaUrls = Object.values(metadata.thumbnails)
      .filter(thumb => thumb?.url)
      .map(thumb => thumb!.url);

    return {
      user_id: userId,
      platform: 'youtube',
      external_id: metadata.videoId,
      title: metadata.title,
      description: metadata.description,
      content,
      url: originalUrl,
      media_urls: mediaUrls,
      metadata: {
        ...metadata,
        transcript: transcript ? {
          language: transcript.language,
          isAutoGenerated: transcript.isAutoGenerated
        } : undefined,
        timestamp,
        extractedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Validate YouTube service health
   */
  async validateService(): Promise<boolean> {
    return await this.composioAgent.validateConnection(); // Assuming composioAgent is the primary agent for validation
  }

  /**
   * Get video metadata directly (fallback method)
   */
  async getVideoMetadataDirect(videoId: string) {
    return await this.composioAgent.getVideoMetadataDirect(videoId); // Assuming composioAgent is the primary agent for direct metadata
  }
} 