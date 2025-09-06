"use client"

import { useState, useEffect } from "react"
import { SurveyList, type Survey } from "@/components/survey-list"
import { SurveyTemplateModal } from "@/components/survey-template-modal"
import { SurveySettings } from "@/components/survey-settings"
import PageHeader from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import {
  ClarifyingSurveyModal,
  type ClarifyingFormData,
  type PrePopulationData,
} from "@/components/clarifying-survey-modal"
import { SurveyPreviewModal } from "@/components/survey-preview-modal"
import { SurveyResultsPlaceholder } from "@/components/survey-results-placeholder"
import { LayoutTemplate, Calendar, Share2 } from "lucide-react"
import type { Question } from "@/components/questionnaire-builder"
import type { GeneratedSurveyData } from "@/components/survey-preview-modal"
import { ReportBuilderModal } from "@/components/report-builder-modal"
import { ReportActions } from "@/components/report-actions"
import { cn } from "@/lib/utils"

/* ───────────────────────────────────────────────────────── helpers ── */

const statusMap = {
  draft: { label: "Draft", className: "bg-yellow-200 text-yellow-900" },
  published: { label: "Published", className: "bg-blue-200 text-blue-900" },
  distribution: { label: "Distribution", className: "bg-[#3BD1BB] text-white" },
  closed: { label: "Closed", className: "bg-[#FC7753] text-white" },
  canceled: { label: "Canceled", className: "bg-gray-200 text-gray-900" },
} as const

function StatusBadge({ status }: { status: keyof typeof statusMap }) {
  const cfg = statusMap[status]
  return <Badge className={cn(cfg.className)}>{cfg.label}</Badge>
}

const distNames: Record<string, string> = {
  representative: "Representative",
  fast: "Fast",
  "connected-crm": "Connected CRM",
  "internal-audience": "Internal Audience",
  "self-distributed": "Self-distributed",
  "third-party": "3rd-party",
}

/* ───────────────────────────────────────────────────────── types ──── */

export interface SurveyManagerProps {
  initialOptions?: {
    showTemplateModal?: boolean
    templateFilter?: string[]
    templateNames?: Record<string, string>
    surveyTitle?: string
    generatedSurvey?: GeneratedSurveyData
  }
}

/* ───────────────────────────────────────────────────────── component ─ */

export function SurveyManager({ initialOptions }: SurveyManagerProps) {
  /* ----- core state ----- */
  const [view, setView] = useState<"list" | "settings" | "build" | "survey-details">("list")
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)

  /* ----- creation flow state ----- */
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showClarifyingModal, setShowClarifyingModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const [templateFilter, setTemplateFilter] = useState<string[]>()
  const [templateNames, setTemplateNames] = useState<Record<string, string>>()

  /* ----- builder / settings state ----- */
  const [surveyTitle, setSurveyTitle] = useState<string>()
  const [selectedTemplate, setSelectedTemplate] = useState<string>()
  const [initialDistributionForSettings, setInitialDistributionForSettings] = useState<string>()
  const [initialQuestionsForBuilder, setInitialQuestionsForBuilder] = useState<Question[]>()
  const [isPISTemplate, setIsPISTemplate] = useState(false)

  /* ----- AI flow ----- */
  const [generatedSurveyData, setGeneratedSurveyData] = useState<GeneratedSurveyData>()
  const [clarifyingQuery, setClarifyingQuery] = useState("")
  const [prePopulationData, setPrePopulationData] = useState<PrePopulationData>()

  /* ----- new state ----- */
  const [showReportBuilderModal, setShowReportBuilderModal] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)

  /* ----- effects ----- */
  useEffect(() => {
    if (!initialOptions) return
    if (initialOptions.showTemplateModal) setShowTemplateModal(true)
    if (initialOptions.templateFilter) setTemplateFilter(initialOptions.templateFilter)
    if (initialOptions.templateNames) setTemplateNames(initialOptions.templateNames)
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
  }, [initialOptions])

  /* ──────────────────── handler helpers ─ */

  const handleCreateNew = () => {
    setTemplateFilter(undefined)
    setTemplateNames(undefined)
    setShowTemplateModal(true)
  }

  const handleCreateFromScratch = () => {
    setSelectedTemplate("Custom Survey")
    setSurveyTitle("Untitled Survey")
    setInitialDistributionForSettings(undefined)
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
    setIsPISTemplate(false)
    setView("build")
    setShowTemplateModal(false)
  }

  const handleGenerateWithAI = () => {
    setClarifyingQuery("")
    setPrePopulationData(undefined)
    setShowClarifyingModal(true)
  }

  const handleBuildReportClick = (surveyId: string) => {
    setSelectedSurveyId(surveyId)
    setIsReportModalOpen(true)
  }

  /* Template selection */
  const handleSelectTemplate = (template: { id: string; name: string; label?: string }) => {
    const displayName = templateNames?.[template.id] ?? template.name
    setSelectedTemplate(displayName)
    setSurveyTitle(displayName)
    setShowTemplateModal(false)

    if (template.label === "PIS") {
      // Pre-set distribution & go straight to builder
      setInitialDistributionForSettings("third-party")
      setIsPISTemplate(true)
      setView("build")
    } else {
      setIsPISTemplate(false)
      setView("settings")
    }
  }

  /* AI clarifying modal submit */
  const handleClarifyingModalSubmit = (data: ClarifyingFormData) => {
    // -- Simplified fake generation logic (replace w/ real API later)
    const surveyData: GeneratedSurveyData = {
      title: `${data.intent.split(" ")[0]} Survey`,
      goal: `Generated goal for ${data.intent}`,
      distributionMethod: data.audience,
      questions: [
        {
          id: "q1",
          type: "rating",
          text: `Rate how you feel about ${data.originalQuery}`,
          options: [
            { value: "1", label: "Poor" },
            { value: "5", label: "Excellent" },
          ],
          label: "1",
          labelType: "number",
        },
        {
          id: "completion",
          type: "completion",
          title: "Done!",
          completionText: "Thanks!",
          label: "C",
          labelType: "char",
        },
      ],
      originalQuery: data.originalQuery,
      clarifyingFormData: data,
    }

    setGeneratedSurveyData(surveyData)
    setShowClarifyingModal(false)
    setShowPreviewModal(true)
  }

  const openBuilderFromPreview = () => {
    if (!generatedSurveyData) return
    setSurveyTitle(generatedSurveyData.title)
    setSelectedTemplate("AI Generated")
    setInitialDistributionForSettings(generatedSurveyData.distributionMethod)
    setInitialQuestionsForBuilder(generatedSurveyData.questions)
    setIsPISTemplate(false)
    setShowPreviewModal(false)
    setGeneratedSurveyData(undefined)
    setView("build")
  }

  /* Breadcrumb click */
  const handleBreadcrumb = (path: string) => {
    if (path === "all-surveys") {
      setView("list")
      setSelectedSurvey(null)
    }
  }

  /* ──────────────────── RENDERING ──────────────────── */

  /* Settings / Builder */
  if (view === "settings" || view === "build") {
    return (
      <div className="p-6">
        <SurveySettings
          onBack={() => {
            setView("list")
            setSelectedSurvey(null)
          }}
          onSave={() => {
            setView("list")
            setSelectedSurvey(null)
          }}
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

  /* Survey details */
  if (view === "survey-details" && selectedSurvey) {
    return (
      <>
        <div className="p-6 space-y-6">
          <PageHeader
            title={selectedSurvey.title}
            breadcrumbItems={[
              { label: "Survey Manager", path: "survey-manager", isClickable: false },
              { label: "All Surveys", path: "all-surveys", isClickable: true },
              { label: selectedSurvey.title, isCurrent: true },
            ]}
            onNavigate={handleBreadcrumb}
            actions={
              <ReportActions surveyId={selectedSurvey.id} onBuildCustom={() => setShowReportBuilderModal(true)} />
            }
          />

          {/* meta row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 border-b pb-4">
            <StatusBadge status={selectedSurvey.status as keyof typeof statusMap} />
            <span className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4 text-gray-500" />
              {selectedSurvey.template}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              {selectedSurvey.cadence}
            </span>
            <span className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-gray-500" />
              {distNames[selectedSurvey.distribution] ?? selectedSurvey.distribution}
            </span>
            <span className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full ${selectedSurvey.createdBy.color} text-white text-xs flex items-center justify-center`}
              >
                {selectedSurvey.createdBy.initials}
              </span>
              Created on {selectedSurvey.createdOn}
            </span>
          </div>

          <SurveyResultsPlaceholder />
        </div>

        {selectedSurvey && (
          <ReportBuilderModal
            open={showReportBuilderModal}
            onOpenChange={setShowReportBuilderModal}
            surveyId={selectedSurvey.id}
          />
        )}
      </>
    )
  }

  /* Default list view */
  return (
    <div className="p-6">
      <PageHeader
        title="All Surveys"
        description="Create and manage community surveys"
        breadcrumbItems={[
          { label: "Survey Manager", path: "survey-manager", isClickable: false },
          { label: "All Surveys", isCurrent: true },
        ]}
      />

      <div className="mt-8">
        <SurveyList
          onCreateNew={handleCreateNew}
          onCreateFromScratch={handleCreateFromScratch}
          onGenerateWithAI={handleGenerateWithAI}
          onEditSurvey={() => {}}
          onViewSurvey={(s) => {
            setSelectedSurvey(s)
            setView("survey-details")
          }}
        />
      </div>

      {/* Modals used across views */}
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
        onOpenBuilder={openBuilderFromPreview}
      />
    </div>
  )
}

/* Provide both named and default exports */
export default SurveyManager
