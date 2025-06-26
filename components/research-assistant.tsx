"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, BarChart3, Users, ExternalLink, Lightbulb } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { ClarifyingSurveyModal, type ClarifyingFormData } from "@/components/clarifying-survey-modal"
import { SurveyPreviewModal, type GeneratedSurveyData } from "@/components/survey-preview-modal"
import type { Question } from "@/components/questionnaire-builder"

interface ResearchAssistantProps {
  onSectionChange?: (section: string, options?: any) => void
}

export function ResearchAssistant({ onSectionChange }: ResearchAssistantProps) {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [currentResults, setCurrentResults] = useState<typeof allSearchResults.default>([])
  const [showClarifyingModal, setShowClarifyingModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [clarifyingQuery, setClarifyingQuery] = useState("")
  const [generatedSurveyData, setGeneratedSurveyData] = useState<GeneratedSurveyData | undefined>(undefined)

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
    if (query.trim()) {
      setClarifyingQuery(query) // Set the query for the clarifying modal
      setShowClarifyingModal(true)
    } else {
      // Optionally, prompt user to enter a query first or use a default
      setClarifyingQuery("General Community Feedback")
      setShowClarifyingModal(true)
    }
  }

  const handleClarifyingModalSubmit = (formData: ClarifyingFormData) => {
    // Simulate API call and survey generation
    const { intent, audience, tags, originalQuery } = formData

    // --- Start of new title and goal generation logic ---
    let topic = "General Topic" // Default topic
    const lowerQuery = originalQuery.toLowerCase()

    if (lowerQuery.includes("transportation") || lowerQuery.includes("transit")) {
      topic = "Public Transit"
    } else if (lowerQuery.includes("bike lanes") || lowerQuery.includes("bike")) {
      topic = "Bike Lanes"
    } else if (lowerQuery.includes("community engagement") || lowerQuery.includes("campaign")) {
      topic = "Community Engagement"
    } else if (lowerQuery.includes("park")) {
      topic = "Parks"
    } else if (lowerQuery.includes("safety") || lowerQuery.includes("police")) {
      topic = "Public Safety"
    } else if (lowerQuery.includes("housing")) {
      topic = "Housing"
    } else if (lowerQuery.includes("health")) {
      topic = "Public Health"
    } else if (tags.length > 0) {
      // Fallback to the first tag if no keyword match
      const firstTag = tags[0]
      topic = firstTag.charAt(0).toUpperCase() + firstTag.slice(1) // Capitalize first tag
    } else {
      // Fallback for very generic queries with no tags
      const words = originalQuery.split(" ")
      if (words.length > 2 && words.length <= 4) {
        // Use 1-2 words if query is short-ish
        topic = words
          .slice(0, 2)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      } else if (words.length > 0) {
        topic = words[0].charAt(0).toUpperCase() + words[0].slice(1) // First word capitalized
      } else {
        topic = "Community" // Absolute fallback
      }
    }

    let intentKeyword = ""
    switch (intent) {
      case "Priority Tradeoff":
        intentKeyword = "Priorities"
        break
      case "Budget Allocation Preferences":
        intentKeyword = "Budget"
        break
      case "General Feedback":
        intentKeyword = "Feedback"
        break
      case "Sentiment Analysis":
        intentKeyword = "Sentiment"
        break
      default:
        intentKeyword = ""
    }

    let generatedTitle = topic
    if (intentKeyword) {
      generatedTitle += ` ${intentKeyword}`
    }
    generatedTitle += " Survey"

    // Ensure title is concise (aim for 3-4 words)
    const titleWords = generatedTitle.split(" ")
    if (titleWords.length > 4) {
      // If topic + intentKeyword + "Survey" is too long, try topic + "Survey"
      const shorterTitle = `${topic} Survey`
      const shorterTitleWords = shorterTitle.split(" ")
      if (shorterTitleWords.length <= 4 && shorterTitleWords.length >= 2) {
        generatedTitle = shorterTitle
      } else {
        // If topic itself is long (e.g., "Community Engagement"), just use that + "Survey"
        // Or if topic is short, and intent made it long, this is a fallback.
        // If topic was like "Public Safety" (2 words), "Public Safety Survey" is 3 words.
        // If topic was "Community Engagement" (2 words), "Community Engagement Survey" is 3 words.
        // If topic was "Some Very Long Topic Name From Tag" (6 words), this won't shorten it enough.
        // So, if topic is more than 2 words, shorten topic.
        const topicWords = topic.split(" ")
        if (topicWords.length > 2) {
          const shortTopic = topicWords.slice(0, 2).join(" ")
          generatedTitle = `${shortTopic} Survey`
        } else {
          generatedTitle = `${topic} Survey` // Default to topic + Survey if other attempts are too long or short
        }
      }
    }
    // Final check: if title is just "Survey" or one word + "Survey"
    if (generatedTitle.split(" ").length < 2 && topic !== "General Topic") {
      generatedTitle = `${topic} Survey`
    } else if (generatedTitle.split(" ").length < 2) {
      generatedTitle = "Community Feedback Survey" // A sensible default
    }

    const generatedGoal = `To understand ${intent.toLowerCase()} regarding "${originalQuery}" from the ${audience.replace("-", " ")} audience. This survey focuses on ${topic.toLowerCase()}.`
    // --- End of new title and goal generation logic ---

    const sampleQuestions: Question[] = [
      {
        id: "gen_q1",
        type: "rating",
        text: `On a scale of 1-5, how important is the issue of "${originalQuery}" to you?`,
        options: [
          { value: "1", label: "1 - Not important at all" },
          { value: "2", label: "2" },
          { value: "3", label: "3 - Neutral" },
          { value: "4", label: "4" },
          { value: "5", label: "5 - Extremely important" },
        ],
        label: "1",
        labelType: "number",
      },
      {
        id: "gen_q2",
        type: "open-ended",
        text: `What are your primary concerns or suggestions related to "${originalQuery}"?`,
        label: "2",
        labelType: "number",
      },
    ]

    if (intent === "Priority Tradeoff") {
      sampleQuestions.push({
        id: "gen_q3_tradeoff",
        type: "multiple-choice",
        text: `If resources were limited, which aspect of "${originalQuery}" should be prioritized? (Select one)`,
        options: [
          { value: "option1", label: "Aspect A (e.g., Funding)" },
          { value: "option2", label: "Aspect B (e.g., Awareness)" },
          { value: "option3", label: "Aspect C (e.g., Infrastructure)" },
        ],
        label: "3",
        labelType: "number",
      })
    } else if (intent === "Budget Allocation Preferences") {
      sampleQuestions.push({
        id: "gen_q3_budget",
        type: "multiple-choice",
        text: `How would you prefer budget to be allocated for "${originalQuery}"?`,
        options: [
          { value: "increase", label: "Increase significantly" },
          { value: "maintain", label: "Maintain current levels" },
          { value: "decrease", label: "Decrease slightly" },
        ],
        label: "3",
        labelType: "number",
      })
    } else {
      sampleQuestions.push({
        id: "gen_q3_general",
        type: "multiple-choice",
        text: `Which of the following best describes your opinion on "${originalQuery}"?`,
        options: [
          { value: "positive", label: "Very Positive" },
          { value: "neutral", label: "Neutral" },
          { value: "negative", label: "Very Negative" },
        ],
        label: "3",
        labelType: "number",
      })
    }
    sampleQuestions.push({
      id: "completion_generated",
      type: "completion",
      title: "Thank You!",
      completionText: "Your feedback is valuable to us.",
      label: "C",
      labelType: "char",
    })

    const surveyData: GeneratedSurveyData = {
      title: generatedTitle,
      goal: generatedGoal,
      distributionMethod: audience, // Use the audience value directly
      questions: sampleQuestions,
      originalQuery: formData.originalQuery,
      clarifyingFormData: formData,
    }

    setGeneratedSurveyData(surveyData)
    setShowClarifyingModal(false)
    setShowPreviewModal(true)
  }

  const handleOpenBuilderFromPreview = () => {
    if (generatedSurveyData && onSectionChange) {
      onSectionChange("survey-builder", {
        generatedSurvey: generatedSurveyData,
      })
      setShowPreviewModal(false)
      setGeneratedSurveyData(undefined) // Clear data after use
      setHasSearched(false) // Reset search state
      setQuery("") // Clear search query
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

      <ClarifyingSurveyModal
        open={showClarifyingModal}
        onClose={() => setShowClarifyingModal(false)}
        onSubmit={handleClarifyingModalSubmit}
        initialQuery={clarifyingQuery}
      />
      <SurveyPreviewModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        surveyData={generatedSurveyData}
        onOpenBuilder={handleOpenBuilderFromPreview}
      />
    </div>
  )
}
