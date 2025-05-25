"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Edit, Copy, MoreVertical } from "lucide-react"

interface SurveyListProps {
  onCreateNew: () => void
  onEditSurvey: (surveyId: number) => void
}

export function SurveyList({ onCreateNew, onEditSurvey }: SurveyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cadenceFilter, setCadenceFilter] = useState("all")

  const surveys = [
    {
      id: 1,
      title: "Community Satisfaction Survey | Q2 2025",
      status: "draft",
      template: "Community Survey",
      cadence: "Quarterly",
      createdOn: "31/03/2025",
      createdBy: { initials: "NK", color: "bg-red-500" },
    },
    {
      id: 2,
      title: "Public Safety Perception Survey",
      status: "distribution",
      template: "Public Safety",
      cadence: "One-time",
      createdOn: "26/03/2025",
      createdBy: { initials: "AV", color: "bg-purple-500" },
    },
    {
      id: 3,
      title: "Parks & Recreation Needs Assessment",
      status: "distribution",
      template: "Parks & Recreation",
      cadence: "Annual",
      createdOn: "15/03/2025",
      createdBy: { initials: "GK", color: "bg-blue-500" },
    },
    {
      id: 4,
      title: "Downtown Revitalization Survey",
      status: "closed",
      template: "Urban Development",
      cadence: "One-time",
      createdOn: "01/02/2025",
      createdBy: { initials: "HH", color: "bg-indigo-500" },
    },
    {
      id: 5,
      title: "Transportation & Infrastructure Survey | Q1 2025",
      status: "closed",
      template: "Transportation",
      cadence: "Quarterly",
      createdOn: "15/01/2025",
      createdBy: { initials: "NK", color: "bg-red-500" },
    },
    {
      id: 6,
      title: "Community Satisfaction Survey | Q1 2025",
      status: "closed",
      template: "Community Survey",
      cadence: "Quarterly",
      createdOn: "05/01/2025",
      createdBy: { initials: "AV", color: "bg-purple-500" },
    },
  ]

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
      <div className="flex items-center space-x-4 flex-wrap">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
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
          <SelectTrigger className="w-36">
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
      </div>

      {/* Survey Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Survey title</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Template</th>
                <th className="text-left p-4 font-medium text-gray-700">Cadence</th>
                <th className="text-left p-4 font-medium text-gray-700">Created</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="text-sm">{survey.title}</span>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(survey.status)}</td>
                  <td className="p-4 text-sm">{survey.template}</td>
                  <td className="p-4 text-sm">{survey.cadence}</td>
                  <td className="p-4">
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
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
