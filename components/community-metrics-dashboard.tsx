"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MetricData {
  id: string
  name: string
  percentage: number
  count: number
  respondents: string
  trend: number[]
  change: number
  demographic?: {
    ageGroups?: { label: string; value: number; color: string }[]
    districts?: { label: string; value: number; color: string }[]
    ethnicity?: { label: string; value: number; color: string }[]
  }
}

const mockData: MetricData[] = [
  {
    id: "trust",
    name: "Trust",
    percentage: 72,
    count: 1247,
    respondents: "respondents",
    trend: [65, 68, 70, 69, 71, 73, 72],
    change: 5.2,
    demographic: {
      ageGroups: [
        { label: "18-25", value: 35, color: "#8B5CF6" },
        { label: "26-40", value: 45, color: "#06B6D4" },
        { label: "41-60", value: 15, color: "#10B981" },
        { label: "60+", value: 5, color: "#F59E0B" },
      ],
    },
  },
  {
    id: "safety",
    name: "Safety",
    percentage: 58,
    count: 892,
    respondents: "respondents",
    trend: [62, 60, 59, 57, 56, 58, 58],
    change: -2.1,
    demographic: {
      districts: [
        { label: "Downtown", value: 40, color: "#EF4444" },
        { label: "Suburbs", value: 35, color: "#F59E0B" },
        { label: "Industrial", value: 25, color: "#10B981" },
      ],
    },
  },
  {
    id: "satisfaction",
    name: "Satisfaction",
    percentage: 84,
    count: 1563,
    respondents: "respondents",
    trend: [78, 80, 82, 81, 83, 85, 84],
    change: 7.8,
    demographic: {
      ethnicity: [
        { label: "Hispanic", value: 30, color: "#8B5CF6" },
        { label: "White", value: 25, color: "#06B6D4" },
        { label: "Black", value: 20, color: "#10B981" },
        { label: "Asian", value: 15, color: "#F59E0B" },
        { label: "Other", value: 10, color: "#EF4444" },
      ],
    },
  },
  {
    id: "engagement",
    name: "Engagement",
    percentage: 45,
    count: 678,
    respondents: "participants",
    trend: [52, 50, 48, 46, 44, 45, 45],
    change: -8.3,
    demographic: {
      ageGroups: [
        { label: "18-25", value: 50, color: "#8B5CF6" },
        { label: "26-40", value: 30, color: "#06B6D4" },
        { label: "41-60", value: 15, color: "#10B981" },
        { label: "60+", value: 5, color: "#F59E0B" },
      ],
    },
  },
  {
    id: "transparency",
    name: "Transparency",
    percentage: 67,
    count: 1034,
    respondents: "respondents",
    trend: [63, 65, 66, 64, 67, 68, 67],
    change: 3.1,
    demographic: {
      districts: [
        { label: "North", value: 35, color: "#8B5CF6" },
        { label: "South", value: 30, color: "#06B6D4" },
        { label: "East", value: 20, color: "#10B981" },
        { label: "West", value: 15, color: "#F59E0B" },
      ],
    },
  },
]

const CircularProgress: React.FC<{
  percentage: number
  size: number
  strokeWidth: number
  delay: number
}> = ({ percentage, size, strokeWidth, delay }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  const getColor = (value: number) => {
    if (value >= 70) return "#10B981" // green
    if (value >= 50) return "#F59E0B" // yellow
    return "#EF4444" // red
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, delay)
    return () => clearTimeout(timer)
  }, [percentage, delay])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-800 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-900">{Math.round(animatedPercentage)}%</span>
      </div>
    </div>
  )
}

const MiniSparkline: React.FC<{ data: number[]; change: number }> = ({ data, change }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 40
      const y = 20 - ((value - min) / range) * 20
      return `${x},${y}`
    })
    .join(" ")

  const color = change >= 0 ? "#10B981" : "#EF4444"

  return (
    <div className="flex flex-col items-end">
      <svg width="40" height="20" className="mb-1">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <span className={cn("text-xs font-medium", change >= 0 ? "text-green-600" : "text-red-600")}>
        {change >= 0 ? "+" : ""}
        {change.toFixed(1)}%
      </span>
    </div>
  )
}

const DemographicBreakdown: React.FC<{ demographic: MetricData["demographic"] }> = ({ demographic }) => {
  if (!demographic) return null

  const data = demographic.ageGroups || demographic.districts || demographic.ethnicity || []
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
        {data.map((item, index) => (
          <div
            key={index}
            className="h-full transition-all duration-300"
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600">
              {item.label} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const PulseIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle" />
        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75" />
      </div>
      <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">Community Metrics</span>
    </div>
  )
}

export const CommunityMetricsDashboard: React.FC = () => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const criticalAlerts = mockData.filter((metric) => metric.change < -5)

  const toggleExpanded = (metricId: string) => {
    setExpandedMetric(expandedMetric === metricId ? null : metricId)
  }

  return (
    <div className="w-[400px] bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="mb-4">
        <PulseIndicator />
      </div>

      {/* Metrics */}
      <div className="space-y-2">
        {mockData.map((metric, index) => (
          <div
            key={metric.id}
            className={cn(
              "p-3 rounded-lg transition-all duration-200 cursor-pointer",
              "hover:bg-gray-50 hover:shadow-sm",
              expandedMetric === metric.id && "bg-gray-50",
              isLoaded && "animate-slide-in",
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            onClick={() => toggleExpanded(metric.id)}
          >
            <div className="flex items-center gap-4">
              {/* Circular Progress */}
              <div className="flex-shrink-0">
                <CircularProgress percentage={metric.percentage} size={60} strokeWidth={4} delay={index * 100 + 200} />
              </div>

              {/* Metric Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">{metric.name}</h3>
                <p className="text-xs text-gray-500">
                  {metric.count.toLocaleString()} {metric.respondents}
                </p>
              </div>

              {/* Trend */}
              <div className="flex-shrink-0">
                <MiniSparkline data={metric.trend} change={metric.change} />
              </div>
            </div>

            {/* Expanded Demographic Breakdown */}
            {expandedMetric === metric.id && <DemographicBreakdown demographic={metric.demographic} />}
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-red-600 font-medium">
            Critical Alert: {criticalAlerts.map((alert) => alert.name).join(", ")} dropped significantly
          </div>
        </div>
      )}
    </div>
  )
}
