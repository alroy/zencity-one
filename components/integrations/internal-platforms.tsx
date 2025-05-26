"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Platform {
  id: string
  name: string
  isConnected: boolean
  expanded?: boolean
  fields?: { label: string; key: string; type: string; value?: string }[]
}

export function InternalPlatforms() {
  const { toast } = useToast()
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "email",
      name: "Organization Email",
      isConnected: true,
      fields: [
        { label: "Email Domain", key: "domain", type: "text" },
        { label: "API Key", key: "apiKey", type: "password" },
      ],
    },
    {
      id: "hubspot",
      name: "HubSpot",
      isConnected: true,
      fields: [
        { label: "API Key", key: "apiKey", type: "password" },
        { label: "Hub ID", key: "hubId", type: "text" },
      ],
    },
    {
      id: "siebel",
      name: "Siebel CRM",
      isConnected: false,
      fields: [
        { label: "Instance URL", key: "url", type: "text" },
        { label: "Username", key: "username", type: "text" },
        { label: "Password", key: "password", type: "password" },
      ],
    },
    {
      id: "pipedrive",
      name: "Pipedrive",
      isConnected: false,
      fields: [
        { label: "API Token", key: "apiToken", type: "password" },
        { label: "Company Domain", key: "domain", type: "text" },
      ],
    },
    {
      id: "sap",
      name: "SAP",
      isConnected: false,
      fields: [
        { label: "SAP Host", key: "host", type: "text" },
        { label: "Client", key: "client", type: "text" },
        { label: "Username", key: "username", type: "text" },
        { label: "Password", key: "password", type: "password" },
      ],
    },
    {
      id: "slack",
      name: "Slack",
      isConnected: true,
      fields: [
        { label: "Workspace URL", key: "workspace", type: "text" },
        { label: "Bot Token", key: "token", type: "password" },
      ],
    },
    {
      id: "teams",
      name: "MS Teams",
      isConnected: false,
      fields: [
        { label: "Tenant ID", key: "tenantId", type: "text" },
        { label: "Client ID", key: "clientId", type: "text" },
        { label: "Client Secret", key: "clientSecret", type: "password" },
      ],
    },
    {
      id: "zoom",
      name: "Zoom",
      isConnected: false,
      fields: [
        { label: "API Key", key: "apiKey", type: "text" },
        { label: "API Secret", key: "apiSecret", type: "password" },
      ],
    },
  ])

  const [disconnectDialog, setDisconnectDialog] = useState<{ open: boolean; platformId: string | null }>({
    open: false,
    platformId: null,
  })

  const toggleExpand = (id: string) => {
    setPlatforms(
      platforms.map((platform) => {
        if (platform.id === id) {
          return { ...platform, expanded: !platform.expanded }
        } else {
          return { ...platform, expanded: false }
        }
      }),
    )
  }

  const updateField = (platformId: string, fieldKey: string, value: string) => {
    setPlatforms(
      platforms.map((platform) => {
        if (platform.id === platformId) {
          return {
            ...platform,
            fields: platform.fields?.map((field) => {
              if (field.key === fieldKey) {
                return { ...field, value }
              }
              return field
            }),
          }
        }
        return platform
      }),
    )
  }

  const handleConnect = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId)
    if (!platform) return

    if (platform.isConnected) {
      // Open disconnect dialog
      setDisconnectDialog({ open: true, platformId })
    } else if (platform.expanded) {
      // Submit connection form
      setPlatforms(
        platforms.map((p) => {
          if (p.id === platformId) {
            return { ...p, isConnected: true, expanded: false }
          }
          return p
        }),
      )
      toast({
        title: "Integration Connected",
        description: `${platform.name} has been successfully connected.`,
        duration: 3000,
      })
    } else {
      // Expand the form
      toggleExpand(platformId)
    }
  }

  const handleDisconnect = () => {
    if (!disconnectDialog.platformId) return

    setPlatforms(
      platforms.map((platform) => {
        if (platform.id === disconnectDialog.platformId) {
          return {
            ...platform,
            isConnected: false,
            fields: platform.fields?.map((field) => ({ ...field, value: undefined })),
          }
        }
        return platform
      }),
    )

    setDisconnectDialog({ open: false, platformId: null })

    const platform = platforms.find((p) => p.id === disconnectDialog.platformId)
    if (platform) {
      toast({
        title: "Integration Disconnected",
        description: `${platform.name} has been disconnected.`,
        duration: 3000,
      })
    }
  }

  const cancelConnect = (platformId: string) => {
    setPlatforms(
      platforms.map((platform) => {
        if (platform.id === platformId) {
          return { ...platform, expanded: false }
        }
        return platform
      }),
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Internal Platforms</h1>
      <p className="text-gray-500 mb-6">Connect your internal organization platforms</p>

      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-medium">{platform.name}</h3>
                <p className="text-sm text-gray-500">
                  {platform.isConnected ? (
                    <span className="flex items-center text-green-600">
                      <Check className="w-3 h-3 mr-1" /> Connected
                    </span>
                  ) : (
                    "Not connected"
                  )}
                </p>
              </div>
              <Button
                variant={platform.isConnected ? "outline" : "default"}
                className={platform.isConnected ? "text-red-500 border-red-200 hover:bg-red-50" : ""}
                onClick={() => handleConnect(platform.id)}
              >
                {platform.isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>

            {platform.expanded && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="space-y-4">
                  {platform.fields?.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={`${platform.id}-${field.key}`}>{field.label}</Label>
                      <Input
                        id={`${platform.id}-${field.key}`}
                        type={field.type}
                        value={field.value || ""}
                        onChange={(e) => updateField(platform.id, field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={() => cancelConnect(platform.id)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleConnect(platform.id)}>Connect {platform.name}</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={disconnectDialog.open} onOpenChange={(open) => setDisconnectDialog({ ...disconnectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Disconnect Integration
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect {platforms.find((p) => p.id === disconnectDialog.platformId)?.name}?
              This will remove all associated data and settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisconnectDialog({ open: false, platformId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
