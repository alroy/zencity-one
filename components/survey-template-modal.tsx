"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"

interface SurveyTemplateModalProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: string) => void
  templateFilter?: string[]
  templateNames?: Record<string, string>
}

export function SurveyTemplateModal({
  open,
  onClose,
  onSelectTemplate,
  templateFilter,
  templateNames,
}: SurveyTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [filteredTemplates, setFilteredTemplates] = useState<typeof allTemplates>([])
  const [showingAllTemplates, setShowingAllTemplates] = useState(false)
  const [originalFilteredTemplates, setOriginalFilteredTemplates] = useState<typeof allTemplates>([])

  const allTemplates = [
    {
      id: "community-survey",
      name: "Community Survey",
      icon: "/community-survey.png",
    },
    {
      id: "blockwise",
      name: "Blockwise",
      icon: "/city-blocks-map-illustration.png",
    },
    {
      id: "experience-survey",
      name: "Experience Survey",
      icon: "/people-conversation-illustration.png",
    },
    {
      id: "pulse",
      name: "Pulse",
      icon: "/pulse-survey-illustration.png",
    },
    {
      id: "engagement",
      name: "Engagement",
      icon: "/community-engagement.png",
    },
    {
      id: "transportation",
      name: "Transportation City Meter",
      icon: "/city-blocks-map-illustration.png", // Reusing city blocks image
    },
    {
      id: "health-wellbeing",
      name: "Health and Wellbeing",
      icon: "/people-conversation-illustration.png", // Reusing people conversation image
    },
    {
      id: "city-pulse",
      name: "City Pulse",
      icon: "/pulse-survey-illustration.png", // Reusing pulse survey image
    },
    {
      id: "police-engagement",
      name: "Police Engagement",
      icon: "/police-community-illustration.png",
    },
    {
      id: "parks-survey",
      name: "City Parks Survey",
      icon: "/community-survey.png", // Reusing community survey image
    },
    {
      id: "whats-your-view",
      name: "What's Your View On...",
      icon: "/opinion-poll-illustration.png",
    },
    {
      id: "custom-survey",
      name: "Custom Survey",
      icon: "/custom-form-illustration.png",
    },
    {
      id: "quick-pulse",
      name: "Quick Pulse",
      icon: "/pulse-survey-illustration.png",
    },
    {
      id: "mini-survey",
      name: "Mini Survey",
      icon: "/opinion-poll-illustration.png",
    },
  ]

  // Filter templates when templateFilter changes or modal opens
  useEffect(() => {
    setShowingAllTemplates(false)

    if (templateFilter && templateFilter.length > 0) {
      const filtered = allTemplates.filter((template) => templateFilter.includes(template.id))

      // Apply custom template names if provided
      if (templateNames) {
        filtered.forEach((template) => {
          if (templateNames[template.id]) {
            template.name = templateNames[template.id]
          }
        })
      }

      setFilteredTemplates(filtered)
      setOriginalFilteredTemplates([...filtered]) // Store original filtered templates
    } else {
      setFilteredTemplates(allTemplates)
      setOriginalFilteredTemplates([...allTemplates])
    }
  }, [templateFilter, templateNames, open])

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleNext = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
    }
  }

  const handleClose = () => {
    setSelectedTemplate(null)
    setShowingAllTemplates(false)
    onClose()
  }

  const handleViewAllTemplates = () => {
    setShowingAllTemplates(true)
    setFilteredTemplates(allTemplates)
  }

  const handleBackToFiltered = () => {
    setShowingAllTemplates(false)
    setFilteredTemplates(originalFilteredTemplates)
  }

  const isFiltered = templateFilter && templateFilter.length > 0 && templateFilter.length < allTemplates.length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            {showingAllTemplates && (
              <Button variant="ghost" size="sm" className="mr-2 p-0 h-8 w-8" onClick={handleBackToFiltered}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to recommended templates</span>
              </Button>
            )}
            <DialogTitle>
              {showingAllTemplates ? "All Templates" : "Create a new survey: Choose a template"}
            </DialogTitle>
          </div>
          {isFiltered && !showingAllTemplates && (
            <Button
              variant="link"
              className="text-[#3BD1BB] hover:text-[#2ab19e] p-0 h-auto"
              onClick={handleViewAllTemplates}
            >
              View all templates
            </Button>
          )}
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-6 overflow-y-auto max-h-[60vh] pr-2">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer hover:shadow-lg transition-shadow p-4 
                ${
                  selectedTemplate === template.id
                    ? "border-[#3BD1BB] ring-2 ring-[#3BD1BB]/50"
                    : "border-[#3BD1BB]/20 hover:border-[#3BD1BB]/50"
                }`}
              onClick={() => handleTemplateClick(template.id)}
            >
              <div className="aspect-video mb-3 bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={template.icon || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-center font-medium">{template.name}</h3>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white"
            disabled={!selectedTemplate}
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
