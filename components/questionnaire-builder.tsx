"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ContentSidebar } from "@/components/content-sidebar"

// Export Question type for use in other components
export interface Question {
  id: string
  type: "rating" | "completion" | "multiple-choice" | "open-ended" | "introduction" // Added introduction type
  text?: string
  options?: { value: string; label: string }[]
  title?: string
  completionText?: string
  label: string
  labelType: "number" | "char"
}

const defaultInitialQuestions: Question[] = [
  {
    id: "q1",
    type: "rating",
    text: "How easy was it to find the information you were looking for?",
    options: [
      { value: "1", label: "1 - Very difficult" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5 - Very easy" },
    ],
    label: "1",
    labelType: "number",
  },
  {
    id: "q2",
    type: "rating",
    text: "How useful was this information to you?",
    options: [
      { value: "1", label: "1 - Not useful" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5 - Very useful" },
    ],
    label: "2",
    labelType: "number",
  },
  {
    id: "completion",
    type: "completion",
    title: "You're all done!",
    completionText:
      "Thank you so much for taking the time to fill out this survey. We value your thoughts and look forward to reviewing your feedback.",
    label: "C",
    labelType: "char",
  },
]

interface QuestionnaireBuilderProps {
  initialQuestions?: Question[]
}

export function QuestionnaireBuilder({ initialQuestions: initialQuestionsProp }: QuestionnaireBuilderProps) {
  const questionsToRender =
    initialQuestionsProp && initialQuestionsProp.length > 0 ? initialQuestionsProp : defaultInitialQuestions

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {questionsToRender.map((question) => (
          <div key={question.id} className="relative">
            <Badge
              variant="secondary"
              className="absolute -top-3 left-4 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 border-purple-200"
            >
              {question.label === "I" && <span className="font-normal text-purple-600">Introduction</span>}
              {question.labelType === "number" ? question.label : ""}
              {question.label === "C" && <span className="font-normal text-purple-600">Completion End Page</span>}
              {question.labelType === "char" && question.label !== "C" && question.label !== "I" ? question.label : ""}
            </Badge>
            <Card className="pt-6">
              <CardContent>
                {(question.type === "completion" || question.type === "introduction") && (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{question.title}</h3>
                    <p className="text-gray-600">{question.completionText}</p>
                  </>
                )}
                {question.type === "rating" && (
                  <>
                    <p className="font-medium mb-4">{question.text}</p>
                    <RadioGroup>
                      {question.options?.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                          <Label htmlFor={`${question.id}-${option.value}`} className="font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </>
                )}
                {question.type === "multiple-choice" && (
                  <>
                    <p className="font-medium mb-4">{question.text}</p>
                    <RadioGroup>
                      {question.options?.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                          <Label htmlFor={`${question.id}-${option.value}`} className="font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </>
                )}
                {question.type === "open-ended" && (
                  <>
                    <p className="font-medium mb-4">{question.text}</p>
                    <textarea
                      className="w-full p-2 border rounded-md text-sm"
                      rows={3}
                      placeholder="Type your answer here..."
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="w-full md:w-72">
        <ContentSidebar />
      </div>
    </div>
  )
}
