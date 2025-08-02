'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function YouTubeDemoPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [playlistId, setPlaylistId] = useState('');
  const [playlistResult, setPlaylistResult] = useState<any>(null);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState('');

  const testUrls = [
    'https://www.youtube.com/watch?v=54SSKAjFrWs',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    'https://www.youtube.com/watch?v=9bZkp7q19f0'
  ];

  const processYouTubeUrl = async () => {
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/sync/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl,
          userId: 'demo-user-123'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to process YouTube URL');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const processPlaylist = async () => {
    if (!playlistId) {
      setPlaylistError('Please enter a Playlist ID or URL');
      return;
    }
    setPlaylistLoading(true);
    setPlaylistError('');
    setPlaylistResult(null);
    // Extract playlistId from URL if needed
    let pid = playlistId;
    const match = playlistId.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (match) pid = match[1];
    try {
      const response = await fetch(`/api/sync/youtube?userId=demo-user-123&type=playlist&playlistId=${encodeURIComponent(pid)}`);
      const data = await response.json();
      if (response.ok) {
        setPlaylistResult(data);
      } else {
        setPlaylistError(data.error || 'Failed to process playlist');
      }
    } catch (err) {
      setPlaylistError('Network error: ' + (err as Error).message);
    } finally {
      setPlaylistLoading(false);
    }
  };

  const testWebhook = async () => {
    try {
      const response = await fetch('/api/webhooks/youtube');
      const data = await response.json();
      setResult({ type: 'webhook', data });
    } catch (err) {
      setError('Webhook test failed: ' + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">YouTube Extraction Demo</h1>
          <p className="text-gray-600">
            Test the YouTube information extraction system built with Composio
          </p>
        </div>

        <div className="grid gap-6 pb-8">
          {/* URL Input */}
          <Card>
            <CardHeader>
              <CardTitle>Process YouTube Video</CardTitle>
              <CardDescription>
                Enter a YouTube URL to extract video information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={processYouTubeUrl}
                  disabled={loading || !youtubeUrl}
                >
                  {loading ? 'Processing...' : 'Extract'}
                </Button>
              </div>

              {/* Test URLs */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Test URLs:</p>
                <div className="flex flex-wrap gap-2">
                  {testUrls.map((url, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setYoutubeUrl(url)}
                    >
                      Test {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Playlist Extraction */}
          <Card>
            <CardHeader>
              <CardTitle>Process YouTube Playlist</CardTitle>
              <CardDescription>Enter a Playlist ID or URL to extract all videos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="PL... or https://www.youtube.com/playlist?list=..."
                  value={playlistId}
                  onChange={(e) => setPlaylistId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={processPlaylist} disabled={playlistLoading || !playlistId}>
                  {playlistLoading ? 'Processing...' : 'Extract Playlist'}
                </Button>
              </div>
              {playlistError && <div className="text-red-600 text-sm mt-2">{playlistError}</div>}
              {playlistResult && (
                <div className="mt-4">
                  <div className="mb-2 font-medium">Extraction Method: {playlistResult.results?.[0]?.usedComposio === true ? <span className="text-green-600">Composio</span> : <span className="text-blue-600">Direct API</span>}</div>
                  <div className="mb-2">Total Videos: {playlistResult.totalVideos ?? playlistResult.results?.length}</div>
                  <div className="max-h-80 overflow-y-auto border rounded bg-gray-50 p-2">
                    {playlistResult.results?.map((item: any, idx: number) => (
                      <div key={idx} className="mb-2 border-b pb-2 last:border-b-0">
                        {item.contentItem ? (
                          <>
                            <div className="font-semibold">{item.contentItem.title}</div>
                            <div className="text-xs text-gray-500">{item.contentItem.url}</div>
                          </>
                        ) : (
                          <div className="text-red-600 text-xs">{item.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Webhook Test */}
          <Card>
            <CardHeader>
              <CardTitle>Webhook Test</CardTitle>
              <CardDescription>
                Test the webhook endpoint health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testWebhook} variant="outline">
                Test Webhook
              </Button>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Result Display */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Extraction Result</CardTitle>
                <CardDescription>
                  {result.type === 'webhook' ? 'Webhook Response' : 'Video Information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.success && result.contentItem && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Title:</span> {result.contentItem.title}
                        </div>
                        <div>
                          <span className="font-medium">Platform:</span> {result.contentItem.platform}
                        </div>
                        <div>
                          <span className="font-medium">Video ID:</span> {result.contentItem.external_id}
                        </div>
                        <div>
                          <span className="font-medium">Content Item ID:</span> {result.contentItem.id}
                        </div>
                        {result.usedComposio !== undefined && (
                          <div className="col-span-2">
                            <span className="font-medium">Extraction Method:</span>{' '}
                            {result.usedComposio ? (
                              <span className="text-green-600">✅ Composio</span>
                            ) : (
                              <span className="text-blue-600">🔄 Direct API (Fallback)</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {result.contentItem.metadata && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Metadata:</h4>
                          <div className="max-h-60 overflow-y-auto">
                            <pre className="bg-gray-100 p-3 rounded text-xs">
                              {JSON.stringify(result.contentItem.metadata, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {result.type === 'webhook' && (
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Status:</span> {result.data.status}
                      </div>
                      <div>
                        <span className="font-medium">Message:</span> {result.data.message}
                      </div>
                    </div>
                  )}

                  {result.alreadyExists && (
                    <div className="text-blue-600 font-medium">
                      ✅ Video already exists in your content
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Full Response:</h4>
                    <div className="max-h-80 overflow-y-auto">
                      <pre className="bg-gray-100 p-3 rounded text-xs">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* System Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">URL Parsing:</span> ✅ Working
              </div>
              <div>
                <span className="font-medium">API Endpoints:</span> ✅ Active
              </div>
              <div>
                <span className="font-medium">Content Processing:</span> ✅ Functional
              </div>
              <div>
                <span className="font-medium">Composio Integration:</span> 🔄 Hybrid Mode
              </div>
              <div>
                <span className="font-medium">Direct API Fallback:</span> ✅ Available
              </div>
              <div>
                <span className="font-medium">Transcript Extraction:</span> ✅ Working
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Hybrid Mode:</strong> The system tries Composio first for enhanced features, 
                then falls back to direct YouTube API for reliability. This ensures maximum 
                functionality while maintaining stability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 