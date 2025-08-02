import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/services/youtube-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { youtubeUrl, userId } = body;

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
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
      return NextResponse.json(
        { 
          message: 'Video already exists in your content',
          alreadyExists: true 
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'YouTube video processed successfully',
      contentItem: result.contentItem,
      usedComposio: result.usedComposio
    });

  } catch (error) {
    console.error('Error in YouTube sync route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'liked' or 'playlist'
    const playlistId = searchParams.get('playlistId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const youtubeService = new YouTubeService();

    if (type === 'liked') {
      const results = await youtubeService.processLikedVideos(userId);
      return NextResponse.json({
        success: true,
        message: 'Liked videos processed',
        results
      });
    }

    if (type === 'playlist' && playlistId) {
      const results = await youtubeService.processPlaylistVideos(userId, playlistId);
      return NextResponse.json({
        success: true,
        message: 'Playlist videos processed',
        results
      });
    }

    return NextResponse.json(
      { error: 'Invalid sync type. Use "liked" or "playlist"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in YouTube sync GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 