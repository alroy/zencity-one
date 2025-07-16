"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface PostSaveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportId: string | null
}

export function PostSaveModal({ open, onOpenChange, reportId }: PostSaveModalProps) {
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!reportId) return
    setIsDownloading(true)

    toast({
      description: "Your download is starting…",
      duration: 3000,
    })

    try {
      const response = await fetch(`/api/reports/${reportId}/download`)
      if (!response.ok) {
        throw new Error("Download failed")
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${reportId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "Could not download the report. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report saved</DialogTitle>
          <DialogDescription>
            Your report has been generated and saved in the Reports section. You can download it now or access it later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            OK
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Download report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
