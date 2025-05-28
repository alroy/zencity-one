"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, LinkIcon, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DistributionPreviewModal } from "@/components/distribution-preview-modal"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type SurveySettingsProps = {
  onBack: () => void
  onSave: () => void
  initialTitle?: string
  templateName?: string
}

interface CRMSegment {
  id: string
  name: string
  contactCount: number
  selected: boolean
}

interface Department {
  id: string
  name: string
}

interface Directory {
  id: string
  name: string
  icon: React.ReactNode
  status: "connected" | "disconnected" | "pending"
  lastSynced?: string
  userCount?: number
}

const SurveySettings: React.FC<SurveySettingsProps> = ({ onBack, onSave, initialTitle, templateName }) => {
  const { toast } = useToast()
  const [distributionMethod, setDistributionMethod] = useState("representative")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [customParameters, setCustomParameters] = useState([{ key: "", value: "" }])
  const [httpHeaders, setHttpHeaders] = useState([{ name: "", value: "" }])
  const [httpMethod, setHttpMethod] = useState("POST")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [selectedCadence, setSelectedCadence] = useState("one-time")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [augmentWithZencity, setAugmentWithZencity] = useState(false)

  // CRM-specific state
  const [syncSchedule, setSyncSchedule] = useState("immediate")
  const [crmSegments, setCrmSegments] = useState<CRMSegment[]>([
    { id: "1", name: "Newsletter Subscribers", contactCount: 1287, selected: false },
    { id: "2", name: "Downtown Business Owners", contactCount: 128, selected: false },
    { id: "3", name: "Community Leaders", contactCount: 56, selected: false },
    { id: "4", name: "Recent Survey Participants", contactCount: 215, selected: false },
    { id: "5", name: "Artists", contactCount: 310, selected: false },
  ])
  const [segmentError, setSegmentError] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Internal Audience state
  const [departments, setDepartments] = useState<Department[]>([
    { id: "public-works", name: "Public Works" },
    { id: "parks-recreation", name: "Parks and Recreation" },
    { id: "fire-department", name: "Fire Department" },
    { id: "planning-zoning", name: "Planning and Zoning" },
    { id: "finance", name: "Finance" },
    { id: "housing-community", name: "Housing and Community Development" },
  ])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [departmentError, setDepartmentError] = useState(false)

  // Directory Integration state
  const [directories, setDirectories] = useState<Directory[]>([
    {
      id: "azure-ad",
      name: "Azure Active Directory",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0078D4">
          <path d="M12 2L2 6v12l10 4 10-4V6L12 2zm0 4.3l6 2.4v6.6l-6 2.4-6-2.4V8.7l6-2.4z" />
        </svg>
      ),
      status: "disconnected",
    },
    {
      id: "okta",
      name: "Okta",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00297A">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
        </svg>
      ),
      status: "disconnected",
    },
    {
      id: "ldap",
      name: "LDAP",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#333333">
          <path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm2 4v12h12V6H6z" />
        </svg>
      ),
      status: "disconnected",
    },
    {
      id: "google-workspace",
      name: "Google Workspace",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
            fill="#4285F4"
          />
        </svg>
      ),
      status: "disconnected",
    },
  ])
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null)
  const [showDirectoryModal, setShowDirectoryModal] = useState(false)
  const [directoryConnectStep, setDirectoryConnectStep] = useState(1)
  const [directoryCredentials, setDirectoryCredentials] = useState({
    clientId: "",
    clientSecret: "",
    tenantId: "",
    domain: "",
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Add state for editable fields
  const [surveyTitle, setSurveyTitle] = useState(initialTitle || "Adams County, Community Survey")
  const [internalTitle, setInternalTitle] = useState("")
  const [sampleSize, setSampleSize] = useState("1000")

  // Update title when initialTitle changes
  useEffect(() => {
    if (initialTitle) {
      setSurveyTitle(initialTitle)
    }
  }, [initialTitle])

  // Simulate connection progress
  useEffect(() => {
    if (isConnecting) {
      const timer = setInterval(() => {
        setConnectionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            setIsConnecting(false)

            // Simulate successful connection
            if (selectedDirectory && Math.random() > 0.2) {
              // 80% success rate for demo
              setDirectories((prev) =>
                prev.map((dir) =>
                  dir.id === selectedDirectory
                    ? {
                        ...dir,
                        status: "connected",
                        lastSynced: new Date().toISOString(),
                        userCount: Math.floor(Math.random() * 500) + 100,
                      }
                    : dir,
                ),
              )
              setDirectoryConnectStep(3) // Success step
              return 100
            } else {
              // Simulate failure
              setConnectionError("Authentication failed. Please check your credentials and try again.")
              setDirectoryConnectStep(4) // Error step
              return 0
            }
          }
          return prev + 10
        })
      }, 300)
      return () => clearInterval(timer)
    }
  }, [isConnecting, selectedDirectory])

  const platforms = [
    "SeeClickFix (CivicPlus)",
    "CitySourced (Rock Solid)",
    "QAlert (QScend Technologies)",
    "Accela CRM",
    "MyCivic (Tyler Technologies)",
    "Connected Communities (OpenGov)",
    "Custom webhook",
  ]

  const breadcrumbItems = [
    { label: "Engagement Manager", path: "engagement-manager", isClickable: false },
    { label: "Survey Manager", path: "survey-builder", isClickable: true },
    { label: "New Survey", isCurrent: true },
  ]

  const getDistributionDuration = (cadence: string): string => {
    const durations: { [key: string]: string } = {
      "one-time": "1 month",
      monthly: "1 month",
      "bi-monthly": "2 months",
      quarterly: "3 months",
      "semi-annual": "3 months",
      "very-small-semi-annual": "5 months",
      annual: "3 months",
    }
    return durations[cadence] || ""
  }

  const handleSegmentToggle = (segmentId: string) => {
    setCrmSegments(
      crmSegments.map((segment) => (segment.id === segmentId ? { ...segment, selected: !segment.selected } : segment)),
    )
    setSegmentError(false)
  }

  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartments((prev) => {
      // If already selected, remove it
      if (prev.includes(departmentId)) {
        return prev.filter((id) => id !== departmentId)
      }
      // Otherwise add it
      return [...prev, departmentId]
    })
    setDepartmentError(false)
  }

  const handleRemoveDepartment = (departmentId: string) => {
    setSelectedDepartments((prev) => prev.filter((id) => id !== departmentId))
  }

  const getDepartmentName = (departmentId: string): string => {
    const department = departments.find((dept) => dept.id === departmentId)
    return department ? department.name : departmentId
  }

  const handleTestSend = () => {
    const selectedSegmentCount = crmSegments.filter((s) => s.selected).length
    if (selectedSegmentCount === 0) {
      setSegmentError(true)
      return
    }
    toast({
      title: "Test Survey Sent",
      description: "A test survey has been sent to your test record in HubSpot.",
      duration: 3000,
    })
  }

  const handleSaveSettings = () => {
    if (distributionMethod === "connected-crm") {
      const selectedSegmentCount = crmSegments.filter((s) => s.selected).length
      if (selectedSegmentCount === 0) {
        setSegmentError(true)
        toast({
          title: "Validation Error",
          description: "Please select at least one community segment.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }
    }

    if (distributionMethod === "internal-audience") {
      if (selectedDepartments.length === 0) {
        setDepartmentError(true)
        toast({
          title: "Validation Error",
          description: "Select at least one department.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      // Check if a directory is connected
      const hasConnectedDirectory = directories.some((dir) => dir.status === "connected")
      if (!hasConnectedDirectory) {
        toast({
          title: "Directory Required",
          description: "Please connect at least one directory to distribute to internal audience.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }
    }

    onSave()
  }

  const getTotalSelectedContacts = () => {
    return crmSegments.filter((s) => s.selected).reduce((total, segment) => total + segment.contactCount, 0)
  }

  const addCustomParameter = () => {
    setCustomParameters([...customParameters, { key: "", value: "" }])
  }

  const removeCustomParameter = (index: number) => {
    setCustomParameters(customParameters.filter((_, i) => i !== index))
  }

  const updateCustomParameter = (index: number, field: "key" | "value", value: string) => {
    const updated = [...customParameters]
    updated[index][field] = value
    setCustomParameters(updated)
  }

  const addHttpHeader = () => {
    setHttpHeaders([...httpHeaders, { name: "", value: "" }])
  }

  const removeHttpHeader = (index: number) => {
    setHttpHeaders(httpHeaders.filter((_, i) => i !== index))
  }

  const updateHttpHeader = (index: number, field: "name" | "value", value: string) => {
    const updated = [...httpHeaders]
    updated[index][field] = value
    setHttpHeaders(updated)
  }

  const handleDirectorySelect = (directoryId: string) => {
    setSelectedDirectory(directoryId)
    setDirectoryConnectStep(1)
    setConnectionError(null)
    setShowDirectoryModal(true)
  }

  const handleDirectoryConnect = () => {
    setDirectoryConnectStep(2)
    setIsConnecting(true)
    setConnectionProgress(0)
  }

  const handleDirectoryDisconnect = (directoryId: string) => {
    setDirectories((prev) =>
      prev.map((dir) =>
        dir.id === directoryId
          ? {
              ...dir,
              status: "disconnected",
              lastSynced: undefined,
              userCount: undefined,
            }
          : dir,
      ),
    )

    // Check if this was the last connected directory and clear selected departments if so
    const remainingConnectedDirectories = directories.filter(
      (dir) => dir.id !== directoryId && dir.status === "connected",
    ).length

    if (remainingConnectedDirectories === 0) {
      setSelectedDepartments([])
      toast({
        title: "Departments Cleared",
        description: "Selected departments have been cleared as no directories are connected.",
        duration: 3000,
      })
    }

    toast({
      title: "Directory Disconnected",
      description: `${directories.find((d) => d.id === directoryId)?.name} has been disconnected.`,
      duration: 3000,
    })
  }

  const getConnectedDirectoryCount = () => {
    return directories.filter((dir) => dir.status === "connected").length
  }

  const getTotalUserCount = () => {
    return directories
      .filter((dir) => dir.status === "connected")
      .reduce((total, dir) => total + (dir.userCount || 0), 0)
  }

  const resetDirectoryConnection = () => {
    setDirectoryConnectStep(1)
    setConnectionError(null)
    setConnectionProgress(0)
    setIsConnecting(false)
  }

  const getSelectedDirectoryName = () => {
    return directories.find((dir) => dir.id === selectedDirectory)?.name || "Directory"
  }

  return (
    <div>
      <div className="space-y-6">
        <PageHeader title="New Survey" breadcrumbItems={breadcrumbItems} onNavigate={onBack} />

        <Tabs defaultValue="settings" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="build">Build</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button variant="outline">Save</Button>
              <Button onClick={handleSaveSettings} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
                Publish
              </Button>
            </div>
          </div>

          <TabsContent value="build" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Survey Builder</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Survey building interface would go here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Settings</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">General</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customer">Customer</Label>
                      <Input id="customer" defaultValue="Adams County" readOnly className="mt-1 bg-gray-50" />
                    </div>

                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue="Sheriff Department" readOnly className="mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="survey-title">Resident-facing Survey Title</Label>
                      <Input
                        id="survey-title"
                        value={surveyTitle}
                        onChange={(e) => setSurveyTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="internal-title">Internal Title</Label>
                      <Input
                        id="internal-title"
                        placeholder="Internal Title"
                        value={internalTitle}
                        onChange={(e) => setInternalTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template">Survey Template</Label>
                    <Input id="template" value={templateName || "Community Survey"} readOnly className="mt-1" />
                  </div>
                </div>

                {/* Distribution Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Distribution</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cadence">Cadence</Label>
                      <Select
                        value={selectedCadence}
                        onValueChange={setSelectedCadence}
                        disabled={distributionMethod !== "representative" || distributionMethod === "self-distributed"}
                      >
                        <SelectTrigger
                          id="cadence"
                          className={cn(
                            "mt-1",
                            (distributionMethod !== "representative" || distributionMethod === "self-distributed") &&
                              "opacity-50 cursor-not-allowed",
                          )}
                        >
                          <SelectValue placeholder="Select cadence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="bi-monthly">Bi-monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="semi-annual">Semi-annual</SelectItem>
                          <SelectItem value="very-small-semi-annual">Very small Semi-annual</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="start-date">Start date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal mt-1",
                              distributionMethod === "third-party" && "opacity-50 cursor-not-allowed",
                            )}
                            id="start-date"
                            disabled={distributionMethod === "third-party"}
                          >
                            <span>{startDate ? format(startDate, "MMMM d, yyyy") : "Select date"}</span>
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>

                      {/* Show distribution duration only for Representative method */}
                      {distributionMethod === "representative" &&
                        selectedCadence !== "select" &&
                        getDistributionDuration(selectedCadence) && (
                          <p className="text-sm text-gray-600 mt-2">
                            Distribution duration: {getDistributionDuration(selectedCadence)}
                          </p>
                        )}

                      {/* Show end date picker only for Fast method or Self-distributed with augment */}
                      {(distributionMethod === "fast" ||
                        (distributionMethod === "self-distributed" && augmentWithZencity)) && (
                        <div className="mt-4">
                          <Label htmlFor="end-date">Distribution end date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between text-left font-normal mt-1"
                                id="end-date"
                              >
                                <span>{endDate ? format(endDate, "MMMM d, yyyy") : "Select date"}</span>
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                                disabled={(date) => (startDate ? date < startDate : false)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor="sample-size">Sample size (volume goal)</Label>
                      </div>
                      <Input
                        id="sample-size"
                        type="number"
                        value={sampleSize}
                        onChange={(e) => setSampleSize(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor="geo-distribution">Geographical Distribution</Label>
                      </div>
                      <Select defaultValue="city-wide">
                        <SelectTrigger id="geo-distribution" className="mt-1">
                          <SelectValue placeholder="Select map" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="city-wide">City-wide</SelectItem>
                          <SelectItem value="districts">By Districts</SelectItem>
                          <SelectItem value="custom">Custom Areas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Distribution Method */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label>Distribution Method</Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose where your survey goes—email lists, embedded links, CRM segments, inside your organization,
                      or via external platforms.
                    </p>
                    <RadioGroup value={distributionMethod} onValueChange={setDistributionMethod} className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="representative"
                          id="representative"
                          className="text-[#3BD1BB] border-[#3BD1BB] mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="representative" className="font-medium cursor-pointer">
                              Representative (Zencity managed)
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Statistically valid, census-aligned insights</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="fast" id="fast" className="text-[#3BD1BB] border-[#3BD1BB] mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="fast" className="font-medium cursor-pointer">
                              Fast (Zencity managed)
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Quick-fire insights for rapid feedback</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="connected-crm"
                          id="connected-crm"
                          className="text-[#3BD1BB] border-[#3BD1BB] mt-1"
                        />
                        <div className="w-full">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="connected-crm" className="font-medium cursor-pointer">
                              Targeted/Micro-community (CRM)
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Leverage your existing CRM segments for seamless targeting
                          </p>

                          {/* Connected CRM Configuration - moved here */}
                          {distributionMethod === "connected-crm" && (
                            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md border">
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-green-600 flex items-center">
                                  <LinkIcon className="w-4 h-4 mr-1" />
                                  HubSpot Connected
                                </div>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-[#3BD1BB] p-0 h-auto"
                                  onClick={() => {
                                    toast({
                                      title: "Connect Another CRM",
                                      description: "This feature is coming soon.",
                                      duration: 3000,
                                    })
                                  }}
                                >
                                  Connect another CRM
                                </Button>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <Label htmlFor="community-segments">Community Segments</Label>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="text-[#3BD1BB] p-0 h-auto"
                                    onClick={() => {
                                      toast({
                                        title: "Segments Refreshed",
                                        description: "Your HubSpot segments have been updated.",
                                        duration: 3000,
                                      })
                                    }}
                                  >
                                    Refresh segments
                                  </Button>
                                </div>
                                <div className={cn("border rounded-md p-2 bg-white", segmentError && "border-red-500")}>
                                  {crmSegments.map((segment) => (
                                    <div key={segment.id} className="flex items-center mb-2 last:mb-0">
                                      <Checkbox
                                        id={`segment-${segment.id}`}
                                        className="text-[#3BD1BB] border-[#3BD1BB]"
                                        checked={segment.selected}
                                        onCheckedChange={() => handleSegmentToggle(segment.id)}
                                      />
                                      <Label htmlFor={`segment-${segment.id}`} className="ml-2 cursor-pointer">
                                        {segment.name} ({segment.contactCount} contacts)
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                                {segmentError && (
                                  <p className="text-xs text-red-500 mt-1">
                                    Please select at least one segment to continue
                                  </p>
                                )}
                                {!segmentError && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {getTotalSelectedContacts() > 0
                                      ? `${getTotalSelectedContacts()} total contacts selected`
                                      : "Select at least one segment to distribute your survey"}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="sync-schedule">Sync Schedule</Label>
                                <Select value={syncSchedule} onValueChange={setSyncSchedule}>
                                  <SelectTrigger id="sync-schedule" className="mt-1">
                                    <SelectValue placeholder="Select sync schedule" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="immediate">Immediate (send as contacts are added)</SelectItem>
                                    <SelectItem value="daily">Daily Digest (batch send once per day)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={handleTestSend}
                                  disabled={crmSegments.filter((s) => s.selected).length === 0}
                                >
                                  Test Send
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="internal-audience"
                          id="internal-audience"
                          className="text-[#3BD1BB] border-[#3BD1BB] mt-1"
                        />
                        <div className="w-full">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="internal-audience" className="font-medium cursor-pointer">
                              Internal Audience
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Survey your staff to measure satisfaction, boost engagement, and foster a feedback-driven
                            culture.
                          </p>

                          {/* Internal Audience Configuration Panel */}
                          {distributionMethod === "internal-audience" && (
                            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md border transition-all duration-200 ease-in-out">
                              {/* Directory Integration Section */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-base font-medium">Directory Integration</Label>
                                  {getConnectedDirectoryCount() > 0 && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      {getConnectedDirectoryCount()} Connected
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-sm text-gray-600">
                                  Connect to your organization's directory to access employee information for survey
                                  distribution. <strong>This step is required</strong> before you can select target
                                  departments.
                                </p>

                                {getConnectedDirectoryCount() === 0 ? (
                                  <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Directory Required</AlertTitle>
                                    <AlertDescription>
                                      Connect at least one directory to distribute surveys to your internal audience.
                                      Once connected, you'll be able to select target departments.
                                    </AlertDescription>
                                  </Alert>
                                ) : (
                                  <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                                    <AlertDescription className="flex items-center">
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                      {getTotalUserCount()} users available across {getConnectedDirectoryCount()}{" "}
                                      {getConnectedDirectoryCount() === 1 ? "directory" : "directories"}
                                    </AlertDescription>
                                  </Alert>
                                )}

                                <div className="space-y-3 mt-2">
                                  {directories.map((directory) => (
                                    <div
                                      key={directory.id}
                                      className={cn(
                                        "flex items-center justify-between p-3 rounded-md border",
                                        directory.status === "connected" ? "bg-green-50 border-green-200" : "bg-white",
                                      )}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">{directory.icon}</div>
                                        <div>
                                          <p className="font-medium">{directory.name}</p>
                                          {directory.status === "connected" ? (
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                              <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                                              Connected • {directory.userCount} users
                                              {directory.lastSynced && (
                                                <span className="ml-2">
                                                  • Last synced: {new Date(directory.lastSynced).toLocaleDateString()}
                                                </span>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-xs text-gray-500 mt-1">Not connected</p>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        {directory.status === "connected" ? (
                                          <div className="flex space-x-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-gray-600"
                                              onClick={() => {
                                                toast({
                                                  title: "Sync Started",
                                                  description: `Syncing ${directory.name} directory...`,
                                                  duration: 3000,
                                                })
                                              }}
                                            >
                                              <RefreshCw className="w-3 h-3 mr-1" />
                                              Sync
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-red-600 border-red-200 hover:bg-red-50"
                                              onClick={() => handleDirectoryDisconnect(directory.id)}
                                            >
                                              Disconnect
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-[#3BD1BB]"
                                            onClick={() => handleDirectorySelect(directory.id)}
                                          >
                                            Connect
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              {/* Channels Section */}
                              <div>
                                <Label className="text-base font-medium">Distribution Channels</Label>
                                <p className="text-sm text-gray-600 mt-1 mb-2">
                                  Select how you want to distribute the survey to your internal audience.
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="channel-email"
                                      className="text-[#3BD1BB] border-[#3BD1BB]"
                                      defaultChecked
                                    />
                                    <Label htmlFor="channel-email" className="cursor-pointer">
                                      Email
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="channel-slack" className="text-[#3BD1BB] border-[#3BD1BB]" />
                                    <Label htmlFor="channel-slack" className="cursor-pointer">
                                      Slack
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="channel-intranet" className="text-[#3BD1BB] border-[#3BD1BB]" />
                                    <Label htmlFor="channel-intranet" className="cursor-pointer">
                                      Intranet Portal
                                    </Label>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {/* Department Selection */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="departments" className="text-base font-medium">
                                    Target Departments
                                  </Label>
                                  {getConnectedDirectoryCount() === 0 ? (
                                    <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                                      Unavailable
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Available
                                    </Badge>
                                  )}
                                </div>

                                {getConnectedDirectoryCount() === 0 ? (
                                  <Alert variant="warning" className="mt-2 bg-amber-50 text-amber-800 border-amber-200">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Directory Connection Required</AlertTitle>
                                    <AlertDescription>
                                      You need to connect at least one directory before you can select target
                                      departments. Please connect a directory using the options above.
                                    </AlertDescription>
                                  </Alert>
                                ) : (
                                  <p className="text-sm text-gray-600 mt-1 mb-2">
                                    Select which departments should receive this survey. You can select multiple
                                    departments.
                                  </p>
                                )}

                                <div
                                  className={cn(
                                    "mt-2 transition-opacity duration-200",
                                    getConnectedDirectoryCount() === 0
                                      ? "opacity-50 pointer-events-none"
                                      : "opacity-100",
                                  )}
                                >
                                  {departments.map((department) => (
                                    <div key={department.id} className="flex items-center mb-2 last:mb-0">
                                      <Checkbox
                                        id={`department-${department.id}`}
                                        className={cn(
                                          "text-[#3BD1BB] border-[#3BD1BB]",
                                          getConnectedDirectoryCount() === 0 && "cursor-not-allowed",
                                        )}
                                        checked={selectedDepartments.includes(department.id)}
                                        onCheckedChange={() => handleDepartmentSelect(department.id)}
                                        disabled={getConnectedDirectoryCount() === 0}
                                      />
                                      <Label
                                        htmlFor={`department-${department.id}`}
                                        className={cn(
                                          "ml-2",
                                          getConnectedDirectoryCount() === 0
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "cursor-pointer",
                                        )}
                                      >
                                        {department.name}
                                      </Label>
                                    </div>
                                  ))}
                                </div>

                                {departmentError && (
                                  <p className="text-xs text-red-500 mt-1">
                                    Please select at least one department to continue
                                  </p>
                                )}

                                {selectedDepartments.length > 0 && (
                                  <div className="mt-3">
                                    <Label className="text-sm">Selected Departments:</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {selectedDepartments.map((deptId) => (
                                        <Badge key={deptId} variant="secondary" className="flex items-center gap-1">
                                          {getDepartmentName(deptId)}
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                            onClick={() => handleRemoveDepartment(deptId)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={() => {
                                    if (getConnectedDirectoryCount() === 0) {
                                      toast({
                                        title: "Directory Required",
                                        description: "Please connect a directory before sending test surveys.",
                                        variant: "destructive",
                                        duration: 3000,
                                      })
                                      return
                                    }

                                    if (selectedDepartments.length === 0) {
                                      toast({
                                        title: "Departments Required",
                                        description: "Please select at least one department.",
                                        variant: "destructive",
                                        duration: 3000,
                                      })
                                      return
                                    }

                                    toast({
                                      title: "Test Survey Sent",
                                      description: "A test survey has been sent to your work email.",
                                      duration: 3000,
                                    })
                                  }}
                                >
                                  Send test to me
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="self-distributed"
                          id="self-distributed"
                          className="text-[#3BD1BB] border-[#3BD1BB] mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="self-distributed" className="font-medium cursor-pointer">
                              Self-distributed
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Share through your own channels</p>
                        </div>
                      </div>
                      {distributionMethod === "self-distributed" && (
                        <div className="ml-6 flex items-center space-x-2">
                          <Checkbox
                            id="augment"
                            className="text-[#3BD1BB] border-[#3BD1BB]"
                            checked={augmentWithZencity}
                            onCheckedChange={(checked) => setAugmentWithZencity(checked === true)}
                          />
                          <Label htmlFor="augment" className="font-normal cursor-pointer">
                            Also augment with Zencity distribution
                          </Label>
                        </div>
                      )}

                      <div className="flex items-start space-x-2">
                        <RadioGroupItem
                          value="third-party"
                          id="third-party"
                          className="text-[#3BD1BB] border-[#3BD1BB] mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="third-party" className="font-medium cursor-pointer">
                              3rd-party triggered
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Automate feedback collection via external platforms
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Third-party settings */}
                  {distributionMethod === "third-party" && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                          <SelectTrigger id="platform" className="mt-1">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Show these fields for non-custom webhook platforms */}
                      {selectedPlatform && selectedPlatform !== "Custom webhook" && (
                        <>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Label htmlFor="api-key">API Key</Label>
                            </div>
                            <Input id="api-key" placeholder="Enter your API Key" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Label htmlFor="event-type">Event Type</Label>
                            </div>
                            <Input id="event-type" placeholder="E.g. case_closed, feedback_ready" />
                          </div>
                        </>
                      )}

                      {/* Custom webhook specific fields */}
                      {selectedPlatform === "Custom webhook" && (
                        <>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Label htmlFor="webhook-url">Webhook URL</Label>
                            </div>
                            <Input
                              id="webhook-url"
                              placeholder="https://your-webhook-endpoint.com/path"
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Label htmlFor="http-method">HTTP Method</Label>
                            </div>
                            <Select value={httpMethod} onValueChange={setHttpMethod}>
                              <SelectTrigger id="http-method">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="PATCH">PATCH</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Label>HTTP Headers</Label>
                            </div>
                            <div className="space-y-2">
                              {httpHeaders.map((header, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    placeholder="Header Name"
                                    value={header.name}
                                    onChange={(e) => updateHttpHeader(index, "name", e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Header Value"
                                    value={header.value}
                                    onChange={(e) => updateHttpHeader(index, "value", e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeHttpHeader(index)}
                                    className="h-10 w-10"
                                  >
                                    <Plus className="w-4 h-4 rotate-45" />
                                  </Button>
                                </div>
                              ))}
                              {httpHeaders.length === 0 && (
                                <div className="flex items-center space-x-2">
                                  <Input placeholder="Header Name" className="flex-1" disabled />
                                  <Input placeholder="Header Value" className="flex-1" disabled />
                                  <Button variant="ghost" size="icon" onClick={addHttpHeader} className="h-10 w-10">
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Custom Parameters - shown for all third-party options */}
                      {selectedPlatform && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label>Custom Parameters (optional)</Label>
                          </div>
                          <div className="space-y-2">
                            {customParameters.map((param, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input
                                  placeholder="Key"
                                  value={param.key}
                                  onChange={(e) => updateCustomParameter(index, "key", e.target.value)}
                                  className="flex-1"
                                />
                                <Input
                                  placeholder="Value"
                                  value={param.value}
                                  onChange={(e) => updateCustomParameter(index, "value", e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCustomParameter(index)}
                                  className="h-10 w-10"
                                >
                                  <Plus className="w-4 h-4 rotate-45" />
                                </Button>
                              </div>
                            ))}
                            {customParameters.length === 0 && (
                              <div className="flex items-center space-x-2">
                                <Input placeholder="Key" className="flex-1" disabled />
                                <Input placeholder="Value" className="flex-1" disabled />
                                <Button variant="ghost" size="icon" onClick={addCustomParameter} className="h-10 w-10">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between mt-4">
          <Button variant="link" className="text-[#3BD1BB]" onClick={() => setShowPreviewModal(true)}>
            Preview distribution
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white" onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Directory Connection Modal */}
      <Dialog open={showDirectoryModal} onOpenChange={setShowDirectoryModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {directoryConnectStep === 1 && `Connect to ${getSelectedDirectoryName()}`}
              {directoryConnectStep === 2 && "Connecting..."}
              {directoryConnectStep === 3 && "Connection Successful"}
              {directoryConnectStep === 4 && "Connection Failed"}
            </DialogTitle>
            <DialogDescription>
              {directoryConnectStep === 1 && "Enter your credentials to connect to your directory service."}
              {directoryConnectStep === 2 && "Please wait while we establish a connection..."}
              {directoryConnectStep === 3 && "Your directory has been successfully connected."}
              {directoryConnectStep === 4 && "We encountered an issue while connecting to your directory."}
            </DialogDescription>
          </DialogHeader>

          {directoryConnectStep === 1 && (
            <>
              <div className="space-y-5 py-4">
                {selectedDirectory === "azure-ad" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tenant-id" className="block text-sm font-medium">
                        Tenant ID
                      </Label>
                      <Input
                        id="tenant-id"
                        value={directoryCredentials.tenantId}
                        onChange={(e) => setDirectoryCredentials({ ...directoryCredentials, tenantId: e.target.value })}
                        placeholder="Enter your Azure AD tenant ID"
                      />
                      <p className="text-xs text-gray-500">
                        The unique identifier for your Azure Active Directory tenant
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-id" className="block text-sm font-medium">
                        Client ID
                      </Label>
                      <Input
                        id="client-id"
                        value={directoryCredentials.clientId}
                        onChange={(e) => setDirectoryCredentials({ ...directoryCredentials, clientId: e.target.value })}
                        placeholder="Enter your application (client) ID"
                      />
                      <p className="text-xs text-gray-500">The application ID registered in your Azure portal</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-secret" className="block text-sm font-medium">
                        Client Secret
                      </Label>
                      <Input
                        id="client-secret"
                        type="password"
                        value={directoryCredentials.clientSecret}
                        onChange={(e) =>
                          setDirectoryCredentials({ ...directoryCredentials, clientSecret: e.target.value })
                        }
                        placeholder="Enter your client secret"
                      />
                      <p className="text-xs text-gray-500">The secret key generated for your application</p>
                    </div>
                  </>
                )}

                {selectedDirectory === "okta" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="domain" className="block text-sm font-medium">
                        Okta Domain
                      </Label>
                      <Input
                        id="domain"
                        value={directoryCredentials.domain}
                        onChange={(e) => setDirectoryCredentials({ ...directoryCredentials, domain: e.target.value })}
                        placeholder="your-domain.okta.com"
                      />
                      <p className="text-xs text-gray-500">Your Okta organization's domain</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-token" className="block text-sm font-medium">
                        API Token
                      </Label>
                      <Input
                        id="api-token"
                        type="password"
                        value={directoryCredentials.clientSecret}
                        onChange={(e) =>
                          setDirectoryCredentials({ ...directoryCredentials, clientSecret: e.target.value })
                        }
                        placeholder="Enter your Okta API token"
                      />
                      <p className="text-xs text-gray-500">The API token generated in your Okta admin console</p>
                    </div>
                  </>
                )}

                {selectedDirectory === "ldap" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ldap-url" className="block text-sm font-medium">
                        LDAP URL
                      </Label>
                      <Input
                        id="ldap-url"
                        value={directoryCredentials.domain}
                        onChange={(e) => setDirectoryCredentials({ ...directoryCredentials, domain: e.target.value })}
                        placeholder="ldap://your-ldap-server:389"
                      />
                      <p className="text-xs text-gray-500">The URL of your LDAP server including protocol and port</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bind-dn" className="block text-sm font-medium">
                        Bind DN
                      </Label>
                      <Input
                        id="bind-dn"
                        value={directoryCredentials.clientId}
                        onChange={(e) => setDirectoryCredentials({ ...directoryCredentials, clientId: e.target.value })}
                        placeholder="cn=admin,dc=example,dc=com"
                      />
                      <p className="text-xs text-gray-500">The distinguished name used to bind to the LDAP server</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bind-password" className="block text-sm font-medium">
                        Bind Password
                      </Label>
                      <Input
                        id="bind-password"
                        type="password"
                        value={directoryCredentials.clientSecret}
                        onChange={(e) =>
                          setDirectoryCredentials({ ...directoryCredentials, clientSecret: e.target.value })
                        }
                        placeholder="Enter your bind password"
                      />
                      <p className="text-xs text-gray-500">The password for the bind DN account</p>
                    </div>
                  </>
                )}

                {selectedDirectory === "google-workspace" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="client-id" className="block text-sm font-medium">
                        Client ID
                      </Label>
                      <Input
                        id="client-id"
                        value={directoryCredentials.clientId}
                        onChange={(e) => setDirectoryCredentials({ ...directoryCredentials, clientId: e.target.value })}
                        placeholder="Enter your Google client ID"
                      />
                      <p className="text-xs text-gray-500">The client ID from your Google Cloud Console</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-secret" className="block text-sm font-medium">
                        Client Secret
                      </Label>
                      <Input
                        id="client-secret"
                        type="password"
                        value={directoryCredentials.clientSecret}
                        onChange={(e) =>
                          setDirectoryCredentials({ ...directoryCredentials, clientSecret: e.target.value })
                        }
                        placeholder="Enter your Google client secret"
                      />
                      <p className="text-xs text-gray-500">The client secret from your Google Cloud Console</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain" className="block text-sm font-medium">
                        Domain
                      </Label>
                      <Input
                        id="domain"
                        value={directoryCredentials.domain}
                        onChange={(e) => setDirectoryCredentials({ ...directoryCredentials, domain: e.target.value })}
                        placeholder="your-domain.com"
                      />
                      <p className="text-xs text-gray-500">Your Google Workspace domain</p>
                    </div>
                  </>
                )}

                <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-md">
                  <p>
                    Your credentials are securely stored and used only for directory synchronization. Learn more about{" "}
                    <a href="#" className="text-[#3BD1BB] hover:underline">
                      how we handle your data
                    </a>
                    .
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDirectoryModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDirectoryConnect} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
                  Connect
                </Button>
              </DialogFooter>
            </>
          )}

          {directoryConnectStep === 2 && (
            <div className="py-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Progress value={connectionProgress} className="w-full" />
                <p className="text-sm text-gray-500">Establishing connection and syncing directory data...</p>
              </div>
            </div>
          )}

          {directoryConnectStep === 3 && (
            <>
              <div className="py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Directory Connected Successfully</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your directory has been connected and synchronized. You can now select target departments for your
                      survey in the "Target Departments" section.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md w-full text-sm text-blue-700">
                    <p className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      The Target Departments section is now enabled
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setShowDirectoryModal(false)}
                  className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white"
                >
                  Continue to Department Selection
                </Button>
              </DialogFooter>
            </>
          )}

          {directoryConnectStep === 4 && (
            <>
              <div className="py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Connection Failed</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {connectionError || "We encountered an issue while connecting to your directory."}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDirectoryModal(false)}>
                  Cancel
                </Button>
                <Button onClick={resetDirectoryConnection} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
                  Try Again
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DistributionPreviewModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        distributionMethod={distributionMethod}
        surveyTitle={surveyTitle}
        selectedSegments={crmSegments.filter((s) => s.selected)}
        totalContacts={getTotalSelectedContacts()}
        syncSchedule={syncSchedule}
        startDate={startDate}
        endDate={endDate}
        selectedDepartments={selectedDepartments}
        departmentNames={selectedDepartments.map((id) => getDepartmentName(id))}
        selectedPlatform={selectedPlatform}
        webhookUrl={webhookUrl}
        httpMethod={httpMethod}
      />
    </div>
  )
}

export { SurveySettings }
export default SurveySettings
