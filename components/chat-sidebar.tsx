"use client"

import { useState } from "react"
import { Send, Bot, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your SmartFeed assistant. I can help you find content, summarize articles, or brainstorm ideas. What would you like to explore?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand you're looking for information about that topic. Let me search through your saved content and provide some relevant insights.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  if (!isOpen) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex-shrink-0 flex items-start pt-4">
        <Button variant="ghost" size="icon" onClick={onToggle} className="w-8 h-8 mx-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={onToggle} className="w-8 h-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-gray-900 flex-1 text-center">Chat Assistant</h2>
        <div className="w-8" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.sender === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.content}
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
