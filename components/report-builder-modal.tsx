"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { GripVertical, PlusCircle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ReportWidget {
  id: string
  name: string
  description: string
}

const dashboardWidgets: ReportWidget[] = [
  {
    id: "top-insights",
    name: "Top Insights",
    description: "Key takeaways and summary.",
  },
  {
    id: "overall-results",
    name: "Overall Results",
    description: "Aggregated results overview.",
  },
  {
    id: "results-by-measure",
    name: "Results by Measure",
    description: "Breakdown by specific measures.",
  },
  {
    id: "priority-matrix",
    name: "Priority Matrix",
    description: "Visualize importance vs. performance.",
  },
]

const advancedWidgets: ReportWidget[] = [
  {
    id: "demographic-breakdown",
    name: "Demographic Breakdown",
    description: "Filter results by demographics.",
  },
  {
    id: "trend-analysis",
    name: "Trend Analysis",
    description: "Compare results over time.",
  },
  {
    id: "geographic-heat-map",
    name: "Geographic Heat Map",
    description: "Visualize data on a map.",
  },
  {
    id: "sentiment-analysis",
    name: "Sentiment Analysis",
    description: "Analyze sentiment from open text.",
  },
]

interface ReportBuilderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  surveyId: string | null
  onSaveSuccess: (reportId: string) => void
}

export function ReportBuilderModal({ open, onOpenChange, surveyId, onSaveSuccess }: ReportBuilderModalProps) {
  const { toast } = useToast()
  const [selectedWidgets, setSelectedWidgets] = useState<ReportWidget[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<"pdf" | "slides">("pdf")
  const [isSaving, setIsSaving] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (isSaving) return // Prevent closing while saving
    onOpenChange(isOpen)
    if (!isOpen) {
      // Reset state on close
      setTimeout(() => {
        setSelectedWidgets([])
        setDraggedItem(null)
        setOutputFormat("pdf")
      }, 300)
    }
  }

  const addWidget = (widget: ReportWidget) => {
    if (!selectedWidgets.find((w) => w.id === widget.id)) {
      setSelectedWidgets((prev) => [...prev, widget])
    }
  }

  const removeWidget = (widgetId: string) => {
    setSelectedWidgets((prev) => prev.filter((w) => w.id !== widgetId))
  }

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

    const draggedIndex = selectedWidgets.findIndex((item) => item.id === draggedItem)
    const targetIndex = selectedWidgets.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newOrder = [...selectedWidgets]
    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)

    setSelectedWidgets(newOrder)
    setDraggedItem(null)
  }

  const handleSaveReport = async () => {
    if (!surveyId || isSaving) return
    if (selectedWidgets.length === 0) {
      toast({
        title: "No Widgets Selected",
        description: "Please add at least one widget to save a report.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    const reportConfig = {
      type: "custom",
      surveyId,
      widgets: selectedWidgets.map((w) => w.id),
      format: outputFormat,
    }

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportConfig),
      })

      if (!response.ok) {
        throw new Error("Save failed")
      }

      const result = await response.json()
      const reportId = result.id

      // Close this modal and trigger the parent's success handler
      onOpenChange(false)
      onSaveSuccess(reportId)
    } catch (error) {
      console.error("Failed to save custom report:", error)
      toast({
        title: "Save Failed",
        description: "Could not save the report configuration. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isWidgetSelected = (widgetId: string) => !!selectedWidgets.find((w) => w.id === widgetId)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle>Build Your Report</DialogTitle>
          <DialogDescription>Add, remove, and reorder widgets to customize your report.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 px-6 overflow-hidden">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0">
              <CardTitle>Available Widgets</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="pr-4">
                  <Accordion type="multiple" defaultValue={["dashboard", "advanced"]} className="w-full">
                    <AccordionItem value="dashboard">
                      <AccordionTrigger>Dashboard Widgets</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {dashboardWidgets.map((widget) => (
                          <WidgetCard
                            key={widget.id}
                            widget={widget}
                            onAdd={addWidget}
                            isSelected={isWidgetSelected(widget.id)}
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="advanced">
                      <AccordionTrigger>Advanced Widgets</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {advancedWidgets.map((widget) => (
                          <WidgetCard
                            key={widget.id}
                            widget={widget}
                            onAdd={addWidget}
                            isSelected={isWidgetSelected(widget.id)}
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0">
              <CardTitle>
                Your {outputFormat === "pdf" ? "Report" : "Slides"} ({selectedWidgets.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-2">
                  {selectedWidgets.length > 0 ? (
                    selectedWidgets.map((widget, index) => (
                      <div
                        key={widget.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, widget.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, widget.id)}
                        className={cn(
                          "flex items-center p-3 border rounded-md bg-gray-50 cursor-grab active:cursor-grabbing transition-all",
                          draggedItem === widget.id && "opacity-50 scale-105 shadow-lg",
                        )}
                      >
                        <GripVertical className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                        <div className="flex-grow flex items-center">
                          {outputFormat === "slides" && (
                            <span className="text-sm font-normal text-gray-500 mr-2 w-14 shrink-0">
                              Slide {index + 1}:
                            </span>
                          )}
                          <span className="font-medium">{widget.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeWidget(widget.id)}>
                          <XCircle className="h-5 w-5 text-gray-500 hover:text-destructive" />
                          <span className="sr-only">Remove {widget.name}</span>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-sm text-gray-500 border-2 border-dashed rounded-lg p-4">
                      <p>Add widgets from the left to build your report.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="p-6 bg-background border-t flex-shrink-0 flex-col-reverse sm:flex-row sm:justify-between gap-4">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-sm font-medium text-gray-700">Output Format:</span>
            <ToggleGroup
              type="single"
              defaultValue="pdf"
              value={outputFormat}
              onValueChange={(value: "pdf" | "slides") => {
                if (value) setOutputFormat(value)
              }}
              aria-label="Report output format"
              disabled={isSaving}
            >
              <ToggleGroupItem value="pdf" aria-label="PDF">
                PDF
              </ToggleGroupItem>
              <ToggleGroupItem value="slides" aria-label="Slides">
                Slides
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveReport} disabled={selectedWidgets.length === 0 || isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Report"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function WidgetCard({
  widget,
  onAdd,
  isSelected,
}: {
  widget: ReportWidget
  onAdd: (widget: ReportWidget) => void
  isSelected: boolean
}) {
  return (
    <div className="p-3 border rounded-lg flex items-center gap-3 bg-white">
      <div className="flex-grow">
        <p className="font-semibold">{widget.name}</p>
        <p className="text-sm text-gray-500">{widget.description}</p>
      </div>
      <Button variant="outline" size="sm" onClick={() => onAdd(widget)} disabled={isSelected} className="shrink-0">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  )
}
