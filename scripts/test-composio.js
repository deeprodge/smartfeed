/**
 * Test script for Composio YouTube integration
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testComposioIntegration() {
  console.log('🧪 Testing Composio YouTube Integration\n');

  // Test 1: Check environment variables
  console.log('1. Checking Environment Variables...');
  const composioKey = process.env.COMPOSIO_API_KEY;
  const youtubeKey = process.env.YOUTUBE_API_KEY;
  
  if (composioKey) {
    console.log('   ✅ COMPOSIO_API_KEY: Set');
  } else {
    console.log('   ❌ COMPOSIO_API_KEY: Not set');
  }
  
  if (youtubeKey && youtubeKey !== 'your_youtube_api_key_here') {
    console.log('   ✅ YOUTUBE_API_KEY: Set');
  } else {
    console.log('   ❌ YOUTUBE_API_KEY: Not set');
  }
  console.log('');

  // Test 2: Test our API endpoint with Composio integration
  console.log('2. Testing API Endpoint with Composio Integration...');
  
  try {
    const response = await fetch('http://localhost:3000/api/sync/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        userId: 'test-user-123'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ API endpoint working!');
      console.log(`   Success: ${result.success}`);
      if (result.contentItem) {
        console.log(`   Title: ${result.contentItem.title}`);
        console.log(`   Platform: ${result.contentItem.platform}`);
        if (result.usedComposio !== undefined) {
          console.log(`   Used Composio: ${result.usedComposio ? 'Yes' : 'No (Fallback)'}`);
        }
      }
    } else {
      console.log(`   ❌ API endpoint error: ${response.status}`);
    }
  } catch (error) {
    console.log('   ❌ API endpoint test failed (server may not be running)');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');

  console.log('✅ Composio integration test completed!');
  console.log('\n📝 Note: The system uses a hybrid approach:');
  console.log('📝 - Tries Composio first for enhanced features');
  console.log('📝 - Falls back to direct YouTube API for reliability');
  console.log('📝 - Shows which method was used in the response');
}

// Run the test
testComposioIntegration().catch(console.error); 