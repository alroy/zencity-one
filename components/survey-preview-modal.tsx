"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Question } from "@/components/questionnaire-builder" // Assuming Question type is exported

export interface GeneratedSurveyData {
  title: string
  goal: string
  distributionMethod: string // This should match values from ClarifyingSurveyModal audience
  questions: Question[]
  originalQuery: string // To pass through
  clarifyingFormData: import("./clarifying-survey-modal").ClarifyingFormData // To pass through
}

interface SurveyPreviewModalProps {
  open: boolean
  onClose: () => void
  surveyData?: GeneratedSurveyData
  onOpenBuilder: () => void
}

export function SurveyPreviewModal({ open, onClose, surveyData, onOpenBuilder }: SurveyPreviewModalProps) {
  if (!surveyData) return null

  const getDistributionMethodLabel = (methodValue: string): string => {
    const audienceMap: Record<string, string> = {
      representative: "General Public (Representative Sample)",
      fast: "General Public (Fast Feedback)",
      "connected-crm": "Connected CRM Segments",
      "internal-audience": "Internal Audience (Staff/Employees)",
      "self-distributed": "Self-Distributed (Link Sharing)",
    }
    return audienceMap[methodValue] || "Unknown Method"
  }

  const getDisplayDistributionMethod = (): string => {
    const { surveyType, selectedProject } = surveyData.clarifyingFormData

    if (surveyType === "diy" && selectedProject) {
      return "Self-distributed"
    }

    return getDistributionMethodLabel(surveyData.distributionMethod)
  }

  const getActualDistributionMethod = (): string => {
    const { surveyType } = surveyData.clarifyingFormData

    if (surveyType === "diy") {
      return "self-distributed"
    }

    return surveyData.distributionMethod
  }

  const getEndDate = (): Date | undefined => {
    const { surveyType, surveyEndDate } = surveyData.clarifyingFormData

    if (surveyType === "diy" && surveyEndDate) {
      return surveyEndDate
    }

    return undefined
  }

  const displayTitle = surveyData.clarifyingFormData.mainGoal || surveyData.title
  const displayIntent = surveyData.clarifyingFormData.intent

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Survey Draft Preview</DialogTitle>
          <DialogDescription>Based on your input, we've generated a draft survey. Review it below.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow py-4 pr-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800">Title</h3>
              <p className="text-sm text-gray-600">{displayTitle}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Intent</h3>
              <p className="text-sm text-gray-600">{displayIntent}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Distribution Method</h3>
              <Badge variant="outline" className="mt-1">
                {getDisplayDistributionMethod()}
              </Badge>
            </div>
            {surveyData.clarifyingFormData.surveyType === "diy" && getEndDate() && (
              <div>
                <h3 className="font-semibold text-gray-800">Survey End Date</h3>
                <p className="text-sm text-gray-600">{getEndDate()?.toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Back
          </Button>
          <Button onClick={onOpenBuilder} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
            Open in Questionnaire Builder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
