"use client"

import { useState, useEffect } from "react"
import { SurveyList } from "@/components/survey-list"
import { SurveyTemplateModal } from "@/components/survey-template-modal"
import { SurveySettings } from "@/components/survey-settings"
import { PageHeader } from "@/components/page-header"

interface SurveyManagerProps {
  initialOptions?: {
    showTemplateModal?: boolean
    templateFilter?: string[]
    templateNames?: Record<string, string>
    surveyTitle?: string
  }
}

export function SurveyManager({ initialOptions }: SurveyManagerProps) {
  const [view, setView] = useState<"list" | "template" | "settings">("list")
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateFilter, setTemplateFilter] = useState<string[] | undefined>(undefined)
  const [templateNames, setTemplateNames] = useState<Record<string, string> | undefined>(undefined)
  const [surveyTitle, setSurveyTitle] = useState<string | undefined>(undefined)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined)

  // Initialize with any passed options
  useEffect(() => {
    if (initialOptions) {
      if (initialOptions.showTemplateModal) {
        setShowTemplateModal(true)
      }
      if (initialOptions.templateFilter) {
        setTemplateFilter(initialOptions.templateFilter)
      }
      if (initialOptions.templateNames) {
        setTemplateNames(initialOptions.templateNames)
      }
      if (initialOptions.surveyTitle) {
        setSurveyTitle(initialOptions.surveyTitle)
      }
    }
  }, [initialOptions])

  const handleCreateNew = () => {
    setTemplateFilter(undefined) // Reset filter for normal creation
    setTemplateNames(undefined) // Reset custom names
    setShowTemplateModal(true)
  }

  const handleSelectTemplate = (templateId: string) => {
    // Find the template name based on the ID
    const templateName = getTemplateNameById(templateId)
    setSelectedTemplate(templateName)
    setShowTemplateModal(false)
    setView("settings")
  }

  const handleEditSurvey = (surveyId: number) => {
    setView("settings")
  }

  const handleBack = () => {
    setView("list")
  }

  const handleSave = () => {
    // Handle save logic
    setView("list")
  }

  // Helper function to get template name by ID
  const getTemplateNameById = (templateId: string): string => {
    // First check if we have a custom name for this template
    if (templateNames && templateNames[templateId]) {
      return templateNames[templateId]
    }

    // Otherwise use the default mapping
    const templates = [
      { id: "community-survey", name: "Community Survey" },
      { id: "blockwise", name: "Blockwise" },
      { id: "experience-survey", name: "Experience Survey" },
      { id: "pulse", name: "Pulse" },
      { id: "engagement", name: "Engagement" },
      { id: "transportation", name: "Transportation City Meter" },
      { id: "health-wellbeing", name: "Health and Wellbeing" },
      { id: "city-pulse", name: "City Pulse" },
      { id: "police-engagement", name: "Police Engagement" },
      { id: "parks-survey", name: "City Parks Survey" },
      { id: "whats-your-view", name: "What's Your View On..." },
      { id: "custom-survey", name: "Custom Survey" },
      { id: "quick-pulse", name: "Quick Pulse" },
      { id: "mini-survey", name: "Mini Survey" },
    ]

    const template = templates.find((t) => t.id === templateId)
    return template ? template.name : "Community Survey" // Default fallback
  }

  const breadcrumbItems = [
    { label: "Engagement Manager", path: "engagement-manager", isClickable: false },
    { label: "Survey Manager", isCurrent: true },
  ]

  if (view === "settings") {
    return (
      <div className="p-6 pt-0">
        <SurveySettings
          onBack={handleBack}
          onSave={handleSave}
          initialTitle={surveyTitle}
          templateName={selectedTemplate}
        />
      </div>
    )
  }

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="Survey Manager"
        description="Create and manage community surveys"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="mt-8">
        <SurveyList onCreateNew={handleCreateNew} onEditSurvey={handleEditSurvey} />

        <SurveyTemplateModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleSelectTemplate}
          templateFilter={templateFilter}
          templateNames={templateNames}
        />
      </div>
    </div>
  )
}
