"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CheckCircle2, Calendar, Users, Link2, Globe } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface CRMSegment {
  id: string
  name: string
  contactCount: number
  selected: boolean
}

interface DistributionPreviewModalProps {
  open: boolean
  onClose: () => void
  distributionMethod: string
  surveyTitle: string
  selectedSegments?: CRMSegment[]
  totalContacts?: number
  syncSchedule?: string
  startDate?: Date | null
  endDate?: Date | null
  selectedDepartments?: string[]
  departmentNames?: string[]
  selectedPlatform?: string
  webhookUrl?: string
  httpMethod?: string
}

export function DistributionPreviewModal({
  open,
  onClose,
  distributionMethod,
  surveyTitle,
  selectedSegments = [],
  totalContacts = 0,
  syncSchedule = "",
  startDate,
  endDate,
  selectedDepartments = [],
  departmentNames = [],
  selectedPlatform = "",
  webhookUrl = "",
  httpMethod = "",
}: DistributionPreviewModalProps) {
  const getDistributionMethodLabel = (method: string): string => {
    const methods: Record<string, string> = {
      representative: "Representative (Zencity managed)",
      fast: "Fast (Zencity managed)",
      "connected-crm": "Targeted/Micro-community (CRM)",
      "internal-audience": "Internal Audience",
      "self-distributed": "Self-distributed",
      "third-party": "3rd-party triggered",
    }
    return methods[method] || method
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Distribution Preview</DialogTitle>
          <DialogDescription>
            This is a preview of how your survey will be distributed based on your current settings.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Survey Title</h3>
            <p className="font-medium">{surveyTitle || "Untitled Survey"}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Distribution Method</h3>
            <Badge variant="outline" className="font-normal">
              {getDistributionMethodLabel(distributionMethod)}
            </Badge>
          </div>

          {(startDate || endDate) && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  {startDate && `Starts: ${format(startDate, "MMMM d, yyyy")}`}
                  {startDate && endDate && " • "}
                  {endDate && `Ends: ${format(endDate, "MMMM d, yyyy")}`}
                  {!startDate && endDate && `Ends: ${format(endDate, "MMMM d, yyyy")}`}
                </span>
              </div>
            </div>
          )}

          {distributionMethod === "connected-crm" && selectedSegments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">CRM Segments</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Users className="h-3 w-3 mr-1" />
                    {totalContacts} contacts
                  </Badge>
                </div>
                <ul className="space-y-1 text-sm">
                  {selectedSegments.map((segment) => (
                    <li key={segment.id} className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>
                        {segment.name} ({segment.contactCount} contacts)
                      </span>
                    </li>
                  ))}
                </ul>
                {syncSchedule && (
                  <div className="text-sm">
                    <span className="text-gray-500">Sync Schedule:</span> {syncSchedule}
                  </div>
                )}
              </div>
            </>
          )}

          {distributionMethod === "internal-audience" && selectedDepartments && selectedDepartments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Target Departments</h3>
                <ul className="space-y-1 text-sm">
                  {selectedDepartments.map((dept, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>{dept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {distributionMethod === "third-party" && selectedPlatform && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Platform Integration</h3>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>{selectedPlatform}</span>
                </div>
                {webhookUrl && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Link2 className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-700 break-all">{webhookUrl}</span>
                  </div>
                )}
                {httpMethod && (
                  <div className="text-sm">
                    <span className="text-gray-500">HTTP Method:</span> {httpMethod}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
