# YouTube Information Extraction System

## Overview

The YouTube information extraction system provides comprehensive video data extraction capabilities for SmartFeed. It uses a **hybrid approach** combining Composio's AI agent platform with direct YouTube Data API v3 calls for maximum reliability and functionality.

## Architecture

### Hybrid System Design

The system implements a **two-tier approach**:

1. **Primary: Composio Integration** 🚀
   - Uses Composio's AI agent platform for enhanced features
   - Handles authentication and tool normalization
   - Provides access to 3000+ pre-built tools
   - Future-ready for advanced YouTube features

2. **Fallback: Direct YouTube API** 🔄
   - Direct YouTube Data API v3 integration
   - Ensures reliability when Composio is unavailable
   - Provides real-time video metadata and transcript extraction
   - Handles all YouTube URL formats

### System Flow

```
YouTube URL → Parse & Validate → Try Composio → Fallback to Direct API → Process & Store
```

## Composio Integration

### Features

- **Enhanced Authentication**: OAuth flow handling via Composio
- **Tool Normalization**: Standardized interface across platforms
- **Event Triggers**: Webhook support for real-time ingestion
- **Future-Ready**: Access to new YouTube tools as they become available

### Available Composio Tools

- `YOUTUBE_LIST_CAPTION_TRACK` - Retrieve caption tracks
- `YOUTUBE_UPDATE_THUMBNAIL` - Update video thumbnails
- `YOUTUBE_GET_CHANNEL_ID_BY_HANDLE` - Get channel ID by handle
- Additional tools for video metadata, playlists, etc.

### Authentication Flow

```typescript
// Initialize Composio
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY
});

// Create auth config in Composio dashboard
const youtubeAuthConfigId = "ac_YOUR_YOUTUBE_CONFIG_ID";
const userId = "user-123";

// Initiate OAuth flow
const connectionRequest = await composio.connectedAccounts.initiate({
  user_id: userId,
  auth_config_id: youtubeAuthConfigId,
});

// User visits URL to authenticate
console.log(`Visit: ${connectionRequest.redirect_url}`);

// Wait for completion
await connectionRequest.waitForConnection({ timeout: 15 });
```

## Direct API Integration

### Features

- **Real-time Data**: Direct access to YouTube Data API v3
- **Comprehensive Metadata**: Title, description, statistics, thumbnails
- **Transcript Extraction**: Cleaned video descriptions as transcripts
- **URL Parsing**: Support for all YouTube URL formats
- **Error Handling**: Robust fallback mechanisms

### API Endpoints Used

- `GET /youtube/v3/videos` - Video metadata
- `GET /youtube/v3/captions` - Caption tracks (requires OAuth)
- `GET /youtube/v3/playlists` - Playlist information

## Implementation Details

### Core Components

1. **YouTubeAgentComposio** (`lib/agents/youtube-agent-composio.ts`)
   - Primary agent using Composio platform
   - Handles authentication and tool execution
   - Provides fallback to direct API

2. **YouTubeAgent** (`lib/agents/youtube-agent.ts`)
   - Direct YouTube API integration
   - Reliable fallback mechanism
   - Real-time data extraction

3. **YouTubeService** (`lib/services/youtube-service.ts`)
   - Orchestrates both agents
   - Implements hybrid approach
   - Manages content processing

### Hybrid Processing Flow

```typescript
async processVideoUrl(userId: string, youtubeUrl: string) {
  try {
    // Try Composio first
    console.log('🔄 Trying Composio extraction...');
    const result = await this.composioAgent.extractVideoInfo(youtubeUrl);
    console.log('✅ Composio extraction successful');
    return { ...result, usedComposio: true };
  } catch (composioError) {
    // Fallback to direct API
    console.log('⚠️ Composio failed, using direct API fallback');
    const result = await this.youtubeAgent.extractVideoInfo(youtubeUrl);
    return { ...result, usedComposio: false };
  }
}
```

## API Endpoints

### Manual Sync

**POST** `/api/sync/youtube`

```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "contentItem": { /* video data */ },
  "usedComposio": true
}
```

### Webhook Processing

**POST** `/api/webhooks/youtube`

Accepts webhook payloads from Composio or mobile share extensions.

## Environment Variables

```bash
# Required for Composio integration
COMPOSIO_API_KEY=ak_your_composio_api_key

# Required for direct API fallback
YOUTUBE_API_KEY=AIza_your_youtube_api_key

# Optional: Composio auth config ID
COMPOSIO_YOUTUBE_AUTH_CONFIG_ID=ac_your_auth_config_id
```

## Testing

### Test Script

```bash
node scripts/test-composio.js
```

### Demo Page

Visit `http://localhost:3000/youtube-demo` to test the hybrid system.

## Error Handling

### Composio Failures

- **Authentication Errors**: Fallback to direct API
- **Tool Unavailable**: Graceful degradation
- **Network Issues**: Automatic retry with fallback

### Direct API Failures

- **API Key Issues**: Placeholder data with warnings
- **Rate Limiting**: Exponential backoff
- **Invalid URLs**: Detailed error messages

## Future Enhancements

### Composio Features

- **Real-time Webhooks**: Instant video processing
- **Advanced Analytics**: Enhanced metadata extraction
- **Multi-platform Support**: Unified interface for X, YouTube, etc.

### Direct API Features

- **OAuth Integration**: Full transcript access
- **Playlist Support**: Bulk video processing
- **Advanced Filtering**: Content categorization

## Performance Considerations

### Caching

- **Metadata Cache**: 1-hour TTL for video data
- **Transcript Cache**: 24-hour TTL for descriptions
- **User Connections**: Persistent OAuth tokens

### Rate Limiting

- **Composio**: Respects platform limits
- **Direct API**: 10,000 units/day quota
- **Fallback Strategy**: Automatic load balancing

## Security

### API Key Management

- **Environment Variables**: Secure storage
- **Key Rotation**: Regular updates
- **Access Control**: User-specific permissions

### Data Privacy

- **User Consent**: OAuth authorization
- **Data Retention**: Configurable policies
- **Encryption**: TLS for all API calls

## Monitoring

### Logging

```typescript
console.log('🔄 Trying Composio extraction...');
console.log('✅ Composio extraction successful');
console.log('⚠️ Composio failed, using direct API fallback');
```

### Metrics

- **Success Rate**: Composio vs Direct API usage
- **Response Time**: Average processing duration
- **Error Rates**: Failure tracking by method

## Troubleshooting

### Common Issues

1. **Composio API Key Missing**
   - Set `COMPOSIO_API_KEY` environment variable
   - System will use direct API fallback

2. **YouTube API Key Invalid**
   - Verify API key in Google Cloud Console
   - Check quota limits

3. **OAuth Authentication Failing**
   - Verify Composio auth config
   - Check redirect URLs

### Debug Mode

Enable detailed logging:

```typescript
// In development
console.log('Composio response:', response);
console.log('Direct API response:', directResponse);
```

## Conclusion

The hybrid YouTube extraction system provides:

- **✅ Maximum Reliability**: Fallback mechanisms ensure uptime
- **✅ Enhanced Features**: Composio integration for future capabilities
- **✅ Real-time Processing**: Direct API for immediate results
- **✅ Scalable Architecture**: Easy to extend and maintain
- **✅ User-friendly**: Clear feedback on which method was used

This approach ensures SmartFeed users get the best possible YouTube content extraction experience while maintaining system stability and performance. 