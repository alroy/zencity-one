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
  Phone,
  UserCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface CompStatDashboardProps {
  onSectionChange?: (section: string) => void
}

const mockDataByDivision = {
  "All Divisions": {
    currentDivision: "All Divisions",
    lastUpdated: new Date(),
    kpis: {
      crimeRate: { current: 342, previous: 398, change: -14 },
      clearanceRate: { current: 71, change: 4 },
      responseTime: { current: 6.1, change: -0.2 },
      trustScore: { current: 74, change: 2 },
    },
    operationalMetrics: {
      partICrimes: { current: 2234, previous: 2598 },
      arrests: { current: 1214, previous: 1122 },
      citations: { current: 5082, previous: 5356 },
      callsForService: 19446,
      officerHours: 74700,
    },
    operationalTrends: {
      partICrimes: [
        { month: "Aug", value: 2670 },
        { month: "Sep", value: 2598 },
        { month: "Oct", value: 2388 },
        { month: "Nov", value: 2310 },
        { month: "Dec", value: 2234 },
      ],
      arrests: [
        { month: "Aug", value: 990 },
        { month: "Sep", value: 1122 },
        { month: "Oct", value: 1164 },
        { month: "Nov", value: 1188 },
        { month: "Dec", value: 1214 },
      ],
    },
    communityMetrics: {
      trust: { value: 74, change: 2, trend: "up" },
      fairness: { value: 70, change: 1, trend: "up" },
      voice: { value: 65, change: -1, trend: "down" },
      respect: { value: 76, change: 3, trend: "up" },
      safety: { value: 71, change: 1, trend: "up" },
    },
    demographics: {
      hispanic: { trust: 63, gap: -11 },
      black: { trust: 71, gap: -3 },
      white: { trust: 80, gap: 6 },
      asian: { trust: 75, gap: 1 },
      other: { trust: 73, gap: -1 },
    },
    trustTrend: [
      { month: "Jul", overall: 67, hispanic: 54, black: 66, white: 75, asian: 70 },
      { month: "Aug", overall: 69, hispanic: 56, black: 68, white: 76, asian: 72 },
      { month: "Sep", overall: 70, hispanic: 58, black: 69, white: 77, asian: 73 },
      { month: "Oct", overall: 71, hispanic: 60, black: 70, white: 78, asian: 74 },
      { month: "Nov", overall: 72, hispanic: 61, black: 70, white: 79, asian: 74 },
      { month: "Dec", overall: 74, hispanic: 63, black: 71, white: 80, asian: 75 },
    ],
  },
  Southwest: {
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
    operationalTrends: {
      partICrimes: [
        { month: "Aug", value: 445 },
        { month: "Sep", value: 423 },
        { month: "Oct", value: 398 },
        { month: "Nov", value: 385 },
        { month: "Dec", value: 372 },
      ],
      arrests: [
        { month: "Aug", value: 165 },
        { month: "Sep", value: 187 },
        { month: "Oct", value: 194 },
        { month: "Nov", value: 198 },
        { month: "Dec", value: 202 },
      ],
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
  },
  Northeast: {
    currentDivision: "Northeast",
    lastUpdated: new Date(),
    kpis: {
      crimeRate: { current: 298, previous: 351, change: -15 },
      clearanceRate: { current: 76, change: 5 },
      responseTime: { current: 5.8, change: -0.4 },
      trustScore: { current: 78, change: 4 },
    },
    operationalMetrics: {
      partICrimes: { current: 298, previous: 351 },
      arrests: { current: 189, previous: 176 },
      citations: { current: 723, previous: 768 },
      callsForService: 2987,
      officerHours: 11200,
    },
    operationalTrends: {
      partICrimes: [
        { month: "Aug", value: 378 },
        { month: "Sep", value: 351 },
        { month: "Oct", value: 332 },
        { month: "Nov", value: 315 },
        { month: "Dec", value: 298 },
      ],
      arrests: [
        { month: "Aug", value: 152 },
        { month: "Sep", value: 176 },
        { month: "Oct", value: 181 },
        { month: "Nov", value: 185 },
        { month: "Dec", value: 189 },
      ],
    },
    communityMetrics: {
      trust: { value: 78, change: 4, trend: "up" },
      fairness: { value: 76, change: 3, trend: "up" },
      voice: { value: 71, change: 2, trend: "up" },
      respect: { value: 80, change: 6, trend: "up" },
      safety: { value: 75, change: 2, trend: "up" },
    },
    demographics: {
      hispanic: { trust: 72, gap: -6 },
      black: { trust: 76, gap: -2 },
      white: { trust: 82, gap: 4 },
      asian: { trust: 79, gap: 1 },
      other: { trust: 77, gap: -1 },
    },
    trustTrend: [
      { month: "Jul", overall: 70, hispanic: 64, black: 72, white: 76, asian: 74 },
      { month: "Aug", overall: 72, hispanic: 66, black: 74, white: 78, asian: 76 },
      { month: "Sep", overall: 74, hispanic: 68, black: 75, white: 79, asian: 77 },
      { month: "Oct", overall: 75, hispanic: 70, black: 75, white: 80, asian: 78 },
      { month: "Nov", overall: 76, hispanic: 71, black: 75, white: 81, asian: 78 },
      { month: "Dec", overall: 78, hispanic: 72, black: 76, white: 82, asian: 79 },
    ],
  },
  Central: {
    currentDivision: "Central",
    lastUpdated: new Date(),
    kpis: {
      crimeRate: { current: 445, previous: 484, change: -8 },
      clearanceRate: { current: 74, change: 4 },
      responseTime: { current: 6.1, change: -0.2 },
      trustScore: { current: 76, change: 3 },
    },
    operationalMetrics: {
      partICrimes: { current: 445, previous: 484 },
      arrests: { current: 267, previous: 248 },
      citations: { current: 1124, previous: 1187 },
      callsForService: 4156,
      officerHours: 15800,
    },
    operationalTrends: {
      partICrimes: [
        { month: "Aug", value: 523 },
        { month: "Sep", value: 484 },
        { month: "Oct", value: 468 },
        { month: "Nov", value: 456 },
        { month: "Dec", value: 445 },
      ],
      arrests: [
        { month: "Aug", value: 221 },
        { month: "Sep", value: 248 },
        { month: "Oct", value: 255 },
        { month: "Nov", value: 261 },
        { month: "Dec", value: 267 },
      ],
    },
    communityMetrics: {
      trust: { value: 76, change: 3, trend: "up" },
      fairness: { value: 74, change: 2, trend: "up" },
      voice: { value: 68, change: 1, trend: "up" },
      respect: { value: 78, change: 4, trend: "up" },
      safety: { value: 73, change: 1, trend: "up" },
    },
    demographics: {
      hispanic: { trust: 68, gap: -8 },
      black: { trust: 74, gap: -2 },
      white: { trust: 81, gap: 5 },
      asian: { trust: 77, gap: 1 },
      other: { trust: 75, gap: -1 },
    },
    trustTrend: [
      { month: "Jul", overall: 69, hispanic: 61, black: 70, white: 76, asian: 72 },
      { month: "Aug", overall: 71, hispanic: 63, black: 72, white: 78, asian: 74 },
      { month: "Sep", overall: 72, hispanic: 65, black: 73, white: 79, asian: 75 },
      { month: "Oct", overall: 74, hispanic: 66, black: 73, white: 80, asian: 76 },
      { month: "Nov", overall: 75, hispanic: 67, black: 73, white: 80, asian: 76 },
      { month: "Dec", overall: 76, hispanic: 68, black: 74, white: 81, asian: 77 },
    ],
  },
  Valley: {
    currentDivision: "Valley",
    lastUpdated: new Date(),
    kpis: {
      crimeRate: { current: 356, previous: 396, change: -10 },
      clearanceRate: { current: 72, change: 3 },
      responseTime: { current: 5.9, change: -0.3 },
      trustScore: { current: 74, change: 2 },
    },
    operationalMetrics: {
      partICrimes: { current: 356, previous: 396 },
      arrests: { current: 194, previous: 181 },
      citations: { current: 798, previous: 834 },
      callsForService: 3089,
      officerHours: 11950,
    },
    operationalTrends: {
      partICrimes: [
        { month: "Aug", value: 421 },
        { month: "Sep", value: 396 },
        { month: "Oct", value: 378 },
        { month: "Nov", value: 367 },
        { month: "Dec", value: 356 },
      ],
      arrests: [
        { month: "Aug", value: 158 },
        { month: "Sep", value: 181 },
        { month: "Oct", value: 187 },
        { month: "Nov", value: 191 },
        { month: "Dec", value: 194 },
      ],
    },
    communityMetrics: {
      trust: { value: 74, change: 2, trend: "up" },
      fairness: { value: 71, change: 1, trend: "up" },
      voice: { value: 66, change: 0, trend: "stable" },
      respect: { value: 76, change: 3, trend: "up" },
      safety: { value: 72, change: 1, trend: "up" },
    },
    demographics: {
      hispanic: { trust: 67, gap: -7 },
      black: { trust: 72, gap: -2 },
      white: { trust: 79, gap: 5 },
      asian: { trust: 75, gap: 1 },
      other: { trust: 73, gap: -1 },
    },
    trustTrend: [
      { month: "Jul", overall: 68, hispanic: 60, black: 68, white: 74, asian: 71 },
      { month: "Aug", overall: 70, hispanic: 62, black: 70, white: 76, asian: 73 },
      { month: "Sep", overall: 71, hispanic: 64, black: 71, white: 77, asian: 74 },
      { month: "Oct", overall: 72, hispanic: 65, black: 71, white: 78, asian: 74 },
      { month: "Nov", overall: 73, hispanic: 66, black: 71, white: 78, asian: 74 },
      { month: "Dec", overall: 74, hispanic: 67, black: 72, white: 79, asian: 75 },
    ],
  },
  Olympic: {
    currentDivision: "Olympic",
    lastUpdated: new Date(),
    kpis: {
      crimeRate: { current: 412, previous: 434, change: -5 },
      clearanceRate: { current: 65, change: 2 },
      responseTime: { current: 6.5, change: -0.1 },
      trustScore: { current: 69, change: 1 },
    },
    operationalMetrics: {
      partICrimes: { current: 412, previous: 434 },
      arrests: { current: 178, previous: 169 },
      citations: { current: 923, previous: 967 },
      callsForService: 3567,
      officerHours: 13200,
    },
    operationalTrends: {
      partICrimes: [
        { month: "Aug", value: 467 },
        { month: "Sep", value: 434 },
        { month: "Oct", value: 428 },
        { month: "Nov", value: 420 },
        { month: "Dec", value: 412 },
      ],
      arrests: [
        { month: "Aug", value: 148 },
        { month: "Sep", value: 169 },
        { month: "Oct", value: 173 },
        { month: "Nov", value: 176 },
        { month: "Dec", value: 178 },
      ],
    },
    communityMetrics: {
      trust: { value: 69, change: 1, trend: "up" },
      fairness: { value: 65, change: 0, trend: "stable" },
      voice: { value: 59, change: -1, trend: "down" },
      respect: { value: 71, change: 2, trend: "up" },
      safety: { value: 66, change: 0, trend: "stable" },
    },
    demographics: {
      hispanic: { trust: 58, gap: -11 },
      black: { trust: 66, gap: -3 },
      white: { trust: 75, gap: 6 },
      asian: { trust: 70, gap: 1 },
      other: { trust: 68, gap: -1 },
    },
    trustTrend: [
      { month: "Jul", overall: 64, hispanic: 49, black: 62, white: 71, asian: 66 },
      { month: "Aug", overall: 66, hispanic: 51, black: 64, white: 73, asian: 68 },
      { month: "Sep", overall: 67, hispanic: 53, black: 65, white: 74, asian: 69 },
      { month: "Oct", overall: 68, hispanic: 55, black: 65, white: 74, asian: 69 },
      { month: "Nov", overall: 68, hispanic: 56, black: 65, white: 75, asian: 69 },
      { month: "Dec", overall: 69, hispanic: 58, black: 66, white: 75, asian: 70 },
    ],
  },
  Southeast: {
    currentDivision: "Southeast",
    lastUpdated: new Date(),
    kpis: {
      crimeRate: { current: 467, previous: 482, change: -3 },
      clearanceRate: { current: 62, change: 1 },
      responseTime: { current: 6.8, change: -0.1 },
      trustScore: { current: 67, change: 0 },
    },
    operationalMetrics: {
      partICrimes: { current: 467, previous: 482 },
      arrests: { current: 156, previous: 151 },
      citations: { current: 1045, previous: 1089 },
      callsForService: 3876,
      officerHours: 14100,
    },
    operationalTrends: {
      partICrimes: [
        { month: "Aug", value: 512 },
        { month: "Sep", value: 482 },
        { month: "Oct", value: 478 },
        { month: "Nov", value: 472 },
        { month: "Dec", value: 467 },
      ],
      arrests: [
        { month: "Aug", value: 134 },
        { month: "Sep", value: 151 },
        { month: "Oct", value: 154 },
        { month: "Nov", value: 155 },
        { month: "Dec", value: 156 },
      ],
    },
    communityMetrics: {
      trust: { value: 67, change: 0, trend: "stable" },
      fairness: { value: 63, change: -1, trend: "down" },
      voice: { value: 57, change: -2, trend: "down" },
      respect: { value: 69, change: 1, trend: "up" },
      safety: { value: 64, change: -1, trend: "down" },
    },
    demographics: {
      hispanic: { trust: 55, gap: -12 },
      black: { trust: 64, gap: -3 },
      white: { trust: 73, gap: 6 },
      asian: { trust: 68, gap: 1 },
      other: { trust: 66, gap: -1 },
    },
    trustTrend: [
      { month: "Jul", overall: 63, hispanic: 47, black: 60, white: 70, asian: 64 },
      { month: "Aug", overall: 65, hispanic: 49, black: 62, white: 72, asian: 66 },
      { month: "Sep", overall: 66, hispanic: 51, black: 63, white: 72, asian: 67 },
      { month: "Oct", overall: 67, hispanic: 53, black: 63, white: 73, asian: 67 },
      { month: "Nov", overall: 67, hispanic: 54, black: 63, white: 73, asian: 67 },
      { month: "Dec", overall: 67, hispanic: 55, black: 64, white: 73, asian: 68 },
    ],
  },
}

const divisions = [
  { name: "Northeast", crime: -15, trust: 78, fairness: 76, response: 5.8, status: "leading" },
  { name: "Central", crime: -8, trust: 76, fairness: 74, response: 6.1, status: "strong" },
  { name: "Southwest", crime: -12, trust: 72, fairness: 68, response: 6.2, status: "current" },
  { name: "Valley", crime: -10, trust: 74, fairness: 71, response: 5.9, status: "strong" },
  { name: "Olympic", crime: -5, trust: 69, fairness: 65, response: 6.5, status: "watch" },
  { name: "Southeast", crime: -3, trust: 67, fairness: 63, response: 6.8, status: "priority" },
]

export function CompStatDashboard({ onSectionChange }: CompStatDashboardProps) {
  const [selectedDivision, setSelectedDivision] = useState("Southwest")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([])
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const [dataUpdating, setDataUpdating] = useState(false)

  const currentData =
    mockDataByDivision[selectedDivision as keyof typeof mockDataByDivision] || mockDataByDivision.Southwest

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleDivisionChange = async (newDivision: string) => {
    if (newDivision === selectedDivision) return

    setIsLoading(true)
    setDataUpdating(true)

    // Simulate API call delay for realistic loading experience
    await new Promise((resolve) => setTimeout(resolve, 800))

    setSelectedDivision(newDivision)
    setIsLoading(false)

    // Keep data updating animation for smooth transition
    setTimeout(() => setDataUpdating(false), 300)
  }

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

  const toggleMetricExpansion = (metricKey: string) => {
    setExpandedMetrics((prev) =>
      prev.includes(metricKey) ? prev.filter((key) => key !== metricKey) : [...prev, metricKey],
    )
  }

  const getMetricIcon = (metricType: string) => {
    const icons = {
      partICrimes: Shield,
      arrests: UserCheck,
      citations: FileText,
      callsForService: Phone,
      officerHours: Clock,
    }
    const IconComponent = icons[metricType as keyof typeof icons] || Activity
    return <IconComponent className="w-5 h-5" />
  }

  const demographicData = Object.entries(currentData.demographics).map(([key, value]) => ({
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
          <div className="text-sm text-gray-600 flex items-center gap-2">
            Last Updated: {formatTime(currentTime)} | Next CompStat: Thursday 2:00 PM
            {isLoading && (
              <div className="flex items-center gap-1 text-accent">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs">Updating...</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedDivision} onValueChange={handleDivisionChange} disabled={isLoading}>
            <SelectTrigger className={`w-48 transition-all duration-200 ${isLoading ? "opacity-50" : ""}`}>
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
          <Button variant="outline" size="sm" disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Dashboard Content */}
        <div className="flex-1 space-y-6">
          <div
            className={`transition-all duration-300 ${dataUpdating ? "opacity-70 scale-[0.99]" : "opacity-100 scale-100"}`}
          >
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className={`hover:shadow-lg transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-[#FC7753] mr-2" />
                      <span className="text-sm font-medium text-gray-600">CRIME RATE</span>
                    </div>
                    {getTrendIcon(currentData.kpis.crimeRate.change)}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`text-2xl font-bold text-[#FC7753] transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                    >
                      {currentData.kpis.crimeRate.change}%
                    </div>
                    <div className="text-sm text-gray-600">{currentData.kpis.crimeRate.current} incidents</div>
                    <div className="text-xs text-gray-500">This Month</div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`hover:shadow-lg transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-[#3BD1BB] mr-2" />
                      <span className="text-sm font-medium text-gray-600">CLEARANCE RATE</span>
                    </div>
                    {getTrendIcon(currentData.kpis.clearanceRate.change)}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`text-2xl font-bold text-[#3BD1BB] transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                    >
                      {currentData.kpis.clearanceRate.current}%
                    </div>
                    <div className="text-sm text-gray-600">↑ {currentData.kpis.clearanceRate.change}% from last</div>
                    <div className="text-xs text-gray-500">month</div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`hover:shadow-lg transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">RESPONSE TIME</span>
                    </div>
                    {getTrendIcon(currentData.kpis.responseTime.change)}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`text-2xl font-bold text-blue-500 transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                    >
                      {currentData.kpis.responseTime.current} min
                    </div>
                    <div className="text-sm text-gray-600">↓ {Math.abs(currentData.kpis.responseTime.change)} min</div>
                    <div className="text-xs text-gray-500">improvement</div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`hover:shadow-lg transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-[#3BD1BB] mr-2" />
                      <span className="text-sm font-medium text-gray-600">TRUST SCORE</span>
                    </div>
                    {getTrendIcon(currentData.kpis.trustScore.change)}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`text-2xl font-bold text-[#3BD1BB] transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                    >
                      {currentData.kpis.trustScore.current}%
                    </div>
                    <div className="text-sm text-gray-600">↑ {currentData.kpis.trustScore.change} pts</div>
                    <div className="text-xs text-gray-500">from last month</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dual Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card
                className={`bg-gradient-to-br from-card to-muted/20 border-2 hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl metric-hover-effect ${isLoading ? "animate-pulse" : ""}`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-accent/10 mr-3">
                        <Activity className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">OPERATIONAL METRICS</h3>
                        <p className="text-sm text-muted-foreground">Real-time performance indicators</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="animate-pulse-subtle bg-accent/10 text-accent border-accent/20"
                    >
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Part I Crimes */}
                  <div
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer metric-card ${
                      hoveredMetric === "partICrimes"
                        ? "border-accent bg-accent/5 shadow-md transform scale-[1.02]"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                    onMouseEnter={() => setHoveredMetric("partICrimes")}
                    onMouseLeave={() => setHoveredMetric(null)}
                    onClick={() => toggleMetricExpansion("partICrimes")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleMetricExpansion("partICrimes")
                      }
                    }}
                    aria-expanded={expandedMetrics.includes("partICrimes")}
                    aria-label="Part I Crimes metric details"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-destructive/10 transition-colors duration-300">
                          {getMetricIcon("partICrimes")}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Part I Crimes</span>
                          <div className="text-xs text-muted-foreground">Serious offenses</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {currentData.operationalMetrics.partICrimes.previous} →
                            </span>
                            <span
                              className={`text-xl font-bold text-foreground transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                            >
                              {currentData.operationalMetrics.partICrimes.current}
                            </span>
                          </div>
                          <div className="flex items-center justify-end space-x-1">
                            <TrendingDown className="w-4 h-4 text-chart-2" />
                            <span className="text-sm font-semibold text-chart-2">
                              {Math.abs(
                                Math.round(
                                  ((currentData.operationalMetrics.partICrimes.current -
                                    currentData.operationalMetrics.partICrimes.previous) /
                                    currentData.operationalMetrics.partICrimes.previous) *
                                    100,
                                ),
                              )}
                              %
                            </span>
                          </div>
                        </div>
                        {expandedMetrics.includes("partICrimes") ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                        )}
                      </div>
                    </div>

                    {expandedMetrics.includes("partICrimes") && (
                      <div className="mt-4 pt-4 border-t border-border animate-slide-in">
                        <div className="h-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentData.operationalTrends.partICrimes}>
                              <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--popover))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "6px",
                                  color: "hsl(var(--popover-foreground))",
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          5-month trend showing consistent decline
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Arrests Made */}
                  <div
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer metric-card ${
                      hoveredMetric === "arrests"
                        ? "border-accent bg-accent/5 shadow-md transform scale-[1.02]"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                    onMouseEnter={() => setHoveredMetric("arrests")}
                    onMouseLeave={() => setHoveredMetric(null)}
                    onClick={() => toggleMetricExpansion("arrests")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleMetricExpansion("arrests")
                      }
                    }}
                    aria-expanded={expandedMetrics.includes("arrests")}
                    aria-label="Arrests made metric details"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-chart-2/10 transition-colors duration-300">
                          {getMetricIcon("arrests")}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Arrests Made</span>
                          <div className="text-xs text-muted-foreground">Total apprehensions</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {currentData.operationalMetrics.arrests.previous} →
                            </span>
                            <span
                              className={`text-xl font-bold text-foreground transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                            >
                              {currentData.operationalMetrics.arrests.current}
                            </span>
                          </div>
                          <div className="flex items-center justify-end space-x-1">
                            <TrendingUp className="w-4 h-4 text-chart-2" />
                            <span className="text-sm font-semibold text-chart-2">
                              {Math.round(
                                ((currentData.operationalMetrics.arrests.current -
                                  currentData.operationalMetrics.arrests.previous) /
                                  currentData.operationalMetrics.arrests.previous) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                        </div>
                        {expandedMetrics.includes("arrests") ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                        )}
                      </div>
                    </div>

                    {expandedMetrics.includes("arrests") && (
                      <div className="mt-4 pt-4 border-t border-border animate-slide-in">
                        <div className="h-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentData.operationalTrends.arrests}>
                              <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--popover))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "6px",
                                  color: "hsl(var(--popover-foreground))",
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">Steady improvement in arrest rates</div>
                      </div>
                    )}
                  </div>

                  {/* Citations Issued */}
                  <div
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer metric-card ${
                      hoveredMetric === "citations"
                        ? "border-accent bg-accent/5 shadow-md transform scale-[1.02]"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                    onMouseEnter={() => setHoveredMetric("citations")}
                    onMouseLeave={() => setHoveredMetric(null)}
                    role="button"
                    tabIndex={0}
                    aria-label="Citations issued metric"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-chart-4/10 transition-colors duration-300">
                          {getMetricIcon("citations")}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Citations Issued</span>
                          <div className="text-xs text-muted-foreground">Traffic & violations</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {currentData.operationalMetrics.citations.previous} →
                          </span>
                          <span
                            className={`text-xl font-bold text-foreground transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                          >
                            {currentData.operationalMetrics.citations.current}
                          </span>
                        </div>
                        <div className="flex items-center justify-end space-x-1">
                          <TrendingDown className="w-4 h-4 text-chart-5" />
                          <span className="text-sm font-semibold text-chart-5">
                            {Math.abs(
                              Math.round(
                                ((currentData.operationalMetrics.citations.current -
                                  currentData.operationalMetrics.citations.previous) /
                                  currentData.operationalMetrics.citations.previous) *
                                  100,
                              ),
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calls for Service */}
                  <div
                    className={`p-4 rounded-lg border transition-all duration-300 metric-card ${
                      hoveredMetric === "callsForService"
                        ? "border-accent bg-accent/5 shadow-md transform scale-[1.02]"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                    onMouseEnter={() => setHoveredMetric("callsForService")}
                    onMouseLeave={() => setHoveredMetric(null)}
                    role="button"
                    tabIndex={0}
                    aria-label="Calls for service metric"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-accent/10 transition-colors duration-300">
                          {getMetricIcon("callsForService")}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Calls for Service</span>
                          <div className="text-xs text-muted-foreground">Total dispatched calls</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-2xl font-bold text-accent transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                        >
                          {currentData.operationalMetrics.callsForService.toLocaleString()}
                        </span>
                        <div className="text-xs text-muted-foreground">This month</div>
                      </div>
                    </div>
                  </div>

                  {/* Officer Hours */}
                  <div
                    className={`p-4 rounded-lg border transition-all duration-300 metric-card ${
                      hoveredMetric === "officerHours"
                        ? "border-accent bg-accent/5 shadow-md transform scale-[1.02]"
                        : "border-border bg-card hover:bg-muted/10"
                    }`}
                    onMouseEnter={() => setHoveredMetric("officerHours")}
                    onMouseLeave={() => setHoveredMetric(null)}
                    role="button"
                    tabIndex={0}
                    aria-label="Officer hours metric"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-chart-3/10 transition-colors duration-300">
                          {getMetricIcon("officerHours")}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Officer Hours</span>
                          <div className="text-xs text-muted-foreground">Total duty hours</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-2xl font-bold text-chart-3 transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                        >
                          {currentData.operationalMetrics.officerHours.toLocaleString()}
                        </span>
                        <div className="text-xs text-muted-foreground">This month</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold text-accent">Key Insights</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Crime reduction indicates effective patrol strategies</div>
                      <div>• Arrest rate improvement suggests enhanced investigative work</div>
                      <div>• High call volume requires continued resource allocation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Metrics */}
              <Card className={`transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[#3BD1BB]" />
                    COMMUNITY METRICS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(currentData.communityMetrics).map(([key, metric]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm capitalize">{key}</span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-semibold transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                          >
                            {metric.value}%
                          </span>
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
                          className={`bg-[#3BD1BB] h-2 rounded-full transition-all duration-1000 ${dataUpdating ? "animate-shimmer" : ""}`}
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
              <Card className={`lg:col-span-2 transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
                <CardHeader>
                  <CardTitle>TRUST TREND (6 MONTHS)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={currentData.trustTrend}>
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
              <Card className={`transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
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
                            <span
                              className={`font-semibold transition-all duration-500 ${dataUpdating ? "animate-count-up" : ""}`}
                            >
                              {item.trust}%
                            </span>
                            {item.gap < -5 && <AlertTriangle className="w-4 h-4 text-[#FC7753]" />}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              item.gap < -5 ? "bg-[#FC7753]" : "bg-[#3BD1BB]"
                            } ${dataUpdating ? "animate-shimmer" : ""}`}
                            style={{ width: `${(item.trust / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-600 text-center">
                        {selectedDivision === "All Divisions"
                          ? "Citywide Avg: 74%"
                          : `Citywide Avg: 74% | ${selectedDivision}: ${currentData.kpis.trustScore.current}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Division Comparison Table */}
            <Card className={`transition-all duration-300 ${isLoading ? "animate-pulse" : ""}`}>
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
                      {divisions.map((division) => (
                        <tr
                          key={division.name}
                          className={`border-b hover:bg-gray-50 transition-colors duration-200 ${
                            division.name === selectedDivision && selectedDivision !== "All Divisions"
                              ? "bg-accent/5 border-accent/20"
                              : ""
                          }`}
                        >
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
