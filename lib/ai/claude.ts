import Anthropic from '@anthropic-ai/sdk';
import { CATEGORIES, CategoryType } from '../constants/categories';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_KEY,
});

console.log('🔑 Anthropic API key configured:', !!process.env.NEXT_PUBLIC_ANTHROPIC_KEY);

export interface SummarizeAndCategorizeParams {
  summary: string;
  category: CategoryType;
}

export interface XBookmarkData {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: Record<string, any>;
  notes?: string;
}

export async function summarizeAndCategorize(tweetText: string, notes?: string): Promise<SummarizeAndCategorizeParams> {
  console.log('🤖 Claude service called with text:', tweetText.substring(0, 50) + '...');
  const fullText = notes ? `${tweetText}\n\nNotes: ${notes}` : tweetText;
  
  try {
    console.log('Calling Claude API with text:', fullText.substring(0, 100) + '...');
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Here are your allowed categories—Learn, Plan, Ideate, Cook, Shop—and do not create or suggest any others.
Summarize the following tweet text in 2–3 sentences and choose exactly one of these categories.
Return your response by calling the summarize_and_categorize function with valid JSON.

Tweet text: ${fullText}`
        }
      ],
      tools: [
        {
          name: 'summarize_and_categorize',
          description: 'Produce a 2–3 sentence summary and assign one of the five fixed categories.',
          input_schema: {
            type: 'object',
            properties: {
              summary: {
                type: 'string',
                description: 'Concise 2–3 sentence summary of the tweet text.'
              },
              category: {
                type: 'string',
                enum: Object.values(CATEGORIES),
                description: 'Must be exactly one of: Learn, Plan, Ideate, Cook, Shop.'
              }
            },
            required: ['summary', 'category']
          }
        }
      ]
    });

    console.log('Claude response received:', JSON.stringify(message.content, null, 2));

    const toolUse = message.content.find(item => item.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      console.log('No tool use found, falling back to simple categorization');
      // Fallback: simple categorization without AI
      const lowerText = fullText.toLowerCase();
      let category: CategoryType = 'learn';
      
      if (lowerText.includes('recipe') || lowerText.includes('cook') || lowerText.includes('food')) {
        category = 'cook';
      } else if (lowerText.includes('plan') || lowerText.includes('checklist') || lowerText.includes('guide')) {
        category = 'plan';
      } else if (lowerText.includes('creative') || lowerText.includes('brainstorm') || lowerText.includes('idea')) {
        category = 'ideate';
      } else if (lowerText.includes('buy') || lowerText.includes('product') || lowerText.includes('review')) {
        category = 'shop';
      }
      
      return {
        summary: `Summary: ${fullText.substring(0, 100)}${fullText.length > 100 ? '...' : ''}`,
        category
      };
    }

    const input = toolUse.input as SummarizeAndCategorizeParams;
    
    // Validate category
    if (!Object.values(CATEGORIES).includes(input.category as CategoryType)) {
      throw new Error(`Invalid category: ${input.category}`);
    }

    return {
      summary: input.summary,
      category: input.category as CategoryType
    };
  } catch (error) {
    console.error('Error in Claude API call:', error);
    // Fallback: simple categorization without AI
    const lowerText = fullText.toLowerCase();
    let category: CategoryType = 'learn';
    
    if (lowerText.includes('recipe') || lowerText.includes('cook') || lowerText.includes('food')) {
      category = 'cook';
    } else if (lowerText.includes('plan') || lowerText.includes('checklist') || lowerText.includes('guide')) {
      category = 'plan';
    } else if (lowerText.includes('creative') || lowerText.includes('brainstorm') || lowerText.includes('idea')) {
      category = 'ideate';
    } else if (lowerText.includes('buy') || lowerText.includes('product') || lowerText.includes('review')) {
      category = 'shop';
    }
    
    return {
      summary: `Summary: ${fullText.substring(0, 100)}${fullText.length > 100 ? '...' : ''}`,
      category
    };
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 0,
    messages: [
      {
        role: 'user',
        content: text
      }
    ]
  });

  // Note: This is a placeholder. Claude doesn't have a direct embedding endpoint like OpenAI.
  // You might need to use a different service for embeddings or implement a workaround.
  // For now, we'll throw an error to indicate this needs to be implemented.
  throw new Error('Embedding generation not yet implemented for Claude. Consider using OpenAI or another embedding service.');
} 