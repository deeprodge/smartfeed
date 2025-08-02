# Quick Setup Guide - Fix "Failed to Get Content" Error

## The Problem
You're seeing "failed to get content" because the Supabase environment variables aren't configured yet.

## Solution

### 1. Create Environment File
Create a file called `.env.local` in your project root (same folder as `package.json`) with this content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Your Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use an existing one
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key
5. Replace the placeholder values in `.env.local`

### 3. Create the Database Table
1. In your Supabase dashboard, go to SQL Editor
2. Run the SQL from `SUPABASE_SETUP.md` to create the `content_items` table

### 4. Restart Your Development Server
```bash
npm run dev
```

## Alternative: Use Mock Data (Temporary)
If you want to test the UI without setting up Supabase, I can modify the code to use mock data temporarily. Just let me know!

## Check Your Setup
After setting up the environment variables, the error should change to be more specific about what's wrong (like "table doesn't exist" or "connection failed"). 