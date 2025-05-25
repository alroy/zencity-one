"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, MessageCircle, ExternalLink, Eye, BarChart3 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SurveyCard } from "@/components/survey-card"

export function Monitor() {
  const breadcrumbItems = [
    { label: "City Explorer", path: "city-explorer", isClickable: false },
    { label: "Monitor", isCurrent: true },
  ]

  // Enhanced survey data with additional metrics
  const activeSurveys = [
    {
      id: 1,
      name: "Downtown Revitalization Survey",
      responses: 847,
      target: 1200,
      avgRating: 4.2,
      estimatedDaysToTarget: 6,
      sentiment: {
        positive: 0.65,
        negative: 0.15,
        neutral: 0.2,
      },
      topThemes: [
        { name: "Pedestrian Safety", count: 156 },
        { name: "Business Support", count: 132 },
        { name: "Public Spaces", count: 98 },
        { name: "Parking", count: 87 },
        { name: "Lighting", count: 76 },
        { name: "Accessibility", count: 65 },
      ],
      demographics: {
        age: [
          { name: "18-34", current: 271, target: 400, percentage: 68 },
          { name: "35-54", current: 381, target: 400, percentage: 95 },
          { name: "55+", current: 195, target: 400, percentage: 49 },
        ],
        gender: [
          { name: "Female", current: 457, target: 600, percentage: 76 },
          { name: "Male", current: 364, target: 600, percentage: 61 },
          { name: "Other", current: 26, target: 0, percentage: 100 },
        ],
        ethnicity: [
          { name: "White", current: 491, target: 600, percentage: 82 },
          { name: "Hispanic", current: 212, target: 300, percentage: 71 },
          { name: "Black", current: 102, target: 180, percentage: 57 },
          { name: "Asian", current: 42, target: 120, percentage: 35 },
        ],
        other: [
          { name: "Homeowner", current: 423, target: 500, percentage: 85 },
          { name: "Renter", current: 424, target: 700, percentage: 61 },
        ],
      },
      trends: {
        responseRate: [
          { date: "May 19", value: 42 },
          { date: "May 20", value: 38 },
          { date: "May 21", value: 56 },
          { date: "May 22", value: 61 },
          { date: "May 23", value: 47 },
          { date: "May 24", value: 52 },
          { date: "May 25", value: 59 },
        ],
        completionTime: [
          { date: "May 19", value: 8.2 },
          { date: "May 20", value: 7.9 },
          { date: "May 21", value: 8.1 },
          { date: "May 22", value: 7.6 },
          { date: "May 23", value: 7.8 },
          { date: "May 24", value: 7.5 },
          { date: "May 25", value: 7.3 },
        ],
      },
      quotasBelowTarget: 2,
    },
    {
      id: 2,
      name: "Parks & Recreation Needs Assessment",
      responses: 623,
      target: 800,
      avgRating: 3.8,
      estimatedDaysToTarget: 9,
      sentiment: {
        positive: 0.58,
        negative: 0.22,
        neutral: 0.2,
      },
      topThemes: [
        { name: "Playground Equipment", count: 143 },
        { name: "Trail Maintenance", count: 127 },
        { name: "Sports Facilities", count: 112 },
        { name: "Park Safety", count: 98 },
        { name: "Accessibility", count: 87 },
        { name: "Community Events", count: 76 },
      ],
      demographics: {
        age: [
          { name: "18-34", current: 174, target: 250, percentage: 70 },
          { name: "35-54", current: 324, target: 350, percentage: 93 },
          { name: "55+", current: 125, target: 200, percentage: 63 },
        ],
        gender: [
          { name: "Female", current: 361, target: 400, percentage: 90 },
          { name: "Male", current: 243, target: 400, percentage: 61 },
          { name: "Other", current: 19, target: 0, percentage: 100 },
        ],
        ethnicity: [
          { name: "White", current: 386, target: 400, percentage: 97 },
          { name: "Hispanic", current: 137, target: 200, percentage: 69 },
          { name: "Black", current: 62, target: 120, percentage: 52 },
          { name: "Asian", current: 38, target: 80, percentage: 48 },
        ],
        other: [
          { name: "Parents", current: 312, target: 400, percentage: 78 },
          { name: "Non-Parents", current: 311, target: 400, percentage: 78 },
        ],
      },
      trends: {
        responseRate: [
          { date: "May 19", value: 32 },
          { date: "May 20", value: 28 },
          { date: "May 21", value: 35 },
          { date: "May 22", value: 42 },
          { date: "May 23", value: 38 },
          { date: "May 24", value: 41 },
          { date: "May 25", value: 45 },
        ],
        completionTime: [
          { date: "May 19", value: 9.1 },
          { date: "May 20", value: 8.7 },
          { date: "May 21", value: 8.9 },
          { date: "May 22", value: 8.5 },
          { date: "May 23", value: 8.3 },
          { date: "May 24", value: 8.2 },
          { date: "May 25", value: 8.0 },
        ],
      },
      quotasBelowTarget: 3,
    },
  ]

  const trendingTopics = [
    {
      id: 1,
      topic: "Traffic congestion on Main Street",
      sentiment: "negative",
      sources: 23,
      trend: "up",
      insight: "Residents expressing frustration about increased commute times during construction",
    },
    {
      id: 2,
      topic: "New community center opening",
      sentiment: "positive",
      sources: 18,
      trend: "up",
      insight: "High anticipation and positive feedback about upcoming facility",
    },
    {
      id: 3,
      topic: "Winter road maintenance",
      sentiment: "mixed",
      sources: 15,
      trend: "down",
      insight: "Mixed reactions to snow removal response times",
    },
  ]

  // Custom function to get sentiment badge with new colors
  const getSentimentBadge = (sentiment: string) => {
    const sentimentConfig = {
      positive: { className: "bg-[#3BD1BB] text-white" },
      negative: { className: "bg-[#FC7753] text-white" },
      mixed: { className: "bg-gray-200 text-gray-800" },
    }

    const config = sentimentConfig[sentiment as keyof typeof sentimentConfig]
    return <Badge className={config.className}>{sentiment}</Badge>
  }

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="Monitor"
        description="Real-time insights from your community"
        breadcrumbItems={breadcrumbItems}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Surveys</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <BarChart3 className="w-8 h-8 text-[#3BD1BB]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold">1,470</p>
              </div>
              <Users className="w-8 h-8 text-[#3BD1BB]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sources Monitored</p>
                <p className="text-2xl font-bold">56</p>
              </div>
              <MessageCircle className="w-8 h-8 text-[#3BD1BB]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trending Topics</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#3BD1BB]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Running Surveys */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Running Surveys</CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Show All Surveys
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {activeSurveys.map((survey) => (
            <SurveyCard key={survey.id} {...survey} />
          ))}
        </CardContent>
      </Card>

      {/* Trending Conversations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Trending Conversations</CardTitle>
          <p className="text-sm text-gray-600">Sentiment analysis from social media channels</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{topic.topic}</h3>
                <div className="flex items-center space-x-2">
                  {getSentimentBadge(topic.sentiment)}
                  {topic.trend === "up" ? (
                    <TrendingUp
                      className={`w-4 h-4 ${topic.sentiment === "positive" ? "text-[#3BD1BB]" : "text-[#FC7753]"}`}
                    />
                  ) : (
                    <TrendingDown
                      className={`w-4 h-4 ${topic.sentiment === "negative" ? "text-[#3BD1BB]" : "text-[#FC7753]"}`}
                    />
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{topic.insight}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{topic.sources} sources</span>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Sources
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
