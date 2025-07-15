"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, FileText, FileSignature, Settings2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ReportBuilderModal } from "./report-builder-modal"

interface ReportActionsProps {
  surveyId: string
  onBuildCustom: () => void
}

/**
 * A button where only the chevron is clickable to reveal a dropdown menu.
 * ┌────────────────────┬────────┐
 * │ Generate report    │   ⌄    │
 * └────────────────────┴────────┘
 */
export function ReportActions({ surveyId, onBuildCustom }: ReportActionsProps) {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleGenerateReport = async (type: "executive_summary" | "comprehensive") => {
    const toastMessages = {
      executive_summary: "Generating executive summary report. It will be saved in the Reports section.",
      comprehensive: "Generating comprehensive report. It will be saved in the Reports section.",
    } as const

    toast({ description: toastMessages[type], duration: 5000 })

    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, surveyId }),
      })
    } catch (e) {
      // Add optional error toast here if desired
    }
  }

  return (
    <>
      <div className="flex items-center">
        <DropdownMenu>
          <div className="inline-flex rounded-md shadow-sm">
            {/* LEFT ZONE - unclickable label */}
            <div
              className="inline-flex items-center h-9 select-none rounded-l-md bg-primary px-3 text-sm font-medium text-primary-foreground"
              aria-hidden="true"
            >
              Generate report
            </div>

            {/* RIGHT ZONE – chevron (menu trigger) */}
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="rounded-l-none px-2" aria-label="More report options">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => handleGenerateReport("executive_summary")}>
              <FileText className="mr-2 h-4 w-4" /> Generate executive summary
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleGenerateReport("comprehensive")}>
              <FileSignature className="mr-2 h-4 w-4" /> Generate comprehensive report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setIsModalOpen(true)
                onBuildCustom()
              }}
            >
              <Settings2 className="mr-2 h-4 w-4" /> Build a custom report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal */}
      <ReportBuilderModal open={isModalOpen} onOpenChange={setIsModalOpen} surveyId={surveyId} />
    </>
  )
}
