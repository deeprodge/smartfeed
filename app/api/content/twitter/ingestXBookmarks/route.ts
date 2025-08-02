import { NextRequest, NextResponse } from 'next/server';
import { summarizeAndCategorize, XBookmarkData } from '../../../../../lib/ai/claude';
import { CategoryType } from '../../../../../lib/constants/categories';
import { validateXBookmarksRequest, sanitizeText } from '../../../../../lib/utils/validation';

interface XBookmarksRequest {
  data: XBookmarkData[];
}

interface ProcessedItem {
  itemId: string;
  summary: string;
  category: CategoryType;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API endpoint called');
    const body: XBookmarksRequest = await request.json();
    console.log('📥 Request body received:', JSON.stringify(body, null, 2));
    
    if (!body.data || !validateXBookmarksRequest(body.data)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected "data" array with valid tweet objects.' },
        { status: 400 }
      );
    }

    const processedItems: ProcessedItem[] = [];

    // Process each tweet in the data array
    for (const tweet of body.data) {
      try {
        console.log(`Processing tweet ${tweet.id}...`);
        
        // Extract and sanitize text and notes
        const { id, text, created_at, author_id, public_metrics, notes } = tweet;
        const sanitizedText = sanitizeText(text);
        const sanitizedNotes = notes ? sanitizeText(notes) : undefined;

        console.log('Calling summarizeAndCategorize...');
        // Call Claude to summarize and categorize
        const { summary, category } = await summarizeAndCategorize(sanitizedText, sanitizedNotes);
        console.log('Summary and category:', { summary, category });

        console.log('Processing completed successfully');

        // Add to processed items
        processedItems.push({
          itemId: id,
          summary,
          category
        });

        console.log(`Successfully processed tweet ${tweet.id}`);

      } catch (error) {
        console.error(`Error processing tweet ${tweet.id}:`, error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        // Continue processing other tweets even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      items: processedItems,
      message: `Successfully processed ${processedItems.length} out of ${body.data.length} tweets`
    });

  } catch (error) {
    console.error('Error in ingestXBookmarks:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 