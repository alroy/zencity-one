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
 * Split button:
 * ┌────────────────────┬────────┐
 * │ Generate report     │   ⌄    │
 * └────────────────────┴────────┘
 *
 * • Left zone opens the “Build Your Report” modal only.
 * • Right zone (chevron) opens the dropdown menu only.
 * • aria-haspopup / aria-expanded live on the chevron button.
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
        <div className="inline-flex rounded-md shadow-sm">
          {/* LEFT ZONE – label (modal trigger) */}
          <Button
            size="sm"
            className="rounded-r-none select-none"
            onClick={() => {
              setIsModalOpen(true)
              onBuildCustom()
            }}
            // Explicitly ensure this zone never triggers the dropdown
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            aria-label="Build a custom report"
          >
            Generate report
          </Button>

          {/* RIGHT ZONE – chevron (menu trigger) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="rounded-l-none px-2"
                aria-haspopup="menu"
                aria-expanded="false"
                style={{ pointerEvents: "auto", cursor: "pointer" }}
              >
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">More report options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleGenerateReport("executive_summary")}>
                <FileText className="mr-2 h-4 w-4" /> Generate executive summary
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleGenerateReport("comprehensive")}>
                <FileSignature className="mr-2 h-4 w-4" /> Generate comprehensive report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
                <Settings2 className="mr-2 h-4 w-4" /> Build a custom report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modal */}
      <ReportBuilderModal open={isModalOpen} onOpenChange={setIsModalOpen} surveyId={surveyId} />
    </>
  )
}
