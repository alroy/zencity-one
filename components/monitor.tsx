"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageCircle,
  ExternalLink,
  Eye,
  BarChart3,
  ChevronRight,
  CheckCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SurveyCard } from "@/components/survey-card"

interface MonitorProps {
  onSectionChange?: (section: string) => void
}

// Define team data type
interface TeamData {
  id: string
  name: string
  activeSurveys: number
  totalResponses: number
  sourcesMonitored: number
  trendingTopics: number
  members: number
  responseRate: number
}

export function Monitor({ onSectionChange }: MonitorProps) {
  // Add state for selected team
  const [selectedTeam, setSelectedTeam] = useState<string>("all")

  const breadcrumbItems = [
    { label: "City Explorer", path: "city-explorer", isClickable: false },
    { label: "Monitor", isCurrent: true },
  ]

  // Define team data
  const teamsData: Record<string, TeamData> = {
    all: {
      id: "all",
      name: "All Departments",
      activeSurveys: 2,
      totalResponses: 1470,
      sourcesMonitored: 56,
      trendingTopics: 3,
      members: 12,
      responseRate: 68,
    },
    cityManagement: {
      id: "cityManagement",
      name: "City Management",
      activeSurveys: 1,
      totalResponses: 847,
      sourcesMonitored: 32,
      trendingTopics: 2,
      members: 5,
      responseRate: 72,
    },
    parksRecreation: {
      id: "parksRecreation",
      name: "Parks & Recreation",
      activeSurveys: 1,
      totalResponses: 623,
      sourcesMonitored: 18,
      trendingTopics: 1,
      members: 4,
      responseRate: 65,
    },
    publicSafety: {
      id: "publicSafety",
      name: "Public Safety",
      activeSurveys: 0,
      totalResponses: 0,
      sourcesMonitored: 24,
      trendingTopics: 1,
      members: 3,
      responseRate: 0,
    },
  }

  // Get current team data
  const currentTeamData = teamsData[selectedTeam]

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
        {
          name: "Pedestrian Safety",
          count: 156,
          quotes: [
            "The new bike lanes have made my commute so much safer. I appreciate the city's investment in cycling infrastructure.",
            "I've noticed more people cycling since the bike lanes were installed. It's great to see the community embracing this change.",
            "The protected bike lanes make me feel much more comfortable riding with my children.",
          ],
        },
        {
          name: "Business Support",
          count: 132,
          quotes: [
            "The small business grant program has been a lifeline for my downtown shop during construction.",
            "I appreciate the city's efforts to promote local businesses through the 'Shop Downtown' campaign.",
            "The reduced permit fees for outdoor seating have helped restaurants like mine stay profitable during the transition.",
          ],
        },
        {
          name: "Public Spaces",
          count: 98,
          quotes: [
            "The new central plaza is a wonderful gathering space for the community.",
            "I love the additional green spaces that have been incorporated into the downtown design.",
            "The public art installations have added so much character to our downtown area.",
          ],
        },
        {
          name: "Parking",
          count: 87,
          quotes: [
            "We need more parking options downtown, especially during peak hours.",
            "The new parking garage has helped, but it's often full by mid-morning.",
            "I'd like to see more affordable parking options for those who work downtown all day.",
          ],
        },
        {
          name: "Lighting",
          count: 76,
          quotes: [
            "The improved street lighting has made downtown feel much safer at night.",
            "I appreciate the energy-efficient LED lights that have been installed throughout the area.",
            "The decorative lighting adds a nice ambiance to the evening shopping experience.",
          ],
        },
        {
          name: "Accessibility",
          count: 65,
          quotes: [
            "The wider sidewalks and curb cuts have made downtown much more accessible for my wheelchair.",
            "I appreciate the audible crosswalk signals that have been installed at major intersections.",
            "The tactile paving helps me navigate downtown independently with my visual impairment.",
          ],
        },
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
      team: "cityManagement",
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
        {
          name: "Playground Equipment",
          count: 143,
          quotes: [
            "The playground equipment at Central Park is outdated and needs to be replaced with more inclusive options.",
            "My children love the new climbing structures at Riverside Park.",
            "We need more playground equipment suitable for toddlers and very young children.",
          ],
        },
        {
          name: "Trail Maintenance",
          count: 127,
          quotes: [
            "The mountain biking trails need better maintenance, especially after rainstorms.",
            "I appreciate the recent improvements to the hiking trail markers.",
            "The boardwalk sections of the wetland trail need repairs in several places.",
          ],
        },
        {
          name: "Sports Facilities",
          count: 112,
          quotes: [
            "We need more pickleball courts to accommodate the growing interest in the sport.",
            "The tennis courts at Community Park need resurfacing.",
            "I'd like to see more covered areas near the sports fields for spectators.",
          ],
        },
        {
          name: "Park Safety",
          count: 98,
          quotes: [
            "The improved lighting at Sunset Park has made evening walks feel much safer.",
            "We need more emergency call boxes along the more remote sections of trails.",
            "The increased ranger patrols have been noticeable and appreciated.",
          ],
        },
        {
          name: "Accessibility",
          count: 87,
          quotes: [
            "More parks need accessible pathways to reach all amenities.",
            "The new adaptive playground equipment at Central Park is wonderful for children of all abilities.",
            "I appreciate the efforts to make our natural areas more accessible with improved trails.",
          ],
        },
        {
          name: "Community Events",
          count: 76,
          quotes: [
            "I'd love to see more community events in our parks, like outdoor concerts and movies.",
            "The farmers market in the park has been a great addition to our community.",
            "More family-friendly events would help bring the community together.",
          ],
        },
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
      team: "parksRecreation",
    },
  ]

  // Filter active surveys based on selected team
  const filteredSurveys =
    selectedTeam === "all" ? activeSurveys : activeSurveys.filter((survey) => survey.team === selectedTeam)

  const trendingTopics = [
    {
      id: 1,
      topic: "Traffic congestion on Main Street",
      sentiment: "negative",
      sources: 23,
      trend: "up",
      insight: "Residents expressing frustration about increased commute times during construction",
      team: "cityManagement",
    },
    {
      id: 2,
      topic: "New community center opening",
      sentiment: "positive",
      sources: 18,
      trend: "up",
      insight: "High anticipation and positive feedback about upcoming facility",
      team: "parksRecreation",
    },
    {
      id: 3,
      topic: "Winter road maintenance",
      sentiment: "mixed",
      sources: 15,
      trend: "down",
      insight: "Mixed reactions to snow removal response times",
      team: "publicSafety",
    },
  ]

  // Filter trending topics based on selected team
  const filteredTrendingTopics =
    selectedTeam === "all" ? trendingTopics : trendingTopics.filter((topic) => topic.team === selectedTeam)

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

      {/* Top Teams Section */}
      <div className="mt-8 mb-6">
        <h2 className="text-lg font-semibold mb-3">Top Departments</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.values(teamsData).map((team) => (
            <Card
              key={team.id}
              className={`cursor-pointer transition-all ${
                selectedTeam === team.id ? "border-[#3BD1BB] ring-1 ring-[#3BD1BB]/50" : "hover:border-[#3BD1BB]/50"
              }`}
              onClick={() => setSelectedTeam(team.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{team.name}</h3>
                  {selectedTeam === team.id && <CheckCircle className="h-4 w-4 text-[#3BD1BB]" />}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{team.members} members</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Overview - Now dynamically updated based on selected team */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Surveys</p>
                <p className="text-2xl font-bold">{currentTeamData.activeSurveys}</p>
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
                <p className="text-2xl font-bold">{currentTeamData.totalResponses}</p>
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
                <p className="text-2xl font-bold">{currentTeamData.sourcesMonitored}</p>
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
                <p className="text-2xl font-bold">{currentTeamData.trendingTopics}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#3BD1BB]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Engagement at a Glance - Redesigned */}
      <div className="mt-8 mb-6 bg-white border rounded-lg p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#3BD1BB]" />
            <h2 className="text-xl font-semibold text-gray-900">Community Engagement at a Glance</h2>
          </div>

          <p className="text-sm text-gray-600">
            Synthesized from resident feedback submitted via multiple engagement methods over the past month
          </p>

          {/* Content Sections */}
          <div className="space-y-6 mt-6">
            {/* Positive Sentiment */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Positive Sentiment</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedTeam === "cityManagement"
                    ? "City Management team has received positive feedback on downtown revitalization efforts. Residents appreciate the improved walkability and new business opportunities, though concerns about parking remain."
                    : selectedTeam === "parksRecreation"
                      ? "Parks & Recreation team has gathered valuable feedback on facility improvements. Residents are particularly enthusiastic about playground upgrades and trail maintenance."
                      : selectedTeam === "publicSafety"
                        ? "Public Safety team is monitoring community concerns about winter road maintenance and emergency response times. Feedback is mixed, with residents acknowledging efforts but requesting more consistent service."
                        : "Residents praise Adams County's small-town charm within a metro area, strong civic engagement, and easy highway access. They celebrate our cultural diversity, French heritage, clean image, and community events like Adams Days."}
                </p>
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedTeam === "cityManagement"
                    ? "Some residents have expressed concerns about parking availability downtown and the impact of construction on local businesses during the revitalization process."
                    : selectedTeam === "parksRecreation"
                      ? "Residents have noted the need for more accessible playground equipment and better maintenance of remote trail sections, particularly after weather events."
                      : selectedTeam === "publicSafety"
                        ? "Community members have requested more consistent snow removal schedules and improved communication about emergency response protocols."
                        : "Some residents noted concerns about a fading uniqueness as the area develops, and expressed interest in more diverse dining options and improved public transportation."}
                </p>
              </div>
            </div>

            {/* Sentiment Breakdown */}
            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">Positive (68%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-700">Neutral (22%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-700">Negative (10%)</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              className="border-[#3BD1BB] text-[#3BD1BB] hover:bg-[#3BD1BB]/10"
              onClick={() => onSectionChange && onSectionChange("citizen-participation")}
            >
              View full participation stats
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Running Surveys */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Running Surveys {selectedTeam !== "all" && `- ${teamsData[selectedTeam].name}`}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => onSectionChange && onSectionChange("survey-builder")}>
            <Eye className="w-4 h-4 mr-2" />
            Show All Surveys
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => <SurveyCard key={survey.id} {...survey} />)
          ) : (
            <div className="text-center py-8 text-gray-500">No active surveys for this team</div>
          )}
        </CardContent>
      </Card>

      {/* Trending Conversations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Trending Conversations {selectedTeam !== "all" && `- ${teamsData[selectedTeam].name}`}</CardTitle>
          <p className="text-sm text-gray-600">Sentiment analysis from social media channels</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTrendingTopics.length > 0 ? (
            filteredTrendingTopics.map((topic) => (
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No trending topics for this team</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
