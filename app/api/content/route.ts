import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all content items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json({ 
        error: 'Database not configured. Please set up Supabase environment variables.' 
      }, { status: 500 })
    }

    let query = supabase
      .from('content_items')
      .select('*')
      .eq('user_id', userId)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch content items',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - Create a new content item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, platform, title, description, content, url, thumbnail_url, media_urls, category, confidence_score, summary, metadata } = body

    if (!user_id || !platform) {
      return NextResponse.json({ error: 'user_id and platform are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('content_items')
      .insert({
        user_id,
        platform,
        title,
        description,
        content,
        url,
        thumbnail_url,
        media_urls,
        category,
        confidence_score,
        summary,
        metadata
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create content item' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 