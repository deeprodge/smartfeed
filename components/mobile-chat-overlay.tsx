"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChatSidebar } from "@/components/chat-sidebar"

export function MobileChatOverlay() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-gray-900 hover:bg-gray-800">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Chat Assistant</SheetTitle>
          </SheetHeader>
          <div className="h-full mt-4">
            <ChatSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
