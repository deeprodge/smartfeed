"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu } from "lucide-react"
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
  const isMobile = useIsMobile()

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
