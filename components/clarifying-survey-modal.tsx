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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface ClarifyingFormData {
  intent: string
  mainGoal: string
  audience: string
  timelineDate?: Date
  timelineUrgency?: string
  tags: string[]
  originalQuery: string
  uploadedFiles?: File[]
}

// Add new interface for pre-population
export interface PrePopulationData {
  suggestedIntent?: string
  suggestedMainGoal?: string
  suggestedAudience?: string
  suggestedTags?: string[]
  suggestedTimelineUrgency?: string
  suggestedTimelineDate?: Date
}

interface ClarifyingSurveyModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: ClarifyingFormData) => void
  initialQuery: string
  prePopulationData?: PrePopulationData // Add this line
}

const intentOptions = [
  "Priority Tradeoff",
  "Sentiment Analysis",
  "Needs Assessment",
  "Policy Feedback",
  "Service Evaluation",
  "Budget Allocation Preferences",
  "Community Priorities",
]

const audienceOptions = [
  { value: "representative", label: "General Public (Representative Sample)" },
  { value: "fast", label: "General Public (Fast Feedback)" },
  { value: "connected-crm", label: "Connected CRM Segments" },
  { value: "internal-audience", label: "Internal Audience (Staff/Employees)" },
  { value: "self-distributed", label: "Self-Distributed (Link Sharing)" },
]

const tagsTaxonomy = [
  "Budget & Priorities",
  "Public Safety",
  "Transportation & Mobility",
  "Climate & Sustainability",
  "Community Engagement",
  "Equity & Inclusion",
  "Infrastructure & Capital Projects",
  "Parks & Recreation",
  "Public Health",
  "Economic Development",
]

const timelineUrgencyOptions = ["ASAP", "Within 1 week", "Within 2 weeks", "Within 1 month"]

export function ClarifyingSurveyModal({
  open,
  onClose,
  onSubmit,
  initialQuery,
  prePopulationData,
}: ClarifyingSurveyModalProps) {
  const [step, setStep] = useState(1)
  const [intent, setIntent] = useState<string>("")
  const [mainGoal, setMainGoal] = useState<string>("")
  const [audience, setAudience] = useState<string>("")
  const [timelineDate, setTimelineDate] = useState<Date | undefined>()
  const [timelineUrgency, setTimelineUrgency] = useState<string>("none")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Add these new state variables for file upload
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (open) {
      // Reset all state when modal opens
      setStep(1)

      // Pre-populate fields if data is provided
      if (prePopulationData) {
        setIntent(prePopulationData.suggestedIntent || "")
        setMainGoal(prePopulationData.suggestedMainGoal || "")
        setAudience(prePopulationData.suggestedAudience || "")
        setTimelineDate(prePopulationData.suggestedTimelineDate)
        setTimelineUrgency(prePopulationData.suggestedTimelineUrgency || "none")
        setSelectedTags(prePopulationData.suggestedTags || [])
      } else {
        // Reset to empty if no pre-population data
        setIntent("")
        setMainGoal("")
        setAudience("")
        setTimelineDate(undefined)
        setTimelineUrgency("none")
        setSelectedTags([])
      }

      // Reset file upload state
      setUploadedFiles([])
      setUploadError("")
      setIsUploading(false)
    }
  }, [open, prePopulationData])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    setUploadError("")

    try {
      const validFiles: File[] = []
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      for (const file of Array.from(files)) {
        // Check file type
        if (!allowedTypes.includes(file.type)) {
          setUploadError(`"${file.name}" is not a supported file type. Please upload PDF or Word documents only.`)
          setIsUploading(false)
          return
        }

        // Check file size
        if (file.size > maxSize) {
          setUploadError(`"${file.name}" exceeds the 10MB size limit. Please choose a smaller file.`)
          setIsUploading(false)
          return
        }

        validFiles.push(file)
      }

      // Simulate upload delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUploadedFiles((prev) => [...prev, ...validFiles])
      setIsUploading(false)

      // Clear the input so the same file can be uploaded again if needed
      event.target.value = ""
    } catch (error) {
      setUploadError("An error occurred while uploading the file. Please try again.")
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadError("")
  }

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") {
      return "📄"
    } else if (file.type.includes("word") || file.type.includes("document")) {
      return "📝"
    }
    return "📎"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    }
  }

  const handleSubmit = () => {
    if (!isStep1Valid) return
    onSubmit({
      intent,
      mainGoal,
      audience: "representative", // Default audience since it's removed from UI
      timelineDate,
      timelineUrgency: timelineUrgency === "none" ? undefined : timelineUrgency,
      tags: selectedTags,
      originalQuery: initialQuery,
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined, // Add this line
    })
  }

  const isStep1Valid = intent && mainGoal.trim()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Quick Survey: Step {step} of 3</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "First, tell us about the survey's purpose and audience."
              : step === 2
                ? "Now, add some optional tags to help categorize your survey."
                : "Finally, you can upload additional context documents to help inform your survey (optional)."}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Intent, Audience, Timeline */}
        {step === 1 && (
          <div className="space-y-6 py-4 pr-6">
            <div>
              <Label htmlFor="main-goal">Main survey goal</Label>
              <Input
                id="main-goal"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                placeholder="Ask about any civic issue or decision..."
                className="mt-1 w-full"
              />
            </div>

            <div>
              <Label htmlFor="intent">Intent</Label>
              <Select value={intent} onValueChange={setIntent}>
                <SelectTrigger id="intent" className={cn("mt-1 w-full", !intent && "text-muted-foreground")}>
                  <SelectValue placeholder="Specify intent" />
                </SelectTrigger>
                <SelectContent>
                  {intentOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Timeline</Label>
              <p className="text-sm text-gray-600 mb-2">When do you need the survey results?</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="timeline-date" className="text-sm">
                    Target Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !timelineDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {timelineDate ? format(timelineDate, "PPP") : <span>Select target date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={timelineDate} onSelect={setTimelineDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="timeline-urgency" className="text-sm">
                    Urgency Level
                  </Label>
                  <Select value={timelineUrgency} onValueChange={setTimelineUrgency}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific deadline</SelectItem>
                      <SelectItem value="ASAP">ASAP</SelectItem>
                      <SelectItem value="Within 1 week">Within 1 week</SelectItem>
                      <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tags */}
        {step === 2 && (
          <div className="py-4 pr-6 flex-grow flex flex-col">
            <Label>Tags (Optional)</Label>
            <div className="flex-grow mt-1">
              <ScrollArea className="h-full rounded-md border">
                <div className="p-4 space-y-2">
                  {tagsTaxonomy.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagChange(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`} className="font-normal cursor-pointer">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Step 3: File Upload */}
        {step === 3 && (
          <div className="py-4 pr-6 flex-grow flex flex-col space-y-4">
            <div>
              <Label className="text-base font-medium">Additional Context (Optional)</Label>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Upload documents that provide additional context for your survey. This could include policy documents,
                research reports, or other relevant materials.
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="text-4xl">📁</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isUploading ? "Uploading..." : "Click to upload files"}
                    </p>
                    <p className="text-xs text-gray-500">PDF or Word documents, up to 10MB each</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3BD1BB]"></div>
                <span>Processing file...</span>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-start">
                  <div className="text-red-400 mr-2">⚠️</div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Upload Error</h4>
                    <p className="text-sm text-red-700 mt-1">{uploadError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Uploaded Files ({uploadedFiles.length})</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className="text-lg">{getFileIcon(file)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <div className="flex items-center text-green-600">
                          <span className="text-sm mr-1">✓</span>
                          <span className="text-xs">Uploaded</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="ml-2 h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-start">
                <div className="text-blue-400 mr-2">💡</div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Tips for better results</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Include relevant policy documents or research reports</li>
                    <li>• Upload meeting minutes or stakeholder feedback</li>
                    <li>• Add any background materials that provide context</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStep1Valid}
                className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white"
              >
                Next
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
                Next
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isStep1Valid || isUploading}
                className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white"
              >
                Generate Survey Draft
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
