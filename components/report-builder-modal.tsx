"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Define widget types
const dashboardWidgets = [
  { id: "top-insights", name: "Top Insights" },
  { id: "overall-results", name: "Overall Results" },
  { id: "results-by-measure", name: "Results by Measure" },
  { id: "priority-matrix", name: "Priority Matrix" },
]

const advancedWidgets = [
  { id: "advanced-a", name: "Advanced Widget A" },
  { id: "advanced-b", name: "Advanced Widget B" },
  { id: "advanced-c", name: "Advanced Widget C" },
  { id: "advanced-d", name: "Advanced Widget D" },
]

interface ReportWidget {
  id: string
  name: string
}

interface ReportBuilderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportBuilderModal({ open, onOpenChange }: ReportBuilderModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([])
  const [selectedAdvancedWidgets, setSelectedAdvancedWidgets] = useState<string[]>([])
  const [widgetOrder, setWidgetOrder] = useState<ReportWidget[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after a short delay to allow for closing animation
    setTimeout(() => {
      setStep(1)
      setSelectedWidgets([])
      setSelectedAdvancedWidgets([])
      setWidgetOrder([])
    }, 300)
  }

  const handleNext = () => {
    if (step === 1 && selectedWidgets.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one widget to continue.",
        variant: "destructive",
      })
      return
    }
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setStep((s) => s - 1)
  }

  const toggleWidget = (widgetId: string, isAdvanced = false) => {
    const state = isAdvanced ? selectedAdvancedWidgets : selectedWidgets
    const setState = isAdvanced ? setSelectedAdvancedWidgets : setSelectedWidgets
    if (state.includes(widgetId)) {
      setState(state.filter((id) => id !== widgetId))
    } else {
      setState([...state, widgetId])
    }
  }

  // Initialize widgetOrder when moving to step 3
  useEffect(() => {
    if (step === 3) {
      const allSelectedIds = [...selectedWidgets, ...selectedAdvancedWidgets]
      const currentOrderIds = widgetOrder.map((w) => w.id)

      // Only update if the selection has changed to preserve user's ordering
      if (JSON.stringify(allSelectedIds.sort()) !== JSON.stringify(currentOrderIds.sort())) {
        const allWidgetsMap = [...dashboardWidgets, ...advancedWidgets].reduce(
          (acc, w) => {
            acc[w.id] = w.name
            return acc
          },
          {} as Record<string, string>,
        )

        setWidgetOrder(allSelectedIds.map((id) => ({ id, name: allWidgetsMap[id] })))
      }
    }
  }, [step, selectedWidgets, selectedAdvancedWidgets, widgetOrder])

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    if (!draggedItem) return

    const draggedIndex = widgetOrder.findIndex((item) => item.id === draggedItem)
    const targetIndex = widgetOrder.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newOrder = [...widgetOrder]
    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)

    setWidgetOrder(newOrder)
    setDraggedItem(null)
  }

  const handleGenerateReport = () => {
    const config = { widgets: widgetOrder.map((w) => w.id) }
    console.log("Generating report with config:", config)
    toast({
      title: "Report Generated",
      description: "Your report configuration has been submitted.",
    })
    handleClose()
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Step 1: Select Dashboard Widgets</DialogTitle>
              <DialogDescription>
                Choose the core widgets to include in your report. You must select at least one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {dashboardWidgets.map((widget) => (
                <Card
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id)}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedWidgets.includes(widget.id) && "ring-2 ring-primary",
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Checkbox checked={selectedWidgets.includes(widget.id)} readOnly />
                    <span className="font-medium">{widget.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={selectedWidgets.length === 0}>
                Next
              </Button>
            </DialogFooter>
          </>
        )
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Step 2: Select Advanced Widgets</DialogTitle>
              <DialogDescription>Optionally, add any of these advanced widgets to your report.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {advancedWidgets.map((widget) => (
                <Card
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id, true)}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedAdvancedWidgets.includes(widget.id) && "ring-2 ring-primary",
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Checkbox checked={selectedAdvancedWidgets.includes(widget.id)} readOnly />
                    <span className="font-medium">{widget.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </DialogFooter>
          </>
        )
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Step 3: Reorder Widgets</DialogTitle>
              <DialogDescription>Drag and drop the widgets to set their order in the final report.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              {widgetOrder.map((widget) => (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, widget.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, widget.id)}
                  className={cn(
                    "flex items-center p-3 border rounded-md bg-gray-50 cursor-grab active:cursor-grabbing transition-opacity",
                    draggedItem === widget.id && "opacity-50",
                  )}
                >
                  <GripVertical className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">{widget.name}</span>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </DialogFooter>
          </>
        )
      case 4:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Step 4: Generate Report</DialogTitle>
              <DialogDescription>Review your selections and their order, then generate the report.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <h4 className="font-semibold mb-2 text-gray-800">Selected Widgets (in order):</h4>
              <ul className="list-decimal list-inside space-y-2 bg-gray-50 p-4 rounded-md border">
                {widgetOrder.map((widget) => (
                  <li key={widget.id} className="font-medium">
                    {widget.name}
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleGenerateReport}>Generate Report</Button>
            </DialogFooter>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]" onEscapeKeyDown={handleClose} onPointerDownOutside={handleClose}>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  )
}
