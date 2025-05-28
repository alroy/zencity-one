"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Edit, Copy, MoreVertical, X } from "lucide-react"

interface SurveyListProps {
  onCreateNew: () => void
  onEditSurvey: (surveyId: number) => void
}

export function SurveyList({ onCreateNew, onEditSurvey }: SurveyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cadenceFilter, setCadenceFilter] = useState("all")
  const [distributionFilter, setDistributionFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const surveys = [
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

  const getFilteredSurveys = () => {
    return surveys.filter((survey) => {
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
  }

  const hasActiveFilters = () => {
    return statusFilter !== "all" || cadenceFilter !== "all" || distributionFilter !== "all" || searchQuery !== ""
  }

  // Add this function after hasActiveFilters
  const getFilteredCount = () => {
    const filteredCount = getFilteredSurveys().length
    const totalCount = surveys.length

    if (hasActiveFilters()) {
      return `Showing ${filteredCount} of ${totalCount} surveys`
    }

    return `${totalCount} surveys`
  }

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

  return (
    <div className="space-y-4">
      {/* Create New Survey Button - Moved above filters */}
      <div className="flex justify-end">
        <Button onClick={onCreateNew} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New survey
        </Button>
      </div>

      {/* Header with filters - Removed Customer and Segment filters */}
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-wrap">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => {
              setIsLoading(true)
              setSearchQuery(e.target.value)
              setTimeout(() => setIsLoading(false), 300)
            }}
            className={`pl-10 ${searchQuery ? "border-[#3BD1BB]" : ""}`}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setIsLoading(true)
                setSearchQuery("")
                setTimeout(() => setIsLoading(false), 300)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setIsLoading(true)
              setStatusFilter(value)
              setTimeout(() => setIsLoading(false), 300)
            }}
          >
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

          <Select
            value={cadenceFilter}
            onValueChange={(value) => {
              setIsLoading(true)
              setCadenceFilter(value)
              setTimeout(() => setIsLoading(false), 300)
            }}
          >
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

          <Select
            value={distributionFilter}
            onValueChange={(value) => {
              setIsLoading(true)
              setDistributionFilter(value)
              setTimeout(() => setIsLoading(false), 300)
            }}
          >
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true)
                setStatusFilter("all")
                setCadenceFilter("all")
                setDistributionFilter("all")
                setSearchQuery("")
                setTimeout(() => setIsLoading(false), 300)
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="mt-4 mb-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">{getFilteredCount()}</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {statusFilter !== "all" && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Status: {statusFilter}
              </Badge>
            )}
            {cadenceFilter !== "all" && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Cadence: {cadenceFilter.replace(/-/g, " ")}
              </Badge>
            )}
            {distributionFilter !== "all" && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Distribution: {getDistributionMethodName(distributionFilter)}
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                Search: "{searchQuery}"
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
              {isLoading ? "..." : getFilteredSurveys().length}
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
              ) : getFilteredSurveys().length > 0 ? (
                getFilteredSurveys().map((survey) => (
                  <tr key={survey.id} className="border-b hover:bg-gray-50">
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
                        <Button variant="ghost" size="sm" onClick={() => onEditSurvey(survey.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Archive</DropdownMenuItem>
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
