"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Clock, Mail, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface DistributionPreviewModalProps {
  open: boolean
  onClose: () => void
  distributionMethod: string
  surveyTitle: string
  selectedSegments: Array<{
    id: string
    name: string
    contactCount: number
  }>
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
  const getDistributionMethodLabel = () => {
    const methods: Record<string, string> = {
      representative: "Representative (Zencity managed)",
      fast: "Fast (Zencity managed)",
      "connected-crm": "Connected CRM",
      "self-distributed": "Self-distributed",
      "third-party": "3rd-party triggered",
    }
    return methods[distributionMethod] || distributionMethod
  }

  const getSyncScheduleLabel = () => {
    return syncSchedule === "immediate"
      ? "Immediate (send as contacts are added to HubSpot lists)"
      : "Daily Digest (batch send once per day at 9:00 AM)"
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Distribution Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Survey Title */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Survey</h3>
            <p className="text-lg font-semibold">{surveyTitle}</p>
          </div>

          {/* Distribution Method */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Distribution Method</h3>
            <Badge className="bg-[#3BD1BB]/10 text-[#3BD1BB] border-[#3BD1BB]/20">{getDistributionMethodLabel()}</Badge>
          </div>

          {/* Timeline */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Calendar className="h-4 w-4 mr-2 text-[#3BD1BB]" />
                <h3 className="font-medium">Distribution Timeline</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{startDate ? format(startDate, "MMMM d, yyyy") : "Not set"}</span>
                </div>
                {endDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{format(endDate, "MMMM d, yyyy")}</span>
                  </div>
                )}
                {distributionMethod === "connected-crm" && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sync Schedule:</span>
                    <span className="font-medium">{getSyncScheduleLabel()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recipients */}
          {distributionMethod === "connected-crm" && selectedSegments.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#3BD1BB]" />
                    <h3 className="font-medium">Recipients</h3>
                  </div>
                  <Badge variant="secondary">{totalContacts} total contacts</Badge>
                </div>
                <div className="space-y-2">
                  {selectedSegments.map((segment) => (
                    <div key={segment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">{segment.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{segment.contactCount} contacts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Distribution Details */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Mail className="h-4 w-4 mr-2 text-[#3BD1BB]" />
                <h3 className="font-medium">Distribution Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                {distributionMethod === "connected-crm" && (
                  <>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2 text-gray-400" />
                      <span className="text-gray-600">
                        {syncSchedule === "immediate"
                          ? "Surveys will be sent immediately as new contacts are added to selected HubSpot lists"
                          : "Surveys will be batched and sent once daily at 9:00 AM local time"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-gray-400" />
                      <span className="text-gray-600">
                        Duplicate contacts across HubSpot lists will receive only one survey
                      </span>
                    </div>
                  </>
                )}
                {distributionMethod === "representative" && (
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      Zencity will manage distribution to ensure statistically valid, census-aligned results
                    </span>
                  </div>
                )}
                {distributionMethod === "fast" && (
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      Zencity will rapidly distribute surveys for quick feedback collection
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white" onClick={onClose}>
            Confirm Distribution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
