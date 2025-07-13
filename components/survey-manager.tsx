"use client"

import { useState, useEffect } from "react"
import { SurveyList } from "@/components/survey-list"
import { SurveyTemplateModal } from "@/components/survey-template-modal"
import { SurveySettings } from "@/components/survey-settings"
import { PageHeader } from "@/components/page-header"
import type { GeneratedSurveyData } from "@/components/survey-preview-modal"
import type { Question } from "@/components/questionnaire-builder"
import {
  ClarifyingSurveyModal,
  type ClarifyingFormData,
  type PrePopulationData,
} from "@/components/clarifying-survey-modal"
import { SurveyPreviewModal } from "@/components/survey-preview-modal"

interface SurveyManagerProps {
  initialOptions?: {
    showTemplateModal?: boolean
    templateFilter?: string[]
    templateNames?: Record<string, string>
    surveyTitle?: string
    generatedSurvey?: GeneratedSurveyData
  }
}

export function SurveyManager({ initialOptions }: SurveyManagerProps) {
  const [view, setView] = useState<"list" | "template" | "settings" | "build">("list")
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateFilter, setTemplateFilter] = useState<string[] | undefined>(undefined)
  const [templateNames, setTemplateNames] = useState<Record<string, string> | undefined>(undefined)
  const [surveyTitle, setSurveyTitle] = useState<string | undefined>(undefined)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined)
  const [initialDistributionForSettings, setInitialDistributionForSettings] = useState<string | undefined>(undefined)
  const [isPISTemplate, setIsPISTemplate] = useState(false)
  const [initialQuestionsForBuilder, setInitialQuestionsForBuilder] = useState<Question[] | undefined>(undefined)

  // State for AI flow
  const [showClarifyingModal, setShowClarifyingModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [clarifyingQuery, setClarifyingQuery] = useState("")
  const [generatedSurveyData, setGeneratedSurveyData] = useState<GeneratedSurveyData | undefined>(undefined)
  const [prePopulationData, setPrePopulationData] = useState<PrePopulationData | undefined>(undefined)

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
      if (initialOptions.surveyTitle && !initialOptions.generatedSurvey) {
        setSurveyTitle(initialOptions.surveyTitle)
      }
      if (initialOptions.generatedSurvey) {
        const { title, distributionMethod, questions } = initialOptions.generatedSurvey
        setSurveyTitle(title)
        setSelectedTemplate(title)
        setInitialDistributionForSettings(distributionMethod)
        setInitialQuestionsForBuilder(questions)
        setIsPISTemplate(false)
        setView("build")
      }
    }
  }, [initialOptions])

  const handleCreateNew = () => {
    setTemplateFilter(undefined)
    setTemplateNames(undefined)
    setShowTemplateModal(true)
  }

  const handleCreateFromScratch = () => {
    setSelectedTemplate("Custom Survey")
    setSurveyTitle("Untitled Survey")
    setShowTemplateModal(false)
    setInitialDistributionForSettings(undefined)
    setIsPISTemplate(false)
    setInitialQuestionsForBuilder([
      {
        id: "completion_custom",
        type: "completion",
        title: "You're all done!",
        completionText:
          "Thank you for taking the time to fill out this survey. We value your thoughts and look forward to reviewing your feedback.",
        label: "C",
        labelType: "char",
      },
    ])
    setView("build")
  }

  const handleGenerateWithAI = () => {
    setClarifyingQuery("")
    setPrePopulationData(undefined)
    setShowClarifyingModal(true)
  }

  interface SurveyTemplate {
    id: string
    name: string
    icon: string
    byline: string
    label?: string
  }

  const handleSelectTemplate = (template: SurveyTemplate) => {
    const templateDisplayName = templateNames?.[template.id] || template.name
    setSelectedTemplate(templateDisplayName)
    setSurveyTitle(templateDisplayName)
    setShowTemplateModal(false)

    if (template.label === "PIS") {
      setInitialDistributionForSettings("third-party")
      setIsPISTemplate(true)
      setView("build")
    } else {
      setInitialDistributionForSettings(undefined)
      setIsPISTemplate(false)
      setView("settings")
    }
  }

  const handleClarifyingModalSubmit = (formData: ClarifyingFormData) => {
    const { intent, audience, tags, originalQuery, uploadedFiles } = formData

    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log(
        "Uploaded files for survey context:",
        uploadedFiles.map((f) => f.name),
      )
    }

    let topic = "General Topic"
    const lowerQuery = originalQuery.toLowerCase()

    if (lowerQuery.includes("transportation") || lowerQuery.includes("transit")) topic = "Public Transit"
    else if (lowerQuery.includes("bike")) topic = "Bike Lanes"
    else if (lowerQuery.includes("engagement")) topic = "Community Engagement"
    else if (tags.length > 0) topic = tags[0]
    else if (originalQuery) topic = originalQuery

    const intentKeyword = intent.split(" ")[0]
    const generatedTitle = `${topic} ${intentKeyword} Survey`
    const generatedGoal = `To understand ${intent.toLowerCase()} regarding "${originalQuery}" from the ${audience.replace("-", " ")} audience.`

    const sampleQuestions: Question[] = [
      {
        id: "gen_q1",
        type: "rating",
        text: `On a scale of 1-5, how important is the issue of "${originalQuery}" to you?`,
        options: [
          { value: "1", label: "1 - Not important" },
          { value: "5", label: "5 - Very important" },
        ],
        label: "1",
        labelType: "number",
      },
      {
        id: "gen_q2",
        type: "open-ended",
        text: `What are your primary concerns or suggestions related to "${originalQuery}"?`,
        label: "2",
        labelType: "number",
      },
      {
        id: "completion_generated",
        type: "completion",
        title: "Thank You!",
        completionText: "Your feedback is valuable to us.",
        label: "C",
        labelType: "char",
      },
    ]

    const surveyData: GeneratedSurveyData = {
      title: generatedTitle,
      goal: generatedGoal,
      distributionMethod: audience,
      questions: sampleQuestions,
      originalQuery: formData.originalQuery,
      clarifyingFormData: formData,
    }

    setGeneratedSurveyData(surveyData)
    setShowClarifyingModal(false)
    setShowPreviewModal(true)
  }

  const handleOpenBuilderFromPreview = () => {
    if (generatedSurveyData) {
      const { title, distributionMethod, questions } = generatedSurveyData
      setSurveyTitle(title)
      setSelectedTemplate("AI Generated")
      setInitialDistributionForSettings(distributionMethod)
      setInitialQuestionsForBuilder(questions)
      setIsPISTemplate(false)
      setView("build")
      setShowPreviewModal(false)
      setGeneratedSurveyData(undefined)
    }
  }

  const handleEditSurvey = (surveyId: number) => {
    setView("settings")
  }

  const handleBack = () => {
    setView("list")
  }

  const handleSave = () => {
    setView("list")
  }

  const breadcrumbItems = [
    { label: "Survey Manager", path: "survey-manager", isClickable: false },
    { label: "All Surveys", isCurrent: true },
  ]

  if (view === "settings" || view === "build") {
    return (
      <div className="p-6 pt-0">
        <SurveySettings
          onBack={handleBack}
          onSave={handleSave}
          initialTitle={surveyTitle}
          templateName={selectedTemplate}
          initialDistributionMethod={initialDistributionForSettings}
          initialView={view}
          isPISTemplate={isPISTemplate}
          initialQuestions={initialQuestionsForBuilder}
        />
      </div>
    )
  }

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="All Surveys"
        description="Create and manage community surveys"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="mt-8">
        <SurveyList
          onCreateNew={handleCreateNew}
          onEditSurvey={handleEditSurvey}
          onCreateFromScratch={handleCreateFromScratch}
          onGenerateWithAI={handleGenerateWithAI}
        />

        <SurveyTemplateModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleSelectTemplate}
          templateFilter={templateFilter}
          templateNames={templateNames}
        />

        <ClarifyingSurveyModal
          open={showClarifyingModal}
          onClose={() => setShowClarifyingModal(false)}
          onSubmit={handleClarifyingModalSubmit}
          initialQuery={clarifyingQuery}
          prePopulationData={prePopulationData}
        />
        <SurveyPreviewModal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          surveyData={generatedSurveyData}
          onOpenBuilder={handleOpenBuilderFromPreview}
        />
      </div>
    </div>
  )
}
