"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, FileText, FileSignature, Settings2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ReportActionsProps {
  surveyId: string
  onBuildCustom: () => void
}

export function ReportActions({ surveyId, onBuildCustom }: ReportActionsProps) {
  const { toast } = useToast()

  const handleGenerateReport = async (type: "executive_summary" | "comprehensive") => {
    const toastMessages = {
      executive_summary: "Generating executive summary report. It will be saved in the Reports section.",
      comprehensive: "Generating comprehensive report. It will be saved in the Reports section.",
    }

    toast({
      description: toastMessages[type],
      duration: 5000,
    })

    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, surveyId }),
      })
      // Optionally handle success, though the toast provides user feedback
    } catch (error) {
      console.error(`Failed to generate ${type} report:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        duration: 5000,
      })
    }
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <div className="flex rounded-md shadow-sm">
          <Button onClick={() => handleGenerateReport("executive_summary")} className="rounded-r-none" size="sm">
            Generate Report
          </Button>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="rounded-l-none px-2">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">More report options</span>
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleGenerateReport("executive_summary")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Generate executive summary</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleGenerateReport("comprehensive")}>
            <FileSignature className="mr-2 h-4 w-4" />
            <span>Generate comprehensive report</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onBuildCustom}>
            <Settings2 className="mr-2 h-4 w-4" />
            <span>Build a custom report</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
