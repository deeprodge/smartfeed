# Supabase Setup for Content Items CRUD

This guide will help you set up Supabase for the content_items table and configure the environment variables.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

## 2. Create the content_items Table

Run this SQL in your Supabase SQL editor:

```sql
-- Create the content_items table
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT,
  description TEXT,
  content TEXT,
  url TEXT,
  media_urls TEXT[],
  category TEXT,
  confidence_score FLOAT8,
  summary TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_content_items_user_id ON content_items(user_id);
CREATE INDEX idx_content_items_category ON content_items(category);
CREATE INDEX idx_content_items_platform ON content_items(platform);
CREATE INDEX idx_content_items_created_at ON content_items(created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_content_items_updated_at 
    BEFORE UPDATE ON content_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own content
CREATE POLICY "Users can view own content" ON content_items
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create policy to allow users to insert their own content
CREATE POLICY "Users can insert own content" ON content_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create policy to allow users to update their own content
CREATE POLICY "Users can update own content" ON content_items
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create policy to allow users to delete their own content
CREATE POLICY "Users can delete own content" ON content_items
  FOR DELETE USING (auth.uid()::text = user_id::text);
```

## 3. Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to your feed page
3. The content should load from Supabase (initially empty)
4. You can add new content using the form

## 5. API Endpoints

The following API endpoints are available:

- `GET /api/content?userId=user-id&category=learn&search=query` - Fetch content items
- `POST /api/content` - Create a new content item
- `GET /api/content/[id]` - Fetch a specific content item
- `PUT /api/content/[id]` - Update a content item
- `DELETE /api/content/[id]` - Delete a content item

## 6. Features

- ✅ Full CRUD operations for content items
- ✅ Filtering by category
- ✅ Search functionality
- ✅ Real-time updates
- ✅ Row Level Security (RLS)
- ✅ Automatic timestamp updates
- ✅ TypeScript support

## 7. Next Steps

1. Integrate with your authentication system
2. Add more advanced filtering and sorting
3. Implement pagination for large datasets
4. Add image upload functionality for media_urls
5. Implement real-time subscriptions for live updates 