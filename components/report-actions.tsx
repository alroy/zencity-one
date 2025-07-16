"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReportBuilderModal } from "@/components/report-builder-modal"
import { PostSaveModal } from "@/components/post-save-modal"
import { useToast } from "@/hooks/use-toast"

interface ReportActionsProps {
  surveyId: string | null
  surveyTitle: string
}

export function ReportActions({ surveyId, surveyTitle }: ReportActionsProps) {
  const { toast } = useToast()
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false)
  const [isPostSaveModalOpen, setIsPostSaveModalOpen] = useState(false)
  const [activeReportId, setActiveReportId] = useState<string | null>(null)

  const handleGenerateStandardReport = (reportType: "Executive Summary" | "Comprehensive") => {
    if (!surveyId) return
    toast({
      title: "Generating Report...",
      description: `Your ${reportType.toLowerCase()} report for "${surveyTitle}" is being generated.`,
      duration: 2000,
    })
    // Simulate API call and get a report ID
    const reportTypePrefix = reportType === "Executive Summary" ? "exec-summary" : "comprehensive"
    const mockReportId = `${reportTypePrefix}-report-${surveyId}`
    setActiveReportId(mockReportId)

    setTimeout(() => {
      setIsPostSaveModalOpen(true)
    }, 2000)
  }

  const handleCustomReportSaveSuccess = (reportId: string) => {
    setActiveReportId(reportId)
    toast({
      title: "Report configuration saved",
      description: "Your custom report is being generated.",
      duration: 3000,
    })

    // Display the "Report Saved" modal after the toast has been dismissed.
    setTimeout(() => {
      setIsPostSaveModalOpen(true)
    }, 3500) // Slightly longer than toast duration
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">Reporting</h3>
        <p className="text-sm text-gray-500">Generate standard or custom reports for your survey.</p>
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Generate Standard Report</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => handleGenerateStandardReport("Executive Summary")}>
              Executive Summary Report
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleGenerateStandardReport("Comprehensive")}>
              Comprehensive Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={() => setIsReportBuilderOpen(true)}>Build Custom Report</Button>
      </div>

      <ReportBuilderModal
        open={isReportBuilderOpen}
        onOpenChange={setIsReportBuilderOpen}
        surveyId={surveyId}
        onSaveSuccess={handleCustomReportSaveSuccess}
      />

      <PostSaveModal open={isPostSaveModalOpen} onOpenChange={setIsPostSaveModalOpen} reportId={activeReportId} />
    </div>
  )
}
