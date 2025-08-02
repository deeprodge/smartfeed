"use client"

import { TrendingUp, Clock, Target, Flame, BookOpen, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const streakData = {
  current: 12,
  longest: 28,
  thisWeek: 5,
}

const readingStats = {
  totalTime: 145, // minutes this week
  articlesRead: 23,
  averageTime: 6.3, // minutes per article
  completionRate: 78,
}

const categoryBreakdown = [
  { name: "Learn", count: 45, percentage: 35, color: "bg-blue-500" },
  { name: "Plan", count: 23, percentage: 18, color: "bg-green-500" },
  { name: "Ideate", count: 18, percentage: 14, color: "bg-yellow-500" },
  { name: "Cook", count: 25, percentage: 20, color: "bg-red-500" },
  { name: "Shop", count: 16, percentage: 13, color: "bg-purple-500" },
]

const weeklyActivity = [
  { day: "Mon", articles: 4, time: 25 },
  { day: "Tue", articles: 6, time: 38 },
  { day: "Wed", articles: 3, time: 18 },
  { day: "Thu", articles: 5, time: 32 },
  { day: "Fri", articles: 2, time: 12 },
  { day: "Sat", articles: 1, time: 8 },
  { day: "Sun", articles: 2, time: 12 },
]

export function AnalyticsDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your learning progress and reading habits</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streakData.current} days</div>
            <p className="text-xs text-gray-600">Longest: {streakData.longest} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingStats.totalTime}m</div>
            <p className="text-xs text-gray-600">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingStats.articlesRead}</div>
            <p className="text-xs text-gray-600">Avg {readingStats.averageTime}m each</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingStats.completionRate}%</div>
            <Progress value={readingStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Content by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{category.count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{day.day}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(day.time / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{day.articles} articles</span>
                    <span>{day.time}m</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Goals & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">🎯</div>
              <div className="text-sm font-medium mt-2">Weekly Goal</div>
              <div className="text-xs text-gray-600">20/25 articles</div>
              <Progress value={80} className="mt-2" />
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">📚</div>
              <div className="text-sm font-medium mt-2">Knowledge Seeker</div>
              <div className="text-xs text-gray-600">Read 100+ articles</div>
              <Badge className="mt-2">Achieved</Badge>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">🔥</div>
              <div className="text-sm font-medium mt-2">Streak Master</div>
              <div className="text-xs text-gray-600">7-day reading streak</div>
              <Badge className="mt-2">Achieved</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
