# X Bookmarks Ingestion API

This API endpoint processes X (Twitter) bookmarks by summarizing and categorizing them using Claude AI, then storing them in Pinecone for vector search.

## Endpoint

`POST /api/content/twitter/ingestXBookmarks`

## Request Body

```json
{
  "data": [
    {
      "id": "1946443261729526023",
      "text": "match your resume to job descriptions with AI https://t.co/vEE7ZjBPNT",
      "created_at": "2025-07-19T05:33:31.000Z",
      "author_id": "1326180756310331399",
      "public_metrics": {
        "retweet_count": 10,
        "reply_count": 5,
        "like_count": 25,
        "quote_count": 2
      },
      "notes": "Great tool for job applications"
    }
  ]
}
```

### Fields

- `id` (string, required): Tweet ID
- `text` (string, required): Tweet text content
- `created_at` (string, required): ISO 8601 timestamp
- `author_id` (string, required): Author's user ID
- `public_metrics` (object, required): Twitter engagement metrics
- `notes` (string, optional): User notes about the bookmark

## Response

```json
{
  "success": true,
  "items": [
    {
      "itemId": "1946443261729526023",
      "summary": "AI-powered tool for matching resumes to job descriptions to improve application success rates.",
      "category": "learn"
    }
  ],
  "message": "Successfully processed 1 out of 1 tweets"
}
```

## Categories

The API categorizes content into one of five fixed categories:

- **Learn**: Educational content, tutorials, and learning resources
- **Plan**: Planning guides, how-to content, and project resources
- **Ideate**: Creative inspiration, brainstorming, and idea generation
- **Cook**: Recipes, cooking tips, and food-related content
- **Shop**: Product reviews, shopping guides, and recommendations

## Environment Variables Required

- `ANTHROPIC_API_KEY`: Claude API key for summarization and categorization
- `OPENAI_API_KEY`: OpenAI API key for embedding generation
- `PINECONE_API_KEY`: Pinecone API key for vector storage
- `PINECONE_INDEX_NAME`: Pinecone index name (defaults to 'smartfeed-items')

## Processing Flow

1. **Validation**: Validates the request body structure
2. **Summarization**: Uses Claude AI to generate 2-3 sentence summaries
3. **Categorization**: Uses Claude AI to assign one of the five categories
4. **Embedding**: Generates vector embeddings for search
5. **Storage**: Upserts data to Pinecone with metadata
6. **Response**: Returns processed items with summaries and categories

## Error Handling

- Returns 400 for invalid request body
- Returns 500 for internal server errors
- Continues processing other tweets if individual tweets fail
- Provides detailed error messages in response

## Example Usage

```typescript
const response = await fetch('/api/content/twitter/ingestXBookmarks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data: [
      {
        id: "1946443261729526023",
        text: "match your resume to job descriptions with AI https://t.co/vEE7ZjBPNT",
        created_at: "2025-07-19T05:33:31.000Z",
        author_id: "1326180756310331399",
        public_metrics: {
          retweet_count: 10,
          reply_count: 5,
          like_count: 25,
          quote_count: 2
        },
        notes: "Great tool for job applications"
      }
    ]
  })
});

const result = await response.json();
console.log(result.items); // Array of processed items
``` 