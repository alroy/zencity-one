"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Edit,
  Copy,
  MoreVertical,
  X,
  Filter,
  SlidersHorizontal,
  Settings,
  Clock,
  Pause,
  Play,
  ChevronDown,
  FilePlus,
  Bot,
  LayoutTemplate,
} from "lucide-react"

interface SurveyListProps {
  onCreateNew: () => void
  onEditSurvey: (surveyId: number) => void
  onCreateFromScratch: () => void
  onGenerateWithAI: () => void
  onViewSurvey: (survey: Survey) => void
}

// Define survey interface for type safety
export interface Survey {
  id: number
  title: string
  status: string
  template: string
  cadence: string
  distribution: string
  createdOn: string
  createdBy: { initials: string; color: string }
}

export function SurveyList({
  onCreateNew,
  onEditSurvey,
  onCreateFromScratch,
  onGenerateWithAI,
  onViewSurvey,
}: SurveyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cadenceFilter, setCadenceFilter] = useState("all")
  const [distributionFilter, setDistributionFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([])
  const [showFilters, setShowFilters] = useState(true)
  const [pausedSurveys, setPausedSurveys] = useState<Set<number>>(new Set())

  // Sample survey data
  const surveys: Survey[] = [
    {
      id: 1,
      title: "Community Satisfaction Survey | Q2 2025",
      status: "draft",
      template: "Community Survey",
      cadence: "Quarterly",
      distribution: "representative",
      createdOn: "31/03/2025",
      createdBy: { initials: "NK", color: "bg-red-500" },
    },
    {
      id: 2,
      title: "Public Safety Perception Survey",
      status: "distribution",
      template: "Public Safety",
      cadence: "One-time",
      distribution: "fast",
      createdOn: "26/03/2025",
      createdBy: { initials: "AV", color: "bg-purple-500" },
    },
    {
      id: 3,
      title: "Parks & Recreation Needs Assessment",
      status: "distribution",
      template: "Parks & Recreation",
      cadence: "Annual",
      distribution: "connected-crm",
      createdOn: "15/03/2025",
      createdBy: { initials: "GK", color: "bg-blue-500" },
    },
    {
      id: 4,
      title: "Downtown Revitalization Survey",
      status: "closed",
      template: "Urban Development",
      cadence: "One-time",
      distribution: "self-distributed",
      createdOn: "01/02/2025",
      createdBy: { initials: "HH", color: "bg-indigo-500" },
    },
    {
      id: 5,
      title: "Transportation & Infrastructure Survey | Q1 2025",
      status: "closed",
      template: "Transportation",
      cadence: "Quarterly",
      distribution: "representative",
      createdOn: "15/01/2025",
      createdBy: { initials: "NK", color: "bg-red-500" },
    },
    {
      id: 6,
      title: "Community Satisfaction Survey | Q1 2025",
      status: "closed",
      template: "Community Survey",
      cadence: "Quarterly",
      distribution: "internal-audience",
      createdOn: "05/01/2025",
      createdBy: { initials: "AV", color: "bg-purple-500" },
    },
  ]

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters()
  }, [searchQuery, statusFilter, cadenceFilter, distributionFilter])

  // Function to apply all filters
  const applyFilters = () => {
    setIsLoading(true)

    // Simulate loading delay for better UX
    setTimeout(() => {
      const filtered = surveys.filter((survey) => {
        // Apply status filter
        if (statusFilter !== "all" && survey.status !== statusFilter) {
          return false
        }

        // Apply cadence filter
        if (cadenceFilter !== "all") {
          const normalizedCadence = cadenceFilter.replace(/-/g, " ")
          if (survey.cadence.toLowerCase() !== normalizedCadence.toLowerCase()) {
            return false
          }
        }

        // Apply distribution filter
        if (distributionFilter !== "all" && survey.distribution !== distributionFilter) {
          return false
        }

        // Apply search query filter
        if (searchQuery) {
          return survey.title.toLowerCase().includes(searchQuery.toLowerCase())
        }

        return true
      })

      setFilteredSurveys(filtered)
      setIsLoading(false)
    }, 300)
  }

  const hasActiveFilters = () => {
    return statusFilter !== "all" || cadenceFilter !== "all" || distributionFilter !== "all" || searchQuery !== ""
  }

  // Get count of filtered surveys
  const getFilteredCount = () => {
    const filteredCount = filteredSurveys.length
    const totalCount = surveys.length

    if (hasActiveFilters()) {
      return `Showing ${filteredCount} of ${totalCount} surveys`
    }

    return `${totalCount} surveys`
  }

  // Reset all filters
  const resetFilters = () => {
    setIsLoading(true)
    setStatusFilter("all")
    setCadenceFilter("all")
    setDistributionFilter("all")
    setSearchQuery("")

    setTimeout(() => {
      setFilteredSurveys(surveys)
      setIsLoading(false)
    }, 300)
  }

  // Get status badge with appropriate styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Draft", className: "bg-yellow-100 text-yellow-800" },
      published: { label: "Published", className: "bg-blue-100 text-blue-800" },
      distribution: { label: "Distribution", className: "bg-[#3BD1BB]/20 text-[#3BD1BB]" },
      closed: { label: "Closed", className: "bg-[#FC7753]/20 text-[#FC7753]" },
      canceled: { label: "Canceled", className: "bg-gray-100 text-gray-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  // Get human-readable distribution method name
  const getDistributionMethodName = (method: string) => {
    const methodNames: Record<string, string> = {
      representative: "Representative",
      fast: "Fast",
      "connected-crm": "Connected CRM",
      "internal-audience": "Internal Audience",
      "self-distributed": "Self-distributed",
      "third-party": "3rd-party",
    }
    return methodNames[method] || method
  }

  // Toggle pause/resume state for a survey
  const togglePauseResume = (surveyId: number) => {
    setPausedSurveys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(surveyId)) {
        newSet.delete(surveyId)
      } else {
        newSet.add(surveyId)
      }
      return newSet
    })
  }

  // Initialize filtered surveys on component mount
  useEffect(() => {
    setFilteredSurveys(surveys)
  }, [])

  return (
    <div className="space-y-4">
      {/* Create New Survey Button - Moved above filters */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="mr-2">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          {hasActiveFilters() && (
            <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
              <Filter className="w-3 h-3 mr-1" />
              {filteredSurveys.length} of {surveys.length}
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Survey
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCreateNew}>
              <LayoutTemplate className="mr-2 h-4 w-4" />
              <span>Start from a template</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateFromScratch}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>Start from scratch</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGenerateWithAI}>
              <Bot className="mr-2 h-4 w-4" />
              <span>Generate using Survey AI</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-wrap p-4 bg-gray-50 rounded-md border border-gray-100 animate-in fade-in-50 duration-300">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search surveys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${searchQuery ? "border-[#3BD1BB]" : ""}`}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className={`w-full md:w-32 ${statusFilter !== "all" ? "border-[#3BD1BB] text-[#3BD1BB]" : ""}`}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="distribution">Distribution</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={cadenceFilter} onValueChange={setCadenceFilter}>
              <SelectTrigger
                className={`w-full md:w-36 ${cadenceFilter !== "all" ? "border-[#3BD1BB] text-[#3BD1BB]" : ""}`}
              >
                <SelectValue placeholder="Cadence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cadence: All</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="semi-annually">Semi-annually</SelectItem>
              </SelectContent>
            </Select>

            <Select value={distributionFilter} onValueChange={setDistributionFilter}>
              <SelectTrigger
                className={`w-full md:w-40 ${distributionFilter !== "all" ? "border-[#3BD1BB] text-[#3BD1BB]" : ""}`}
              >
                <SelectValue placeholder="Distribution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Distribution: All</SelectItem>
                <SelectItem value="representative">Representative</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="connected-crm">Connected CRM</SelectItem>
                <SelectItem value="internal-audience">Internal Audience</SelectItem>
                <SelectItem value="self-distributed">Self-distributed</SelectItem>
                <SelectItem value="third-party">3rd-party</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters() && (
              <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs bg-transparent">
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 mb-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">{getFilteredCount()}</div>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {statusFilter !== "all" && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Status: {statusFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setStatusFilter("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {cadenceFilter !== "all" && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Cadence: {cadenceFilter.replace(/-/g, " ")}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setCadenceFilter("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {distributionFilter !== "all" && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Distribution: {getDistributionMethodName(distributionFilter)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setDistributionFilter("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Search: "{searchQuery}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Survey Table */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">Survey List</h3>
            <Badge variant="secondary" className="bg-gray-100">
              {isLoading ? "..." : filteredSurveys.length}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">{hasActiveFilters() && !isLoading ? getFilteredCount() : ""}</div>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Survey title</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700 hidden md:table-cell">Template</th>
                <th className="text-left p-4 font-medium text-gray-700">Cadence</th>
                <th className="text-left p-4 font-medium text-gray-700">Distribution</th>
                <th className="text-left p-4 font-medium text-gray-700 hidden lg:table-cell">Created</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3BD1BB]"></div>
                      <span className="text-gray-500">Filtering surveys...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSurveys.length > 0 ? (
                filteredSurveys.map((survey) => (
                  <tr
                    key={survey.id}
                    className={`border-b hover:bg-gray-50 ${
                      survey.status !== "draft" ? "cursor-pointer" : "cursor-default"
                    }`}
                    onClick={() => survey.status !== "draft" && onViewSurvey(survey)}
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-sm">{survey.title}</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(survey.status)}</td>
                    <td className="p-4 text-sm hidden md:table-cell">{survey.template}</td>
                    <td className="p-4 text-sm">{survey.cadence}</td>
                    <td className="p-4 text-sm">{getDistributionMethodName(survey.distribution)}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full ${survey.createdBy.color} text-white text-xs flex items-center justify-center mr-2`}
                        >
                          {survey.createdBy.initials}
                        </div>
                        <span className="text-sm">{survey.createdOn}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditSurvey(survey.id)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 p-1">
                            <DropdownMenuItem
                              className="flex items-center px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 rounded-md"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Copy className="w-4 h-4 mr-3 text-gray-600" />
                              Copy Cycle ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 rounded-md"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings className="w-4 h-4 mr-3 text-gray-600" />
                              Cycle settings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 rounded-md"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Clock className="w-4 h-4 mr-3 text-gray-600" />
                              Extend cycle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 rounded-md"
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePauseResume(survey.id)
                              }}
                            >
                              {pausedSurveys.has(survey.id) ? (
                                <>
                                  <Play className="w-4 h-4 mr-3 text-gray-600" />
                                  Resume cycle
                                </>
                              ) : (
                                <>
                                  <Pause className="w-4 h-4 mr-3 text-gray-600" />
                                  Pause cycle
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-gray-200" />
                            <DropdownMenuItem
                              className="flex items-center px-3 py-2.5 text-sm cursor-pointer hover:bg-red-50 rounded-md text-red-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <X className="w-4 h-4 mr-3 text-red-500" />
                              End cycle
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No surveys match your filter criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

export default SurveyList
