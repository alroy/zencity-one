"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, MessageCircle, ExternalLink, Eye, BarChart3 } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export function Monitor() {
  const breadcrumbItems = [
    { label: "City Explorer", path: "city-explorer", isClickable: false },
    { label: "Monitor", isCurrent: true },
  ]

  const activeSurveys = [
    {
      id: 1,
      name: "Downtown Revitalization Survey",
      responses: 847,
      target: 1200,
      demographics: {
        age: { "18-34": 32, "35-54": 45, "55+": 23 },
        ethnicity: { White: 58, Hispanic: 25, Black: 12, Other: 5 },
        gender: { Female: 54, Male: 43, Other: 3 },
      },
    },
    {
      id: 2,
      name: "Parks & Recreation Needs Assessment",
      responses: 623,
      target: 800,
      demographics: {
        age: { "18-34": 28, "35-54": 52, "55+": 20 },
        ethnicity: { White: 62, Hispanic: 22, Black: 10, Other: 6 },
        gender: { Female: 58, Male: 39, Other: 3 },
      },
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

      {/* Active Surveys - Now displayed side by side */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Running Surveys</CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Show Details
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSurveys.map((survey) => (
              <div key={survey.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{survey.name}</h3>
                  <Badge variant="secondary">
                    {survey.responses}/{survey.target} responses
                  </Badge>
                </div>

                {/* Updated progress bar color */}
                <Progress
                  value={(survey.responses / survey.target) * 100}
                  className="mb-4 bg-gray-100"
                  indicatorClassName="bg-[#3BD1BB]"
                />

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Age Distribution</p>
                    {Object.entries(survey.demographics.age).map(([age, percent]) => (
                      <div key={age} className="flex justify-between">
                        <span>{age}</span>
                        <span>{percent}%</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="font-medium mb-2">Ethnicity</p>
                    {Object.entries(survey.demographics.ethnicity).map(([ethnicity, percent]) => (
                      <div key={ethnicity} className="flex justify-between">
                        <span>{ethnicity}</span>
                        <span>{percent}%</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="font-medium mb-2">Gender</p>
                    {Object.entries(survey.demographics.gender).map(([gender, percent]) => (
                      <div key={gender} className="flex justify-between">
                        <span>{gender}</span>
                        <span>{percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
