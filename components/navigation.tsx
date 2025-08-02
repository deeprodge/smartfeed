"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Lightbulb, Rss } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Feed",
    href: "/feed",
    icon: Rss,
    description: "Your personalized content feed",
  },
  {
    name: "Ideate",
    href: "/ideate",
    icon: Lightbulb,
    description: "Brainstorm and generate ideas",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Track your learning progress",
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="p-4">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <item.icon className="h-5 w-5" />
              <div>
                <div>{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
