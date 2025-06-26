"use client"

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

export interface ClarifyingFormData {
  intent: string
  audience: string
  timelineDate?: Date
  timelineUrgency?: string
  tags: string[]
  originalQuery: string
}

interface ClarifyingSurveyModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: ClarifyingFormData) => void
  initialQuery: string
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

export function ClarifyingSurveyModal({ open, onClose, onSubmit, initialQuery }: ClarifyingSurveyModalProps) {
  const [step, setStep] = useState(1)
  const [intent, setIntent] = useState<string>("")
  const [audience, setAudience] = useState<string>("")
  const [timelineDate, setTimelineDate] = useState<Date | undefined>()
  const [timelineUrgency, setTimelineUrgency] = useState<string>("none")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      // Reset all state when modal opens
      setStep(1)
      setIntent("")
      setAudience("")
      setTimelineDate(undefined)
      setTimelineUrgency("none")
      setSelectedTags([])
    }
  }, [open])

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleNext = () => {
    if (isStep1Valid) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = () => {
    if (!isStep1Valid) return
    onSubmit({
      intent,
      audience,
      timelineDate,
      timelineUrgency: timelineUrgency === "none" ? undefined : timelineUrgency,
      tags: selectedTags,
      originalQuery: initialQuery,
    })
  }

  const isStep1Valid = intent && audience

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Quick Survey: Step {step} of 2</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "First, tell us about the survey's purpose and audience."
              : "Now, add some optional tags to help categorize your survey."}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Intent, Audience, Timeline */}
        {step === 1 && (
          <div className="space-y-6 py-4 pr-6">
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
              <Label htmlFor="audience">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience" className={cn("mt-1 w-full", !audience && "text-muted-foreground")}>
                  <SelectValue placeholder="Choose the right audience" />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Timeline (Optional)</Label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !timelineDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {timelineDate ? format(timelineDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={timelineDate} onSelect={setTimelineDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={timelineUrgency} onValueChange={setTimelineUrgency}>
                  <SelectTrigger className={cn("mt-1 w-full", timelineUrgency === "none" && "text-muted-foreground")}>
                    <SelectValue placeholder="Or select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No deadline</SelectItem>
                    {timelineUrgencyOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button
                onClick={handleSubmit}
                disabled={!isStep1Valid}
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
