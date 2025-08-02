import { Calendar, Bookmark, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ContentCardProps {
  content: {
    id: string
    title: string
    description: string
    platform: string
    category: string
    type: string
    date: string
  }
}

const platformIcons = {
  x: "𝕏",
  youtube: "▶",
  tiktok: "♪",
  article: "📄",
}

const platformColors = {
  x: "bg-black text-white",
  youtube: "bg-red-600 text-white",
  tiktok: "bg-black text-white",
  article: "bg-gray-600 text-white",
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${platformColors[content.platform as keyof typeof platformColors]}`}
            >
              {platformIcons[content.platform as keyof typeof platformIcons]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-base">{content.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {content.category}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {content.type}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
              <Calendar className="h-3 w-3" />
              {new Date(content.date).toLocaleDateString()}
            </div>
          </div>

          <Button variant="ghost" size="sm" className="text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
