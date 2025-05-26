"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, ChevronDown, ChevronUp, Star, ExternalLink } from "lucide-react"

interface DemographicData {
  name: string
  current: number
  target: number
  percentage: number
}

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
  demographics: {
    age: DemographicData[]
    gender: DemographicData[]
    ethnicity: DemographicData[]
    other: DemographicData[]
  }
  trends: {
    responseRate: TrendData[]
    completionTime: TrendData[]
  }
  quotasBelowTarget: number
}

export function SurveyCard({
  id,
  name,
  responses,
  target,
  avgRating,
  sentiment,
  topThemes,
  demographics,
  trends,
  quotasBelowTarget,
}: SurveyCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTheme, setActiveTheme] = useState<string | null>(null)
  const [showAllThemes, setShowAllThemes] = useState(false)

  const progressPercentage = Math.round((responses / target) * 100)
  const positivePercentage = Math.round(sentiment.positive * 100)

  // Function to determine ring color based on percentage
  const getRingColor = (percentage: number) => {
    if (percentage >= 100) return "text-green-500 animate-pulse"
    if (percentage >= 80) return "text-green-500"
    return "text-amber-500"
  }

  // Function to render a demographic ring
  const renderDemographicRing = (data: DemographicData) => {
    const strokeDasharray = 2 * Math.PI * 18 // Circumference of circle with r=18
    const strokeDashoffset = strokeDasharray * (1 - data.percentage / 100)

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center mx-2 cursor-pointer">
            <div className="relative w-12 h-12 mb-1">
              <svg width="48" height="48" viewBox="0 0 48 48" className="absolute">
                <circle cx="24" cy="24" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={getRingColor(data.percentage)}
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {data.percentage}%
              </div>
            </div>
            <span className="text-xs text-gray-600">{data.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{data.name}</p>
          <p>
            {data.percentage}% ({data.current}/{data.target})
          </p>
          <p>{data.target - data.current} to go</p>
        </TooltipContent>
      </Tooltip>
    )
  }

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

          {/* Demographic Quotas - Now below Top Themes */}
          <div className="p-4 border-b bg-gray-50">
            <div className="mb-2 text-sm font-medium text-gray-700">Demographic Quotas</div>
            <div className="flex flex-wrap">
              <div className="mb-4 w-full sm:w-auto">
                <div className="text-xs text-gray-500 mb-1">Age</div>
                <div className="flex">
                  {demographics.age.map((demo, i) => (
                    <div key={i}>{renderDemographicRing(demo)}</div>
                  ))}
                </div>
              </div>

              <div className="mb-4 w-full sm:w-auto sm:ml-6">
                <div className="text-xs text-gray-500 mb-1">Gender</div>
                <div className="flex">
                  {demographics.gender.map((demo, i) => (
                    <div key={i}>{renderDemographicRing(demo)}</div>
                  ))}
                </div>
              </div>

              <div className="mb-4 w-full sm:w-auto sm:ml-6 md:hidden lg:block">
                <div className="text-xs text-gray-500 mb-1">Ethnicity</div>
                <div className="flex">
                  {demographics.ethnicity.slice(0, 3).map((demo, i) => (
                    <div key={i}>{renderDemographicRing(demo)}</div>
                  ))}
                  {demographics.ethnicity.length > 3 && (
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      +{demographics.ethnicity.length - 3} more
                    </Button>
                  )}
                </div>
              </div>

              <div className="hidden xl:block xl:ml-6">
                <div className="text-xs text-gray-500 mb-1">Other</div>
                <div className="flex">
                  {demographics.other.slice(0, 2).map((demo, i) => (
                    <div key={i}>{renderDemographicRing(demo)}</div>
                  ))}
                  {demographics.other.length > 2 && (
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      +{demographics.other.length - 2} more
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#3BD1BB] p-0 h-auto"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Hide quotas" : "See all quotas"}
                {expanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </Button>
            </div>

            {/* Expanded quotas for mobile */}
            {expanded && (
              <div className="mt-4 md:hidden">
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Ethnicity</div>
                  <div className="flex flex-wrap">
                    {demographics.ethnicity.map((demo, i) => (
                      <div key={i} className="mb-2">
                        {renderDemographicRing(demo)}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Other</div>
                  <div className="flex flex-wrap">
                    {demographics.other.map((demo, i) => (
                      <div key={i} className="mb-2">
                        {renderDemographicRing(demo)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-4 flex items-center justify-between">
            {quotasBelowTarget > 0 ? (
              <div className="flex items-center text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-sm">{quotasBelowTarget} quotas below 80%</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">All quotas on track</div>
            )}

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>

          {/* Theme Panel (conditionally rendered) */}
          {activeTheme && (
            <div className="p-4 bg-gray-50 border-t">
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
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
