"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // Import Badge component
import { ChevronLeft } from "lucide-react"

interface SurveyTemplate {
  id: string
  name: string
  icon: string
  byline: string
  label?: string // Added optional label property
}

interface SurveyTemplateModalProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: SurveyTemplate) => void
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
  const [filteredTemplates, setFilteredTemplates] = useState<SurveyTemplate[]>([])
  const [showingAllTemplates, setShowingAllTemplates] = useState(false)
  const [originalFilteredTemplates, setOriginalFilteredTemplates] = useState<SurveyTemplate[]>([])

  const allTemplates: SurveyTemplate[] = [
    {
      id: "community-survey",
      name: "Community Survey",
      icon: "/images/community-interaction-1.png",
      byline: "Gauge overall resident satisfaction and priorities.",
    },
    {
      id: "blockwise",
      name: "Blockwise",
      icon: "/city-blocks-map-illustration.png",
      byline: "Gather localized feedback on a block-by-block basis.",
    },
    {
      id: "experience-survey",
      name: "Experience Survey",
      icon: "/images/community-interaction-2.png",
      byline: "Measure resident experiences with specific city services.",
    },
    {
      id: "pulse",
      name: "Pulse",
      icon: "/pulse-survey-illustration.png",
      byline: "Quickly check in on community sentiment on a single topic.",
    },
    {
      id: "engagement",
      name: "Engagement",
      icon: "/images/community-engagement-park.png",
      byline: "Assess the effectiveness of your community engagement efforts.",
    },
    {
      id: "transportation",
      name: "Transportation City Meter",
      icon: "/transportation-survey-illustration.png",
      byline: "Understand transportation habits and infrastructure needs.",
    },
    {
      id: "health-wellbeing",
      name: "Health and Wellbeing",
      icon: "/images/community-agreement.png",
      byline: "Explore community health concerns and wellness priorities.",
    },
    {
      id: "city-pulse",
      name: "City Pulse",
      icon: "/city-pulse-illustration.png",
      byline: "A recurring survey to track community sentiment over time.",
    },
    {
      id: "police-engagement",
      name: "Police Engagement",
      icon: "/images/police-trust-dialogue.png",
      byline: "Measure trust and perception of local law enforcement.",
    },
    {
      id: "parks-survey",
      name: "City Parks Survey",
      icon: "/parks-recreation-illustration.png",
      byline: "Collect feedback on park usage, quality, and improvements.",
    },
    {
      id: "whats-your-view",
      name: "What's Your View On...",
      icon: "/images/opinion-poll-clipboard.png",
      byline: "A flexible template for any specific issue or proposal.",
    },
    {
      id: "call-center-experience",
      name: "Call Center Experience",
      icon: "/images/call-center-experience.png",
      byline: "Post-call satisfaction and resolution tracking.",
      label: "PIS",
    },
    {
      id: "law-enforcement-interaction",
      name: "Law Enforcement Interaction",
      icon: "/images/law-enforcement-interaction.png",
      byline: "Post-incident feedback for police interactions with built-in sensitivity filters.",
      label: "PIS",
    },
    {
      id: "quick-pulse",
      name: "Quick Pulse",
      icon: "/pulse-survey-concept.png",
      byline: "A very short, fast survey for immediate feedback.",
    },
    {
      id: "mini-survey",
      name: "Mini Survey",
      icon: "/images/mini-survey-review.png",
      byline: "A brief survey with a few questions on a focused topic.",
    },
    {
      id: "custom-survey",
      name: "Custom Survey",
      icon: "/custom-form-illustration.png",
      byline: "Start from scratch and build your own survey.",
    },
  ]

  // Filter templates when templateFilter changes or modal opens
  useEffect(() => {
    setShowingAllTemplates(false)

    if (templateFilter && templateFilter.length > 0) {
      let filtered = allTemplates.filter((template) => templateFilter.includes(template.id))

      // Apply custom template names if provided
      if (templateNames) {
        filtered.forEach((template) => {
          if (templateNames[template.id]) {
            template.name = templateNames[template.id]
          }
        })
      }

      // Ensure Custom Survey is always last
      filtered = sortTemplatesWithCustomLast(filtered)

      setFilteredTemplates(filtered)
      setOriginalFilteredTemplates([...filtered]) // Store original filtered templates
    } else {
      const sorted = sortTemplatesWithCustomLast([...allTemplates])
      setFilteredTemplates(sorted)
      setOriginalFilteredTemplates([...sorted])
    }
  }, [templateFilter, templateNames, open])

  // Helper function to ensure Custom Survey is always last
  const sortTemplatesWithCustomLast = (templates: SurveyTemplate[]) => {
    const customSurveyIndex = templates.findIndex((t) => t.id === "custom-survey")
    if (customSurveyIndex !== -1) {
      const customSurvey = templates.splice(customSurveyIndex, 1)[0]
      templates.push(customSurvey)
    }
    return templates
  }

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleNext = () => {
    if (selectedTemplate) {
      const templateObject = allTemplates.find((t) => t.id === selectedTemplate)
      if (templateObject) {
        onSelectTemplate(templateObject)
      }
    }
  }

  const handleClose = () => {
    setSelectedTemplate(null)
    setShowingAllTemplates(false)
    onClose()
  }

  const handleViewAllTemplates = () => {
    setShowingAllTemplates(true)
    setFilteredTemplates(sortTemplatesWithCustomLast([...allTemplates]))
  }

  const handleBackToFiltered = () => {
    setShowingAllTemplates(false)
    setFilteredTemplates(originalFilteredTemplates)
  }

  const isFiltered = templateFilter && templateFilter.length > 0 && templateFilter.length < allTemplates.length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center">
            {showingAllTemplates && (
              <Button variant="ghost" size="sm" className="mr-2 p-0 h-8 w-8" onClick={handleBackToFiltered}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to recommended templates</span>
              </Button>
            )}
            <DialogTitle>{showingAllTemplates ? "All Templates" : "Choose a template"}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-6 overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow overflow-hidden ${
                  selectedTemplate === template.id
                    ? "border-[#3BD1BB] ring-2 ring-[#3BD1BB]/50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleTemplateClick(template.id)}
              >
                <div className="h-32 bg-gray-100">
                  <img
                    src={template.icon || "/placeholder.svg?width=200&height=128&query=survey+template"}
                    alt={`${template.name} template icon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    {template.label && (
                      <Badge variant="outline" className="text-xs bg-sky-100 text-sky-700 border-sky-200">
                        {template.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{template.byline}</p>
                </div>
              </Card>
            ))}
          </div>

          {isFiltered && !showingAllTemplates && (
            <div className="mt-6 ml-1">
              <Button
                variant="link"
                className="text-[#3BD1BB] hover:text-[#2ab19e] p-0 h-auto font-medium"
                onClick={handleViewAllTemplates}
              >
                View all templates
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
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
