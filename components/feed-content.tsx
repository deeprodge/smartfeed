"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ContentCard } from "@/components/content-card"
import { cn } from "@/lib/utils"
import { useContent } from "@/hooks/use-content"
import { ContentItem } from "@/lib/types/database"

const filterOptions = [
  { id: "all", label: "All", count: 0 },
  { id: "learn", label: "Learn", count: 0 },
  { id: "plan", label: "Plan", count: 0 },
  { id: "ideate", label: "Ideate", count: 0 },
  { id: "cook", label: "Cook", count: 0 },
  { id: "shop", label: "Shop", count: 0 },
]

export function FeedContent() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // TODO: Replace with actual user ID from auth
  const userId = "user-1"
  
  const { 
    contentItems, 
    loading, 
    error, 
    fetchContentItems, 
    deleteContentItem 
  } = useContent(userId)

  // Check if using mock data
  const isUsingMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Update filter counts
  const updateFilterCounts = () => {
    const counts = filterOptions.map(filter => {
      if (filter.id === "all") {
        return { ...filter, count: contentItems.length }
      }
      return { 
        ...filter, 
        count: contentItems.filter(item => item.category === filter.id).length 
      }
    })
    return counts
  }

  const currentFilterOptions = updateFilterCounts()

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
    fetchContentItems(filterId === "all" ? undefined : filterId, searchQuery)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteContentItem(id)
    } catch (error) {
      console.error('Failed to delete content item:', error)
    }
  }

  const handleEdit = (content: ContentItem) => {
    // TODO: Implement edit functionality
    console.log('Edit content:', content)
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-500">Loading content...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Mock Data Notice */}
      {isUsingMockData && (
        <div className="w-full p-3 bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm">
          <div className="flex items-center justify-between">
            <span>⚠️ Using mock data. Set up Supabase to use real data.</span>
            <a 
              href="/SETUP_GUIDE.md" 
              className="text-yellow-600 hover:text-yellow-800 underline"
              target="_blank"
            >
              Setup Guide
            </a>
          </div>
        </div>
      )}
      
      {/* Filter Chips - Fixed at top */}
      <div className="w-full p-6 pb-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {currentFilterOptions.map((filter) => (
            <Badge
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "secondary"}
              className={cn(
                "cursor-pointer px-3 py-1 text-sm font-medium transition-colors",
                activeFilter === filter.id
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
              onClick={() => handleFilterChange(filter.id)}
            >
              {filter.label} ({filter.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pt-4 w-full">
          <div className="space-y-4 w-full max-w-none">
            {contentItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No content items found. Add some content to get started!
              </div>
            ) : (
              contentItems.map((item) => (
                <ContentCard 
                  key={item.id} 
                  content={item} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
