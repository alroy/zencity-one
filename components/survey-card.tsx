"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star, ExternalLink } from "lucide-react"

interface Theme {
  name: string
  count: number
  quotes?: string[] // Add quotes array to the Theme interface
}

interface TrendData {
  date: string
  value: number
}

interface SurveyCardProps {
  id: number
  name: string
  responses: number
  target: number
  avgRating: number
  sentiment: {
    positive: number
    negative: number
    neutral: number
  }
  topThemes: Theme[]
  trends: {
    responseRate: TrendData[]
    completionTime: TrendData[]
  }
}

export function SurveyCard({ id, name, responses, target, avgRating, sentiment, topThemes, trends }: SurveyCardProps) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null)
  const [showAllThemes, setShowAllThemes] = useState(false)

  const progressPercentage = Math.round((responses / target) * 100)
  const positivePercentage = Math.round(sentiment.positive * 100)

  return (
    <TooltipProvider>
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex items-center space-x-2">
              <Progress value={progressPercentage} className="w-24 h-2 bg-gray-100" indicatorClassName="bg-[#3BD1BB]" />
              <Badge variant="secondary">
                {responses}/{target} ({progressPercentage}%)
              </Badge>
            </div>
          </div>

          {/* Quick-Stats Ribbon - Now only contains rating and sentiment */}
          <div className="bg-gray-50 p-3 flex items-center space-x-4 border-b">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{avgRating}/5</span>
            </div>

            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-sm font-medium">{positivePercentage}% positive</span>
            </div>
          </div>

          {/* Top Themes Section - Now a dedicated section with more prominence */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Top Themes</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    View All Results
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    These are preliminary results based on in-progress data and may change as more responses are
                    collected.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-wrap gap-2">
              {topThemes.slice(0, showAllThemes ? topThemes.length : 5).map((theme, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                  onClick={() => setActiveTheme(activeTheme === theme.name ? null : theme.name)}
                >
                  {theme.name}
                </Badge>
              ))}
              {topThemes.length > 5 && !showAllThemes && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#3BD1BB] p-0 h-auto text-sm"
                  onClick={() => setShowAllThemes(true)}
                >
                  +{topThemes.length - 5} more
                </Button>
              )}
              {showAllThemes && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#3BD1BB] p-0 h-auto text-sm"
                  onClick={() => setShowAllThemes(false)}
                >
                  Show less
                </Button>
              )}
            </div>

            {/* Theme Panel (conditionally rendered) */}
            {activeTheme && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Theme: {activeTheme}</h4>
                  <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => setActiveTheme(null)}>
                    Close
                  </Button>
                </div>
                <div className="space-y-2">
                  {/* Find the theme and display its quotes */}
                  {topThemes.find((theme) => theme.name === activeTheme)?.quotes ? (
                    // If the theme has quotes, display them
                    topThemes
                      .find((theme) => theme.name === activeTheme)
                      ?.quotes?.map((quote, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <p className="text-sm italic">"{quote}"</p>
                        </div>
                      ))
                  ) : (
                    // Default quotes if the theme doesn't have specific quotes
                    <>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm italic">
                          "I appreciate the city's attention to this issue. It's making a real difference in our
                          community."
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm italic">
                          "There's still room for improvement, but I can see the progress being made."
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
