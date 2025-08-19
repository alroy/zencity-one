"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Download,
  ChevronRight,
  ChevronLeft,
  Activity,
  Target,
  Heart,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CompStatDashboardProps {
  onSectionChange?: (section: string) => void
}

// Mock data structure as specified
const mockData = {
  currentDivision: "Southwest",
  lastUpdated: new Date(),
  kpis: {
    crimeRate: { current: 372, previous: 423, change: -12 },
    clearanceRate: { current: 68, change: 3 },
    responseTime: { current: 6.2, change: -0.3 },
    trustScore: { current: 72, change: 3 },
  },
  operationalMetrics: {
    partICrimes: { current: 372, previous: 423 },
    arrests: { current: 202, previous: 187 },
    citations: { current: 847, previous: 892 },
    callsForService: 3241,
    officerHours: 12450,
  },
  communityMetrics: {
    trust: { value: 72, change: 3, trend: "up" },
    fairness: { value: 68, change: 1, trend: "up" },
    voice: { value: 61, change: -2, trend: "down" },
    respect: { value: 74, change: 5, trend: "up" },
    safety: { value: 69, change: 0, trend: "stable" },
  },
  demographics: {
    hispanic: { trust: 61, gap: -11 },
    black: { trust: 69, gap: -3 },
    white: { trust: 78, gap: 6 },
    asian: { trust: 73, gap: 1 },
    other: { trust: 71, gap: -1 },
  },
  trustTrend: [
    { month: "Jul", overall: 65, hispanic: 52, black: 64, white: 73, asian: 68 },
    { month: "Aug", overall: 67, hispanic: 54, black: 66, white: 74, asian: 70 },
    { month: "Sep", overall: 68, hispanic: 56, black: 67, white: 75, asian: 71 },
    { month: "Oct", overall: 69, hispanic: 58, black: 68, white: 76, asian: 72 },
    { month: "Nov", overall: 69, hispanic: 58, black: 67, white: 77, asian: 72 },
    { month: "Dec", overall: 72, hispanic: 61, black: 69, white: 78, asian: 73 },
  ],
  divisions: [
    { name: "Northeast", crime: -15, trust: 78, fairness: 76, response: 5.8, status: "leading" },
    { name: "Central", crime: -8, trust: 76, fairness: 74, response: 6.1, status: "strong" },
    { name: "Southwest", crime: -12, trust: 72, fairness: 68, response: 6.2, status: "current" },
    { name: "Valley", crime: -10, trust: 74, fairness: 71, response: 5.9, status: "strong" },
    { name: "Olympic", crime: -5, trust: 69, fairness: 65, response: 6.5, status: "watch" },
    { name: "Southeast", crime: -3, trust: 67, fairness: 63, response: 6.8, status: "priority" },
  ],
}

export function CompStatDashboard({ onSectionChange }: CompStatDashboardProps) {
  const [selectedDivision, setSelectedDivision] = useState("Southwest")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const breadcrumbItems = [
    { label: "City Explorer", path: "city-explorer", isClickable: false },
    { label: "CompStat Dashboard", isCurrent: true },
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-[#3BD1BB]" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-[#FC7753]" />
    return <div className="w-4 h-4" />
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      leading: { className: "bg-[#3BD1BB] text-white", icon: "✅", label: "Leading" },
      strong: { className: "bg-blue-500 text-white", icon: "✅", label: "Strong" },
      current: { className: "bg-[#3BD1BB]/20 text-[#3BD1BB] border border-[#3BD1BB]", icon: "📊", label: "YOUR DIV" },
      watch: { className: "bg-yellow-500 text-white", icon: "⚠️", label: "Watch" },
      priority: { className: "bg-[#FC7753] text-white", icon: "🔴", label: "Priority" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge className={config.className}>
        {config.icon} {config.label}
      </Badge>
    )
  }

  const demographicData = Object.entries(mockData.demographics).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    trust: value.trust,
    gap: value.gap,
  }))

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="CompStat Performance Dashboard"
        description="Willowbrook County Police Department"
        breadcrumbItems={breadcrumbItems}
      />

      {/* Header Controls */}
      <div className="mt-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-sm text-gray-600">
            Last Updated: {formatTime(currentTime)} | Next CompStat: Thursday 2:00 PM
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedDivision} onValueChange={setSelectedDivision}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Divisions">All Divisions</SelectItem>
              <SelectItem value="Northeast">Northeast</SelectItem>
              <SelectItem value="Central">Central</SelectItem>
              <SelectItem value="Southwest">Southwest</SelectItem>
              <SelectItem value="Valley">Valley</SelectItem>
              <SelectItem value="Olympic">Olympic</SelectItem>
              <SelectItem value="Southeast">Southeast</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Dashboard Content */}
        <div className="flex-1 space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-[#FC7753] mr-2" />
                    <span className="text-sm font-medium text-gray-600">CRIME RATE</span>
                  </div>
                  {getTrendIcon(mockData.kpis.crimeRate.change)}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-[#FC7753]">{mockData.kpis.crimeRate.change}%</div>
                  <div className="text-sm text-gray-600">{mockData.kpis.crimeRate.current} incidents</div>
                  <div className="text-xs text-gray-500">This Month</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-[#3BD1BB] mr-2" />
                    <span className="text-sm font-medium text-gray-600">CLEARANCE RATE</span>
                  </div>
                  {getTrendIcon(mockData.kpis.clearanceRate.change)}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-[#3BD1BB]">{mockData.kpis.clearanceRate.current}%</div>
                  <div className="text-sm text-gray-600">↑ {mockData.kpis.clearanceRate.change}% from last</div>
                  <div className="text-xs text-gray-500">month</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">RESPONSE TIME</span>
                  </div>
                  {getTrendIcon(mockData.kpis.responseTime.change)}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-500">{mockData.kpis.responseTime.current} min</div>
                  <div className="text-sm text-gray-600">↓ {Math.abs(mockData.kpis.responseTime.change)} min</div>
                  <div className="text-xs text-gray-500">improvement</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-[#3BD1BB] mr-2" />
                    <span className="text-sm font-medium text-gray-600">TRUST SCORE</span>
                  </div>
                  {getTrendIcon(mockData.kpis.trustScore.change)}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-[#3BD1BB]">{mockData.kpis.trustScore.current}%</div>
                  <div className="text-sm text-gray-600">↑ {mockData.kpis.trustScore.change} pts</div>
                  <div className="text-xs text-gray-500">from last month</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dual Metrics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Operational Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-[#3BD1BB]" />
                  OPERATIONAL METRICS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Part I Crimes</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{mockData.operationalMetrics.partICrimes.previous} →</span>
                    <span className="font-semibold">{mockData.operationalMetrics.partICrimes.current}</span>
                    <span className="text-[#FC7753] text-sm">↓12%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Arrests Made</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{mockData.operationalMetrics.arrests.previous} →</span>
                    <span className="font-semibold">{mockData.operationalMetrics.arrests.current}</span>
                    <span className="text-[#3BD1BB] text-sm">↑8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Citations Issued</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{mockData.operationalMetrics.citations.previous} →</span>
                    <span className="font-semibold">{mockData.operationalMetrics.citations.current}</span>
                    <span className="text-[#FC7753] text-sm">↓5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Calls for Service</span>
                  <span className="font-semibold">{mockData.operationalMetrics.callsForService.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Officer Hours</span>
                  <span className="font-semibold">{mockData.operationalMetrics.officerHours.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Community Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#3BD1BB]" />
                  COMMUNITY METRICS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockData.communityMetrics).map(([key, metric]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm capitalize">{key}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{metric.value}%</span>
                        <span
                          className={`text-sm ${
                            metric.change > 0
                              ? "text-[#3BD1BB]"
                              : metric.change < 0
                                ? "text-[#FC7753]"
                                : "text-gray-500"
                          }`}
                        >
                          {metric.change > 0 ? "↑" : metric.change < 0 ? "↓" : "→"}
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#3BD1BB] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trust Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>TRUST TREND (6 MONTHS)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData.trustTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[40, 85]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#3BD1BB" strokeWidth={3} name="Overall" />
                    <Line type="monotone" dataKey="hispanic" stroke="#FC7753" strokeWidth={2} name="Hispanic" />
                    <Line type="monotone" dataKey="black" stroke="#8884d8" strokeWidth={2} name="Black" />
                    <Line type="monotone" dataKey="white" stroke="#82ca9d" strokeWidth={2} name="White" />
                    <Line type="monotone" dataKey="asian" stroke="#ffc658" strokeWidth={2} name="Asian" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Demographic Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>DEMOGRAPHIC BREAKDOWN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demographicData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{item.trust}%</span>
                          {item.gap < -5 && <AlertTriangle className="w-4 h-4 text-[#FC7753]" />}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            item.gap < -5 ? "bg-[#FC7753]" : "bg-[#3BD1BB]"
                          }`}
                          style={{ width: `${(item.trust / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 text-center">Citywide Avg: 72%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Division Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>DIVISION COMPARISON</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Division</th>
                      <th className="text-left py-2">Crime↓</th>
                      <th className="text-left py-2">Trust</th>
                      <th className="text-left py-2">Fairness</th>
                      <th className="text-left py-2">Response</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.divisions.map((division) => (
                      <tr key={division.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{division.name}</td>
                        <td className="py-3">
                          <span className="text-[#3BD1BB]">{division.crime}%</span>
                        </td>
                        <td className="py-3">{division.trust}%</td>
                        <td className="py-3">{division.fairness}%</td>
                        <td className="py-3">{division.response} min</td>
                        <td className="py-3">{getStatusBadge(division.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collapsible Sidebar */}
        {sidebarOpen && (
          <div className="w-80 space-y-4">
            {/* Intelligence Brief */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">📋 COMMANDER BRIEF</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#3BD1BB] mb-2">✅ WINS TO HIGHLIGHT</h4>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Trust up 3% after foot patrols</li>
                    <li>• Crime down 12% month-over-month</li>
                    <li>• Best respect scores in 18 months</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#FC7753] mb-2">⚠️ CHALLENGES</h4>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Hispanic trust 11pts below avg</li>
                    <li className="ml-2">→ Deploy Spanish officers</li>
                    <li>• Voice metric declining 2 months</li>
                    <li className="ml-2">→ Schedule community forum</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-600 mb-2">📊 YOUR POSITION</h4>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Rank: 3rd of 6 divisions</li>
                    <li>• Trend: 2nd fastest improving</li>
                    <li>• Gap to leader: 6 points</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Tracker */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">📌 ACCOUNTABILITY TRACKER</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">LAST MEETING COMMITMENTS:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-[#3BD1BB] mt-0.5" />
                      <div>
                        <div>Increase Crenshaw patrols</div>
                        <div className="text-gray-500">Impact: Trust +5%</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-[#3BD1BB] mt-0.5" />
                      <div>
                        <div>Youth basketball program</div>
                        <div className="text-gray-500">Impact: Under-25 trust +7%</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5" />
                      <div>
                        <div>Address Hispanic gap</div>
                        <div className="text-gray-500">Status: 3% improved, ongoing</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">NEW COMMITMENTS:</h4>
                  <div className="space-y-1 text-xs">
                    <div>□ Spanish community forum (14d)</div>
                    <div>□ Voice metric investigation</div>
                    <div>□ Share training best practices</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Correlation Insights */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">🔍 CORRELATION INSIGHTS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#3BD1BB] mb-2">WHAT'S WORKING:</h4>
                  <div className="text-xs space-y-1 text-gray-600">
                    <div>Foot Patrols → +5% trust</div>
                    <div>De-escalation → +4% respect</div>
                    <div>Youth Programs → +7% under-25</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#FC7753] mb-2">INVERSE CORRELATIONS:</h4>
                  <div className="text-xs space-y-1 text-gray-600">
                    <div>Use of Force ↑ → Trust ↓</div>
                    <div>Response Time ↑ → Satisfaction ↓</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sidebar Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 bg-transparent"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
