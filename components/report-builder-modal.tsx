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
import { GripVertical, PlusCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

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
}

export function ReportBuilderModal({ open, onOpenChange }: ReportBuilderModalProps) {
  const { toast } = useToast()
  const [selectedWidgets, setSelectedWidgets] = useState<ReportWidget[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after a short delay to allow for closing animation
    setTimeout(() => {
      setSelectedWidgets([])
    }, 300)
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

  const handleGenerateReport = () => {
    if (selectedWidgets.length === 0) {
      toast({
        title: "No Widgets Selected",
        description: "Please add at least one widget to generate a report.",
        variant: "destructive",
      })
      return
    }

    handleClose()

    toast({
      title: "Report Generation Started",
      description: "Your report is being generated and will be available in the reports section.",
    })
  }

  const isWidgetSelected = (widgetId: string) => !!selectedWidgets.find((w) => w.id === widgetId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl h-[700px] flex flex-col p-0"
        onEscapeKeyDown={handleClose}
        onPointerDownOutside={handleClose}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Build Your Report</DialogTitle>
          <DialogDescription>Add, remove, and reorder widgets to customize your report.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-0 px-6">
          {/* Left Panel: Available Widgets */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Available Widgets</h3>
            <ScrollArea className="flex-grow pr-4 -mr-4">
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
            </ScrollArea>
          </div>

          {/* Right Panel: Selected Widgets */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Your Report ({selectedWidgets.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-2">
                  {selectedWidgets.length > 0 ? (
                    selectedWidgets.map((widget) => (
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
                        <span className="font-medium flex-grow">{widget.name}</span>
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
        <DialogFooter className="p-6 bg-background border-t mt-4 relative z-10">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport} disabled={selectedWidgets.length === 0}>
            Generate Report
          </Button>
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
