"use client"

import { useState } from "react"
import { Send, Lightbulb, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface IdeaMessage {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  type?: "idea" | "spec" | "message"
}

const ideaPrompts = [
  "Help me brainstorm app ideas for productivity",
  "Generate content ideas for my blog",
  "What are some innovative business models?",
  "Creative ways to improve user onboarding",
]

export function IdeateChat() {
  const [messages, setMessages] = useState<IdeaMessage[]>([
    {
      id: "1",
      content:
        "Welcome to the Ideation Hub! I'm here to help you brainstorm ideas and generate detailed specs. What would you like to explore today?",
      sender: "assistant",
      timestamp: new Date(),
      type: "message",
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: IdeaMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "message",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate assistant response with ideas
    setTimeout(() => {
      const assistantMessage: IdeaMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "Here are some creative ideas based on your request:\n\n1. **Smart Learning Companion** - An AI-powered study buddy that adapts to your learning style\n2. **Micro-Habit Tracker** - Focus on building tiny habits that compound over time\n3. **Context-Aware Reminder System** - Reminders that understand your location and schedule",
        sender: "assistant",
        timestamp: new Date(),
        type: "idea",
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1500)
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  const generateSpec = (idea: string) => {
    const specMessage: IdeaMessage = {
      id: Date.now().toString(),
      content: `## Product Specification: ${idea}\n\n**Problem Statement:**\nUsers struggle with maintaining consistent learning habits due to lack of personalization and adaptive feedback.\n\n**Solution Overview:**\nAn AI companion that learns from user behavior and adapts study materials, timing, and methods to optimize learning outcomes.\n\n**Key Features:**\n- Adaptive learning algorithms\n- Personalized content curation\n- Progress tracking and analytics\n- Social learning features\n\n**Success Metrics:**\n- User engagement rate\n- Learning completion rates\n- Knowledge retention scores`,
      sender: "assistant",
      timestamp: new Date(),
      type: "spec",
    }
    setMessages((prev) => [...prev, specMessage])
  }

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Ideation Hub</h1>
            <p className="text-sm text-gray-600">Brainstorm ideas and generate detailed specifications</p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="p-6 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Start Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ideaPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3 text-sm bg-transparent"
                onClick={() => handlePromptClick(prompt)}
              >
                <Sparkles className="h-4 w-4 mr-2 shrink-0" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                </div>
              )}

              <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                {message.type === "spec" ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-sm">Generated Specification</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Spec
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {message.content.split("\n").map((line, i) => (
                          <div key={i} className="mb-1">
                            {line.startsWith("##") ? (
                              <h3 className="font-semibold text-gray-900 mt-3 mb-2">{line.replace("## ", "")}</h3>
                            ) : line.startsWith("**") ? (
                              <p className="font-medium text-gray-800 mt-2">{line.replace(/\*\*/g, "")}</p>
                            ) : line.startsWith("-") ? (
                              <li className="ml-4 text-gray-700">{line.replace("- ", "")}</li>
                            ) : line ? (
                              <p className="text-gray-700">{line}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-gray-900 text-white"
                        : message.type === "idea"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                    {message.type === "idea" && message.sender === "assistant" && (
                      <div className="mt-3 pt-3 border-t border-yellow-200">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateSpec("Smart Learning Companion")}
                          className="text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Generate Spec for Idea #1
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            placeholder="Describe what you want to brainstorm or ideate..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
