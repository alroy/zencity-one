"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  const [lastClosedAt, setLastClosedAt] = useState(0)

  const handleGenerateStandardReport = () => {
    if (!surveyId) return
    toast({
      title: "Generating Report...",
      description: `Your standard report for "${surveyTitle}" is being generated.`,
    })
    // Simulate API call
    setTimeout(() => {
      setIsPostSaveModalOpen(true)
    }, 2000)
  }

  const handleReportBuilderChange = (open: boolean) => {
    // Guard to prevent the modal from reopening immediately after closing.
    // This can happen due to race conditions or state updates in parent components.
    if (open && Date.now() - lastClosedAt < 500) {
      return
    }

    if (!open) {
      setLastClosedAt(Date.now())
    }
    setIsReportBuilderOpen(open)
  }

  const openReportBuilder = () => {
    // This function ensures the guard is respected when opening manually
    handleReportBuilderChange(true)
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">Reporting</h3>
        <p className="text-sm text-gray-500">Generate standard or custom reports for your survey.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleGenerateStandardReport}>
          Generate Standard Report
        </Button>
        <Button onClick={openReportBuilder}>Build Custom Report</Button>
      </div>

      <ReportBuilderModal open={isReportBuilderOpen} onOpenChange={handleReportBuilderChange} surveyId={surveyId} />

      <PostSaveModal
        open={isPostSaveModalOpen}
        onOpenChange={setIsPostSaveModalOpen}
        title="Standard Report Generated"
        description={`Your standard report for "${surveyTitle}" is ready.`}
        surveyId={surveyId}
      />
    </div>
  )
}
