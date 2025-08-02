"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChatSidebar } from "@/components/chat-sidebar"
import { MobileChatOverlay } from "@/components/mobile-chat-overlay"
import { Navigation } from "@/components/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface FeedLayoutProps {
  children: React.ReactNode
}

export function FeedLayout({ children }: FeedLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const isMobile = useIsMobile()

  const handleSyncBookmarks = async () => {
    setIsSyncing(true)
    console.log("🔄 Starting bookmark sync...")
    
    try {
      // Dummy code for fetching bookmarks
      console.log("📥 Fetching bookmarks from X API...")
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dummy bookmarks data
      const dummyBookmarks = {
        data: [
          {
            id: "1946443261729526023",
            text: "Learn TypeScript in 2025: Complete guide with examples and best practices",
            created_at: "2025-01-19T10:00:00.000Z",
            author_id: "123",
            public_metrics: {
              retweet_count: 5,
              reply_count: 2,
              like_count: 15,
              quote_count: 1
            },
            notes: "Great learning resource"
          },
          {
            id: "1946443261729526024",
            text: "New recipe for homemade pizza dough that's perfect for beginners",
            created_at: "2025-01-19T11:00:00.000Z",
            author_id: "456",
            public_metrics: {
              retweet_count: 8,
              reply_count: 3,
              like_count: 22,
              quote_count: 2
            }
          }
        ]
      }
      
      console.log("📚 Fetched bookmarks:", dummyBookmarks)
      
      // Process bookmarks using our API
      console.log("🔄 Processing bookmarks...")
      
      const response = await fetch('/api/content/twitter/ingestXBookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dummyBookmarks)
      })
      
      const result = await response.json()
      console.log("✅ Bookmarks processed:", result)
      
      // Show success message
      console.log("🎉 Bookmark sync completed successfully!")
      
    } catch (error) {
      console.error("❌ Error syncing bookmarks:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 z-40 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <Navigation />
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-xl font-semibold text-gray-900">SmartFeed</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your saved content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 md:w-80"
              />
            </div>
            <Button
              onClick={handleSyncBookmarks}
              disabled={isSyncing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync bookmarks'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full overflow-hidden">
        {/* Desktop Navigation */}
        {!isMobile && (
          <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
            <Navigation />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* Desktop Chat Sidebar */}
        {!isMobile && <ChatSidebar isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />}
      </div>

      {/* Mobile Chat Overlay */}
      {isMobile && <MobileChatOverlay />}
    </div>
  )
}
