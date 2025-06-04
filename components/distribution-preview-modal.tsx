"use client"

import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Building, Globe, Webhook } from "lucide-react"
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
  selectedDepartments: string[]
  departmentNames: string[]
  selectedPlatform: string
  webhookUrl: string
  httpMethod: string
}

export const DistributionPreviewModal: React.FC<DistributionPreviewModalProps> = ({
  open,
  onClose,
  distributionMethod,
  surveyTitle,
  selectedSegments,
  totalContacts,
  syncSchedule,
  startDate,
  endDate,
  selectedDepartments,
  departmentNames,
  selectedPlatform,
  webhookUrl,
  httpMethod,
}) => {
  const getDistributionMethodLabel = (method: string): string => {
    const labels: { [key: string]: string } = {
      representative: "Representative (Zencity managed)",
      fast: "Fast (Zencity managed)",
      "connected-crm": "Targeted/Micro-community (CRM)",
      "internal-audience": "Internal Audience",
      "self-distributed": "Self-distributed",
      "third-party": "3rd-party triggered",
    }
    return labels[method] || method
  }

  const getDistributionIcon = (method: string) => {
    switch (method) {
      case "representative":
      case "fast":
        return <Globe className="w-5 h-5 text-blue-500" />
      case "connected-crm":
        return <Users className="w-5 h-5 text-green-500" />
      case "internal-audience":
        return <Building className="w-5 h-5 text-purple-500" />
      case "self-distributed":
        return <Users className="w-5 h-5 text-orange-500" />
      case "third-party":
        return <Webhook className="w-5 h-5 text-red-500" />
      default:
        return <Globe className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getDistributionIcon(distributionMethod)}
            Distribution Preview
          </DialogTitle>
          <DialogDescription>
            Review how your survey will be distributed based on your current settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Survey Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Survey Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Survey Title:</span>
                <span className="text-gray-700">{surveyTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Distribution Method:</span>
                <Badge variant="outline">{getDistributionMethodLabel(distributionMethod)}</Badge>
              </div>
              {startDate && (
                <div className="flex justify-between">
                  <span className="font-medium">Start Date:</span>
                  <span className="text-gray-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(startDate, "MMMM d, yyyy")}
                  </span>
                </div>
              )}
              {endDate && (
                <div className="flex justify-between">
                  <span className="font-medium">End Date:</span>
                  <span className="text-gray-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(endDate, "MMMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Distribution-specific details */}
          {distributionMethod === "connected-crm" && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">CRM Configuration</h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">CRM Platform:</span>
                  <span className="text-green-700">HubSpot</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sync Schedule:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {syncSchedule === "immediate" ? "Immediate" : "Daily Digest"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Contacts:</span>
                  <span className="text-green-700 font-semibold">{totalContacts.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">Selected Segments:</span>
                  <div className="mt-2 space-y-1">
                    {selectedSegments.map((segment) => (
                      <div key={segment.id} className="flex justify-between text-sm">
                        <span>{segment.name}</span>
                        <span className="text-gray-600">{segment.contactCount} contacts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {distributionMethod === "internal-audience" && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Internal Audience Configuration</h3>
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Distribution Channels:</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">
                      Email
                    </Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">
                      Slack
                    </Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">
                      Intranet
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Target Departments:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {departmentNames.map((name, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {distributionMethod === "third-party" && selectedPlatform && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Third-party Integration</h3>
              <div className="bg-red-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Platform:</span>
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    {selectedPlatform}
                  </Badge>
                </div>
                {selectedPlatform === "Custom webhook" && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">HTTP Method:</span>
                      <span className="text-red-700 font-mono">{httpMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Webhook URL:</span>
                      <span className="text-red-700 font-mono text-sm truncate max-w-xs">{webhookUrl}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {(distributionMethod === "representative" || distributionMethod === "fast") && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Zencity Managed Distribution</h3>
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Distribution Type:</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    {distributionMethod === "representative" ? "Representative Sample" : "Fast Collection"}
                  </Badge>
                </div>
                <div className="text-sm text-blue-700">
                  {distributionMethod === "representative"
                    ? "Statistically valid, census-aligned insights with demographic balancing."
                    : "Quick-fire insights for rapid feedback collection."}
                </div>
              </div>
            </div>
          )}

          {distributionMethod === "self-distributed" && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Self-distributed</h3>
              <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                <div className="text-sm text-orange-700">
                  You'll receive a survey link to share through your own channels (email, social media, website, etc.).
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold">Distribution Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Your survey "{surveyTitle}" will be distributed using the{" "}
                <strong>{getDistributionMethodLabel(distributionMethod)}</strong> method
                {startDate && (
                  <>
                    {" "}
                    starting on <strong>{format(startDate, "MMMM d, yyyy")}</strong>
                  </>
                )}
                {distributionMethod === "connected-crm" && totalContacts > 0 && (
                  <>
                    {" "}
                    to <strong>{totalContacts.toLocaleString()} contacts</strong> across{" "}
                    <strong>
                      {selectedSegments.length} segment{selectedSegments.length !== 1 ? "s" : ""}
                    </strong>
                  </>
                )}
                {distributionMethod === "internal-audience" && departmentNames.length > 0 && (
                  <>
                    {" "}
                    to{" "}
                    <strong>
                      {departmentNames.length} department{departmentNames.length !== 1 ? "s" : ""}
                    </strong>
                  </>
                )}
                .
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">Edit Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
