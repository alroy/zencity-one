"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, Target } from "lucide-react"
import { format } from "date-fns"

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
  selectedSegments: CRMSegment[]
  totalContacts: number
  syncSchedule: string
  startDate?: Date
  endDate?: Date
}

export function DistributionPreviewModal({
  open,
  onClose,
  distributionMethod,
  surveyTitle,
  selectedSegments,
  totalContacts,
  syncSchedule,
  startDate,
  endDate,
}: DistributionPreviewModalProps) {
  const getMethodDisplayName = (method: string) => {
    const methodNames: { [key: string]: string } = {
      representative: "Representative (Zencity managed)",
      fast: "Fast (Zencity managed)",
      "connected-crm": "Connected CRM",
      "internal-audience": "Internal Audience",
      "self-distributed": "Self-distributed",
      "third-party": "3rd-party triggered",
    }
    return methodNames[method] || method
  }

  const getMethodDescription = (method: string) => {
    const descriptions: { [key: string]: string } = {
      representative: "Statistically valid, census-aligned insights with professional distribution management",
      fast: "Quick-fire insights for rapid feedback with accelerated distribution",
      "connected-crm": "Leverage your existing CRM segments for seamless targeting",
      "internal-audience": "Survey your staff to measure satisfaction and engagement",
      "self-distributed": "Share through your own channels with full control",
      "third-party": "Automate feedback collection via external platforms",
    }
    return descriptions[method] || ""
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Distribution Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Survey Overview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Survey Overview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-base mb-2">{surveyTitle}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>Adams County, Sheriff Department</span>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Method */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Distribution Method</h3>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">
                  {getMethodDisplayName(distributionMethod)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{getMethodDescription(distributionMethod)}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              {startDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Start:</span>
                  <span className="font-medium">{format(startDate, "MMM d, yyyy")}</span>
                </div>
              )}
              {endDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">End:</span>
                  <span className="font-medium">{format(endDate, "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Audience Details */}
          {distributionMethod === "connected-crm" && selectedSegments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Target Audience</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Total Contacts:</span>
                  <span className="font-medium">{totalContacts.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">Selected Segments:</p>
                  {selectedSegments.map((segment) => (
                    <div key={segment.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                      <span>{segment.name}</span>
                      <span className="text-gray-500">{segment.contactCount} contacts</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Sync Schedule:</span>
                  <span className="font-medium capitalize">{syncSchedule.replace("-", " ")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Representative Method Details */}
          {distributionMethod === "representative" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Distribution Details</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Target Sample Size:</span>
                    <span className="font-medium">1,000 responses</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Geographic Coverage:</span>
                    <span className="font-medium">City-wide</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Distribution Duration:</span>
                    <span className="font-medium">1 month</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fast Method Details */}
          {distributionMethod === "fast" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Distribution Details</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Expected Response Time:</span>
                    <span className="font-medium">24-48 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Target Sample Size:</span>
                    <span className="font-medium">1,000 responses</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Distribution Method:</span>
                    <span className="font-medium">Accelerated outreach</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">Confirm & Publish</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
