"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HealthStatus {
  id: string
  name: string
  status: "healthy" | "warning" | "error"
  lastSync: string
  message?: string
}

export function IntegrationHealth() {
  const { toast } = useToast()

  const healthStatuses: HealthStatus[] = [
    {
      id: "email",
      name: "Organization Email",
      status: "healthy",
      lastSync: "2023-05-25T14:30:00Z",
    },
    {
      id: "pipedrive",
      name: "Pipedrive",
      status: "healthy",
      lastSync: "2023-05-25T15:45:00Z",
    },
    {
      id: "slack",
      name: "Slack",
      status: "warning",
      lastSync: "2023-05-24T09:15:00Z",
      message: "API rate limit exceeded. Will retry in 30 minutes.",
    },
    {
      id: "civicplus",
      name: "CivicPlus",
      status: "healthy",
      lastSync: "2023-05-25T16:20:00Z",
    },
    {
      id: "hey311",
      name: "Hey311",
      status: "warning",
      lastSync: "2023-05-24T11:30:00Z",
      message: "Authentication token expired. Please renew.",
    },
  ]

  const healthyConnections = healthStatuses.filter((status) => status.status === "healthy").length
  const warningConnections = healthStatuses.filter((status) => status.status === "warning").length

  const handleViewDetails = () => {
    toast({
      title: "Health Details",
      description: "Detailed health information would be displayed here.",
      duration: 3000,
    })
  }

  const handleTroubleshoot = () => {
    toast({
      title: "Troubleshooting",
      description: "Troubleshooting wizard would be launched here.",
      duration: 3000,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Integration Health</h1>
      <p className="text-gray-500 mb-6">Monitor the status of your connected platforms</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Healthy Connections
            </CardTitle>
            <CardDescription>All systems operational</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{healthyConnections}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Connections Requiring Attention
            </CardTitle>
            <CardDescription>Issues that need to be addressed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{warningConnections}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4 mb-8">
        <Button variant="outline" onClick={handleViewDetails} className="flex items-center">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button variant="outline" onClick={handleTroubleshoot} className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Troubleshoot
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Connected Platforms Status</h2>
      <div className="space-y-4">
        {healthStatuses.map((status) => (
          <div key={status.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  {status.status === "healthy" ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  )}
                  <h3 className="font-medium">{status.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">Last synced: {formatDate(status.lastSync)}</p>
                {status.message && (
                  <p className="text-sm text-amber-600 mt-2 bg-amber-50 p-2 rounded">{status.message}</p>
                )}
              </div>
              {status.status === "warning" && (
                <Button size="sm" variant="outline" onClick={handleTroubleshoot}>
                  Fix
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
