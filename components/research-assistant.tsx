"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, BarChart3, Users, ExternalLink, Lightbulb } from "lucide-react"
import { PageHeader } from "@/components/page-header"

interface ResearchAssistantProps {
  onSectionChange?: (section: string, options?: any) => void
}

export function ResearchAssistant({ onSectionChange }: ResearchAssistantProps) {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [currentResults, setCurrentResults] = useState<typeof allSearchResults.default>([])

  const breadcrumbItems = [
    { label: "City Explorer", path: "city-explorer", isClickable: false },
    { label: "Research Assistance", isCurrent: true },
  ]

  const exampleQueries = [
    "Should we increase funding for public transportation?",
    "What are residents saying about the new bike lanes?",
    "How effective was our last community engagement campaign?",
  ]

  const allSearchResults = {
    default: [
      {
        id: 1,
        title: "Survey Data: Transportation Preferences",
        source: "Parks & Recreation Survey",
        type: "survey",
        insight:
          "67% of respondents support increased public transit funding, with highest support among 25-45 age group",
        confidence: "high",
        date: "2 days ago",
      },
      {
        id: 2,
        title: "Social Media Sentiment: Public Transit",
        source: "Social Media Monitoring",
        type: "social",
        insight: "Positive sentiment (72%) regarding bus route expansions, concerns about frequency during peak hours",
        confidence: "medium",
        date: "1 week ago",
      },
      {
        id: 3,
        title: "311 Requests: Transit-Related Issues",
        source: "311 System",
        type: "service",
        insight: "15% increase in transit-related service requests, primarily about schedule reliability",
        confidence: "high",
        date: "3 days ago",
      },
    ],
    "Should we increase funding for public transportation?": [
      {
        id: 1,
        title: "Public Transportation Budget Analysis",
        source: "City Budget Survey",
        type: "survey",
        insight:
          "73% of respondents favor increasing public transportation funding, with strongest support in downtown districts",
        confidence: "high",
        date: "3 days ago",
      },
      {
        id: 2,
        title: "Transit Ridership Trends",
        source: "Transportation Department",
        type: "service",
        insight:
          "12% increase in ridership over the past quarter, suggesting growing demand for public transit services",
        confidence: "high",
        date: "1 week ago",
      },
      {
        id: 3,
        title: "Social Media: Public Transit Discussions",
        source: "Social Media Monitoring",
        type: "social",
        insight: "Positive sentiment (68%) about potential transit expansion, with concerns about tax implications",
        confidence: "medium",
        date: "5 days ago",
      },
    ],
    "What are residents saying about the new bike lanes?": [
      {
        id: 1,
        title: "Bike Lane Implementation Feedback",
        source: "Community Feedback Portal",
        type: "survey",
        insight:
          "Mixed reception to new bike lanes with 58% positive sentiment, primarily from younger residents and commuters",
        confidence: "high",
        date: "1 day ago",
      },
      {
        id: 2,
        title: "Social Media: Bike Lane Discussions",
        source: "Social Media Monitoring",
        type: "social",
        insight:
          "Significant conversation volume with safety improvements praised, but concerns about traffic congestion",
        confidence: "medium",
        date: "3 days ago",
      },
      {
        id: 3,
        title: "311 Reports: Bike Lane Related",
        source: "311 System",
        type: "service",
        insight: "27 reports related to bike lane implementation, primarily requesting additional signage and markings",
        confidence: "high",
        date: "1 week ago",
      },
    ],
    "How effective was our last community engagement campaign?": [
      {
        id: 1,
        title: "Community Engagement Campaign Analysis",
        source: "Campaign Metrics Dashboard",
        type: "survey",
        insight: "Last campaign reached 34% of target population, a 12% improvement over previous campaigns",
        confidence: "high",
        date: "5 days ago",
      },
      {
        id: 2,
        title: "Demographic Participation Breakdown",
        source: "Engagement Analytics",
        type: "service",
        insight: "Underrepresentation of 18-25 age group (only 8% participation) despite targeted outreach efforts",
        confidence: "high",
        date: "1 week ago",
      },
      {
        id: 3,
        title: "Social Media Campaign Impact",
        source: "Social Media Monitoring",
        type: "social",
        insight: "Campaign hashtag reached 15,000+ impressions with 22% engagement rate, exceeding benchmarks",
        confidence: "medium",
        date: "3 days ago",
      },
    ],
  }

  const handleSearch = () => {
    if (query.trim()) {
      setHasSearched(true)
      // Set the appropriate results based on the query
      if (query in allSearchResults) {
        setCurrentResults(allSearchResults[query as keyof typeof allSearchResults])
      } else {
        setCurrentResults(allSearchResults.default)
      }
    }
  }

  const handleExampleQuery = (exampleQuery: string) => {
    setQuery(exampleQuery)
    // Don't set hasSearched to true here - only populate the input
  }

  const handleCreateQuickSurvey = () => {
    if (onSectionChange) {
      // Extract the main topic from the query
      let topic = "General"

      if (query.includes("transportation") || query.includes("transit")) {
        topic = "Transportation"
      } else if (query.includes("bike")) {
        topic = "Bike Lanes"
      } else if (query.includes("engagement") || query.includes("campaign")) {
        topic = "Community Engagement"
      } else if (query.includes("park")) {
        topic = "Parks"
      } else if (query.includes("safety") || query.includes("police")) {
        topic = "Public Safety"
      } else if (query.includes("housing")) {
        topic = "Housing"
      } else if (query.includes("health")) {
        topic = "Health"
      }

      // Create contextual template names
      const templateNames = {
        "quick-pulse": `Quick Pulse on ${topic}`,
        "mini-survey": `Mini Survey: ${topic}`,
        "custom-survey": "Custom Survey",
      }

      // Navigate to survey manager with template modal open and filtered
      onSectionChange("survey-builder", {
        showTemplateModal: true,
        templateFilter: ["quick-pulse", "mini-survey", "custom-survey"],
        templateNames: templateNames,
        surveyTitle: query || `${topic} Survey`,
      })
    }
  }

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="Research Assistance"
        description="Get data-driven insights to support your decision-making process"
        breadcrumbItems={breadcrumbItems}
      />

      {/* Main Content */}
      <div className="mt-8">
        {/* Search Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What decision are you preparing for?</h2>
          <p className="text-gray-600 mb-6">Get data-driven insights to support your decision-making process</p>

          {/* Search Input */}
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Ask about any civic issue or decision..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
              <Search className="w-4 h-4 mr-2" />
              Research
            </Button>
          </div>

          {/* Example Queries */}
          {!hasSearched && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Zencity AI found a few important issues that require your attention:
              </p>
              <div className="space-y-2">
                {exampleQueries.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() => handleExampleQuery(example)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-[#3BD1BB]" />
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="max-w-4xl mx-auto space-y-6 mt-8">
            {/* Research Quality Indicator */}
            <Card className="border-[#3BD1BB]/20 bg-[#3BD1BB]/5">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-[#3BD1BB] mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Enhance Your Decision</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      To gain more comprehensive insights on this topic, consider gathering additional community input
                      through a targeted survey.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#3BD1BB] text-[#3BD1BB] hover:bg-[#3BD1BB]/10"
                      onClick={handleCreateQuickSurvey}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Create Quick Survey
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Relevant Insights</h2>
              <div className="space-y-4">
                {currentResults.map((result) => (
                  <Card key={result.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            {result.type === "survey" && <BarChart3 className="w-4 h-4 text-[#3BD1BB]" />}
                            {result.type === "social" && <MessageSquare className="w-4 h-4 text-[#3BD1BB]" />}
                            {result.type === "service" && <Users className="w-4 h-4 text-[#3BD1BB]" />}
                            <h3 className="font-semibold">{result.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              result.confidence === "high" ? "bg-[#3BD1BB] text-white" : "bg-gray-200 text-gray-800"
                            }
                          >
                            {result.confidence} confidence
                          </Badge>
                          <span className="text-xs text-gray-500">{result.date}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{result.insight}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Source: {result.source}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#3BD1BB] text-[#3BD1BB] hover:bg-[#3BD1BB]/10"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Complete Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <Card className="border-[#3BD1BB]/20 bg-[#3BD1BB]/5">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Lightbulb className="w-5 h-5 mr-2 text-[#3BD1BB]" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700">
                  {query.includes("transportation") || query.includes("transit") ? (
                    <>
                      <p>
                        • <strong>Strong community support</strong> for public transit funding based on survey data
                      </p>
                      <p>
                        • <strong>Focus on reliability improvements</strong> to address 311 service requests
                      </p>
                      <p>
                        • <strong>Consider pilot program</strong> for high-demand routes before full expansion
                      </p>
                      <p>
                        • <strong>Engage younger demographics</strong> who show highest support levels
                      </p>
                    </>
                  ) : query.includes("bike") ? (
                    <>
                      <p>
                        • <strong>Address traffic concerns</strong> with improved signage and public education
                      </p>
                      <p>
                        • <strong>Highlight safety benefits</strong> in communications about bike lanes
                      </p>
                      <p>
                        • <strong>Consider targeted improvements</strong> based on 311 reports
                      </p>
                      <p>
                        • <strong>Engage with both cyclists and drivers</strong> for balanced feedback
                      </p>
                    </>
                  ) : query.includes("engagement") || query.includes("campaign") ? (
                    <>
                      <p>
                        • <strong>Develop targeted strategy</strong> to increase participation among 18-25 age group
                      </p>
                      <p>
                        • <strong>Build on social media success</strong> with expanded digital engagement
                      </p>
                      <p>
                        • <strong>Implement feedback mechanisms</strong> to measure campaign effectiveness
                      </p>
                      <p>
                        • <strong>Consider multi-channel approach</strong> to reach diverse demographics
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        • <strong>Strong community support</strong> for public transit funding based on survey data
                      </p>
                      <p>
                        • <strong>Focus on reliability improvements</strong> to address 311 service requests
                      </p>
                      <p>
                        • <strong>Consider pilot program</strong> for high-demand routes before full expansion
                      </p>
                      <p>
                        • <strong>Engage younger demographics</strong> who show highest support levels
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
