"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ContentCard } from "@/components/content-card"
import { cn } from "@/lib/utils"

const filterOptions = [
  { id: "all", label: "All", count: 129 },
  { id: "learn", label: "Learn", count: 45 },
  { id: "plan", label: "Plan", count: 23 },
  { id: "ideate", label: "Ideate", count: 18 },
  { id: "cook", label: "Cook", count: 25 },
  { id: "shop", label: "Shop", count: 16 },
]

const mockContent = [
  {
    id: "youtube-test-1",
    title: "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",
    description: "The official video for 'Never Gonna Give You Up' by Rick Astley. Never: The Autobiography 📚 OUT NOW! Follow this link to get your copy and listen to Rick's 'Never' playlist ❤️ #RickAstleyNever",
    platform: "youtube",
    category: "Music",
    type: "Video",
    date: "2025-08-02",
  },
  {
    id: "youtube-test-2",
    title: "Qualifying Highlights | 2025 Hungarian Grand Prix",
    description: "Catch up on all the action from a thrilling Qualifying session, which saw a first pole position of the season, and the closest top-10 in Formula 1 history!",
    platform: "youtube",
    category: "Sports",
    type: "Video",
    date: "2025-08-02",
  },
  {
    id: "1",
    title: "Understanding the Basics of Machine Learning",
    description: "A brief overview of key concepts in machine learning",
    platform: "x",
    category: "AI",
    type: "Collection",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Financial Planning for Beginners",
    description: "Steps to create a personal financial plan",
    platform: "youtube",
    category: "Education",
    type: "Video",
    date: "2024-01-14",
  },
  {
    id: "3",
    title: "Tips for Creative Brainstorming",
    description: "Techniques to generate innovative ideas",
    platform: "tiktok",
    category: "Ideas",
    type: "Video",
    date: "2024-01-13",
  },
  {
    id: "4",
    title: "Exploring the History of Ancient Civilizations",
    description: "An introduction to early human societies",
    platform: "article",
    category: "History",
    type: "Article",
    date: "2024-01-12",
  },
  {
    id: "5",
    title: "Advanced React Patterns and Best Practices",
    description: "Deep dive into React patterns for scalable applications",
    platform: "x",
    category: "Development",
    type: "Thread",
    date: "2024-01-11",
  },
  {
    id: "6",
    title: "The Future of Artificial Intelligence",
    description: "Exploring upcoming trends in AI technology",
    platform: "youtube",
    category: "Technology",
    type: "Video",
    date: "2024-01-10",
  },
]

export function FeedContent() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="h-full w-full flex flex-col">
      {/* Filter Chips - Fixed at top */}
      <div className="w-full p-6 pb-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <Badge
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "secondary"}
              className={cn(
                "cursor-pointer px-3 py-1 text-sm font-medium transition-colors",
                activeFilter === filter.id
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
              onClick={() => setActiveFilter(filter.id)}
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
            {mockContent.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
