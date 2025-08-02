import { useState, useEffect } from 'react'
import { ContentItem } from '@/lib/types/database'

export function useContent(userId: string) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch content items
  const fetchContentItems = async (category?: string, search?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use mock data if Supabase is not configured
        const mockData: ContentItem[] = [
          {
            id: "530b3dab-d9e1-4b64-a1af-30386219e88e",
            user_id: "757cc21f-b8f8-4b55-9caa-52dfd4433440",
            platform: "instagram",
            title: "Sample Post 1",
            description: "Sample Instagram post content",
            content: "This is a sample Instagram post with engaging content...",
            url: "https://platform.com/post/1",
            thumbnail_url: "https://img.com/thumb/1.jpg",
            media_urls: ["https://img.com/thumb/1.jpg"],
            category: "learn",
            confidence_score: 0.85,
            summary: "Sample Instagram post about learning",
            metadata: { likes: 0, author: "user1" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "2a1b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
            user_id: "ab7ce264-ced7-4202-9f1f-0d74d2a49403",
            platform: "youtube",
            title: "Sample Post 2",
            description: "Sample YouTube video content",
            content: "This is a sample YouTube video with educational content...",
            url: "https://platform.com/post/2",
            thumbnail_url: "https://img.com/thumb/2.jpg",
            media_urls: ["https://img.com/thumb/2.jpg"],
            category: "plan",
            confidence_score: 0.92,
            summary: "Sample YouTube video about planning",
            metadata: { likes: 21, author: "user2" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "3b2c1d4e-5f6g-7h8i-9j0k-l1m2n3o4p5q6",
            user_id: "33f8a7b6-6f7b-4c70-9940-593bd1a077d0",
            platform: "twitter",
            title: "Sample Post 3",
            description: "Sample Twitter post content",
            content: "This is a sample Twitter post with insights...",
            url: "https://platform.com/post/3",
            thumbnail_url: "https://img.com/thumb/3.jpg",
            media_urls: ["https://img.com/thumb/3.jpg"],
            category: "ideate",
            confidence_score: 0.78,
            summary: "Sample Twitter post about ideation",
            metadata: { likes: 20, author: "user3" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "4c3d2e5f-6g7h-8i9j-0k1l-m2n3o4p5q6r7",
            user_id: "33f8a7b6-6f7b-4c70-9940-593bd1a077d0",
            platform: "youtube",
            title: "Sample Post 4",
            description: "Sample YouTube tutorial content",
            content: "This is a sample YouTube tutorial with step-by-step instructions...",
            url: "https://platform.com/post/4",
            thumbnail_url: "https://img.com/thumb/4.jpg",
            media_urls: ["https://img.com/thumb/4.jpg"],
            category: "learn",
            confidence_score: 0.89,
            summary: "Sample YouTube tutorial about learning",
            metadata: { likes: 72, author: "user4" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "5d4e3f6g-7h8i-9j0k-1l2m-n3o4p5q6r7s8",
            user_id: "33f8a7b6-6f7b-4c70-9940-593bd1a077d0",
            platform: "twitter",
            title: "Sample Post 5",
            description: "Sample Twitter thread content",
            content: "This is a sample Twitter thread with multiple insights...",
            url: "https://platform.com/post/5",
            thumbnail_url: "https://img.com/thumb/5.jpg",
            media_urls: ["https://img.com/thumb/5.jpg"],
            category: "plan",
            confidence_score: 0.81,
            summary: "Sample Twitter thread about planning",
            metadata: { likes: 11, author: "user5" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "6e5f4g7h-8i9j-0k1l-2m3n-o4p5q6r7s8t9",
            user_id: "ab7ce264-ced7-4202-9f1f-0d74d2a49403",
            platform: "youtube",
            title: "Sample Post 6",
            description: "Sample YouTube review content",
            content: "This is a sample YouTube review with detailed analysis...",
            url: "https://platform.com/post/6",
            thumbnail_url: "https://img.com/thumb/6.jpg",
            media_urls: ["https://img.com/thumb/6.jpg"],
            category: "ideate",
            confidence_score: 0.87,
            summary: "Sample YouTube review about ideation",
            metadata: { likes: 66, author: "user6" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "7f6g5h8i-9j0k-1l2m-3n4o-p5q6r7s8t9u0",
            user_id: "33f8a7b6-6f7b-4c70-9940-593bd1a077d0",
            platform: "youtube",
            title: "Sample Post 7",
            description: "Sample YouTube documentary content",
            content: "This is a sample YouTube documentary with compelling storytelling...",
            url: "https://platform.com/post/7",
            thumbnail_url: "https://img.com/thumb/7.jpg",
            media_urls: ["https://img.com/thumb/7.jpg"],
            category: "learn",
            confidence_score: 0.94,
            summary: "Sample YouTube documentary about learning",
            metadata: { likes: 93, author: "user7" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "8g7h6i9j-0k1l-2m3n-4o5p-q6r7s8t9u0v1",
            user_id: "757cc21f-b8f8-4b55-9caa-52dfd4433440",
            platform: "instagram",
            title: "Sample Post 8",
            description: "Sample Instagram story content",
            content: "This is a sample Instagram story with visual content...",
            url: "https://platform.com/post/8",
            thumbnail_url: "https://img.com/thumb/8.jpg",
            media_urls: ["https://img.com/thumb/8.jpg"],
            category: "cook",
            confidence_score: 0.76,
            summary: "Sample Instagram story about cooking",
            metadata: { likes: 10, author: "user8" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "9h8i7j0k-1l2m-3n4o-5p6q-r7s8t9u0v1w2",
            user_id: "ab7ce264-ced7-4202-9f1f-0d74d2a49403",
            platform: "twitter",
            title: "Sample Post 9",
            description: "Sample Twitter poll content",
            content: "This is a sample Twitter poll with community engagement...",
            url: "https://platform.com/post/9",
            thumbnail_url: "https://img.com/thumb/9.jpg",
            media_urls: ["https://img.com/thumb/9.jpg"],
            category: "shop",
            confidence_score: 0.69,
            summary: "Sample Twitter poll about shopping",
            metadata: { likes: 1, author: "user9" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
          {
            id: "0i9h8j1k-2l3m-4n5o-6p7q-s8t9u0v1w2x3",
            user_id: "33f8a7b6-6f7b-4c70-9940-593bd1a077d0",
            platform: "youtube",
            title: "Sample Post 10",
            description: "Sample YouTube live content",
            content: "This is a sample YouTube live stream with real-time interaction...",
            url: "https://platform.com/post/10",
            thumbnail_url: "https://img.com/thumb/10.jpg",
            media_urls: ["https://img.com/thumb/10.jpg"],
            category: "ideate",
            confidence_score: 0.83,
            summary: "Sample YouTube live stream about ideation",
            metadata: { likes: 3, author: "user10" },
            created_at: "2024-01-15T07:12:08Z",
            updated_at: "2024-01-15T07:12:08Z",
          },
        ]

        // Filter mock data based on category and search
        let filteredData = mockData
        if (category && category !== 'all') {
          filteredData = filteredData.filter(item => item.category === category)
        }
        if (search) {
          const searchLower = search.toLowerCase()
          filteredData = filteredData.filter(item => 
            item.title?.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower) ||
            item.content?.toLowerCase().includes(searchLower)
          )
        }

        setContentItems(filteredData)
        return
      }

      // Use real API if Supabase is configured
      const params = new URLSearchParams({ userId })
      if (category) params.append('category', category)
      if (search) params.append('search', search)

      const response = await fetch(`/api/content?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch content items')
      }

      const data = await response.json()
      setContentItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Create content item
  const createContentItem = async (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use mock data if Supabase is not configured
        const newItem: ContentItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setContentItems(prev => [newItem, ...prev])
        return newItem
      }

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })

      if (!response.ok) {
        throw new Error('Failed to create content item')
      }

      const newItem = await response.json()
      setContentItems(prev => [newItem, ...prev])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  // Update content item
  const updateContentItem = async (id: string, updates: Partial<ContentItem>) => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use mock data if Supabase is not configured
        setContentItems(prev => 
          prev.map(item => item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item)
        )
        return
      }

      const response = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update content item')
      }

      const updatedItem = await response.json()
      setContentItems(prev => 
        prev.map(item => item.id === id ? updatedItem : item)
      )
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  // Delete content item
  const deleteContentItem = async (id: string) => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use mock data if Supabase is not configured
        setContentItems(prev => prev.filter(item => item.id !== id))
        return
      }

      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete content item')
      }

      setContentItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchContentItems()
    }
  }, [userId])

  return {
    contentItems,
    loading,
    error,
    fetchContentItems,
    createContentItem,
    updateContentItem,
    deleteContentItem,
  }
} 