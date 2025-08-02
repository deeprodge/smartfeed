import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/services/youtube-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle different webhook payload formats
    let youtubeUrl: string | undefined;
    let userId: string | undefined;

    // Check for Composio webhook format
    if (body.data && body.data.youtubeUrl) {
      youtubeUrl = body.data.youtubeUrl;
      userId = body.data.userId;
    }
    // Check for direct payload format
    else if (body.youtubeUrl) {
      youtubeUrl = body.youtubeUrl;
      userId = body.userId;
    }
    // Check for mobile share format
    else if (body.url && body.url.includes('youtube.com')) {
      youtubeUrl = body.url;
      userId = body.userId;
    }

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'No YouTube URL found in webhook payload' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const youtubeService = new YouTubeService();
    const result = await youtubeService.processVideoUrl(userId, youtubeUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to process YouTube video' },
        { status: 500 }
      );
    }

    if (result.alreadyExists) {
      return NextResponse.json({
        success: true,
        message: 'Video already exists in your content',
        alreadyExists: true
      });
    }

    return NextResponse.json({
      success: true,
      message: 'YouTube video processed successfully via webhook',
      contentItem: result.contentItem
    });

  } catch (error) {
    console.error('Error in YouTube webhook route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'ok',
    message: 'YouTube webhook endpoint is active'
  });
} 