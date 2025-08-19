"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  BarChart3,
  RefreshCw,
  Info,
  ChevronRight,
} from "lucide-react"

const TrendUpIcon = TrendingUp
const TrendDownIcon = TrendingDown

interface MetricCardProps {
  label: string
  value: string
  change: string
  isPositive: boolean
  tooltip: string
  index: number
  icon: React.ElementType
  trend: number[]
  onExpand: () => void
  isExpanded: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive,
  tooltip,
  index,
  icon: Icon,
  trend,
  onExpand,
  isExpanded,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleCardClick = () => {
    setIsAnimating(true)
    onExpand()
    setTimeout(() => setIsAnimating(false), 300)
  }

  const changeValue = Math.abs(Number.parseFloat(change.replace("%", "")))
  const maxTrendValue = Math.max(...trend)
  const minTrendValue = Math.min(...trend)
  const trendRange = maxTrendValue - minTrendValue
  const currentTrendPosition = trendRange > 0 ? ((trend[trend.length - 1] - minTrendValue) / trendRange) * 100 : 50

  return (
    <TooltipProvider>
      <Card
        className={`
          group cursor-pointer transition-all duration-300 ease-out
          hover:shadow-lg hover:scale-[1.02] hover:border-[#3BD1BB]/30
          ${isExpanded ? "ring-2 ring-[#3BD1BB] ring-opacity-50" : ""}
          ${isAnimating ? "animate-pulse" : ""}
        `}
        onClick={handleCardClick}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#3BD1BB]/10">
                <Icon className="w-4 h-4 text-[#3BD1BB]" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">{label}</div>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-[#3BD1BB]/10">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="text-3xl font-bold text-foreground tabular-nums mb-1">{value}</div>
            <div className="flex items-center justify-between">
              <div
                className={`
                flex items-center gap-1 text-sm font-medium
                ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
              `}
              >
                {isPositive ? <TrendUpIcon className="w-3 h-3" /> : <TrendDownIcon className="w-3 h-3" />}
                <span className="tabular-nums">{change}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {isPositive ? "↗" : "↘"} vs last period
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Performance</span>
              <span>{changeValue}% change</span>
            </div>
            <div className="relative">
              <Progress
                value={changeValue}
                className="h-2 bg-muted"
                indicatorClassName={isPositive ? "bg-green-500" : "bg-red-500"}
              />
              <div
                className="absolute top-0 w-1 h-2 bg-[#3BD1BB] rounded-full transition-all duration-500"
                style={{ left: `${currentTrendPosition}%`, transform: "translateX(-50%)" }}
              />
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
              <div className="text-xs font-medium text-muted-foreground mb-2">7-Day Trend</div>
              <div className="flex items-end gap-1 h-8">
                {trend.map((value, i) => {
                  const height = ((value - minTrendValue) / (trendRange || 1)) * 100
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-[#3BD1BB]/20 rounded-sm transition-all duration-300 hover:bg-[#3BD1BB]/40"
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>7d ago</span>
                <span>Today</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 rounded-lg bg-[#3BD1BB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export const CommunityMetricsWidget: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const metrics = [
    {
      label: "Active Users",
      value: "12,543",
      change: "+5.2%",
      isPositive: true,
      icon: Users,
      trend: [11800, 11950, 12100, 12200, 12350, 12450, 12543],
      tooltip:
        "Number of users who have interacted with the platform in the last 30 days. This includes login activity, content engagement, and community participation.",
    },
    {
      label: "Engagement Rate",
      value: "68%",
      change: "-2.1%",
      isPositive: false,
      icon: BarChart3,
      trend: [70, 69.5, 69, 68.8, 68.5, 68.2, 68],
      tooltip:
        "Percentage of active users who regularly engage with community content, surveys, and discussions. Calculated based on daily active sessions.",
    },
    {
      label: "Reports Filed",
      value: "892",
      change: "+12.7%",
      isPositive: true,
      icon: MessageSquare,
      trend: [750, 780, 810, 840, 860, 875, 892],
      tooltip:
        "Total number of community reports and feedback submissions received this month. Includes service requests, issue reports, and suggestions.",
    },
    {
      label: "Response Time",
      value: "4.2h",
      change: "-8.3%",
      isPositive: true,
      icon: Clock,
      trend: [4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2],
      tooltip:
        "Average time taken to respond to community reports and inquiries. Lower response times indicate improved service efficiency.",
    },
  ]

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  useEffect(() => {
    const interval = setInterval(
      () => {
        setLastUpdated(new Date())
      },
      5 * 60 * 1000,
    )
    return () => clearInterval(interval)
  }, [])

  const handleMetricExpand = (label: string) => {
    setExpandedMetric(expandedMetric === label ? null : label)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">Community Metrics</CardTitle>
              <CardDescription>Real-time insights into community engagement and platform performance</CardDescription>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-[#3BD1BB]/10 hover:border-[#3BD1BB]/30 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-muted rounded-lg" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                    <div className="h-8 bg-muted rounded w-20 mb-4" />
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded" />
                      <div className="flex justify-between">
                        <div className="h-3 bg-muted rounded w-16" />
                        <div className="h-3 bg-muted rounded w-12" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-0 duration-500">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  change={metric.change}
                  isPositive={metric.isPositive}
                  tooltip={metric.tooltip}
                  index={index}
                  icon={metric.icon}
                  trend={metric.trend}
                  onExpand={() => handleMetricExpand(metric.label)}
                  isExpanded={expandedMetric === metric.label}
                />
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live data • Updates every 5 minutes</span>
              </div>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
