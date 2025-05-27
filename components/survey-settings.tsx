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
import { Plus, Calendar, LinkIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DistributionPreviewModal } from "@/components/distribution-preview-modal"

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
      // Add validation for internal audience
      toast({
        title: "Validation Error",
        description: "Select at least one team or department.",
        variant: "destructive",
        duration: 3000,
      })
      return
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
                              Connected CRM
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
                              <div>
                                <Label htmlFor="directory-integration">Directory Integration</Label>
                                <Select defaultValue="azure-ad">
                                  <SelectTrigger id="directory-integration" className="mt-1">
                                    <SelectValue placeholder="Select directory" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="azure-ad">Azure AD</SelectItem>
                                    <SelectItem value="okta">Okta</SelectItem>
                                    <SelectItem value="ldap">LDAP</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-[#3BD1BB] p-0 h-auto mt-1"
                                  onClick={() => {
                                    toast({
                                      title: "Connect Directory",
                                      description: "This will redirect to the Integrations page.",
                                      duration: 3000,
                                    })
                                  }}
                                >
                                  Connect directory
                                </Button>
                              </div>

                              <div>
                                <Label>Channels</Label>
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

                              <div>
                                <Label htmlFor="group-selector">Select Department</Label>
                                <Select>
                                  <SelectTrigger id="group-selector" className="mt-1">
                                    <SelectValue placeholder="Select teams/departments" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="public-works">Public Works</SelectItem>
                                    <SelectItem value="parks-recreation">Parks and Recreation</SelectItem>
                                    <SelectItem value="fire-department">Fire Department</SelectItem>
                                    <SelectItem value="planning-zoning">Planning and Zoning</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="housing-community">Housing and Community Development</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Send Schedule</Label>
                                <RadioGroup defaultValue="immediate" className="mt-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="immediate"
                                      id="send-immediate"
                                      className="text-[#3BD1BB] border-[#3BD1BB]"
                                    />
                                    <Label htmlFor="send-immediate" className="cursor-pointer">
                                      Send immediately
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="scheduled"
                                      id="send-scheduled"
                                      className="text-[#3BD1BB] border-[#3BD1BB]"
                                    />
                                    <Label htmlFor="send-scheduled" className="cursor-pointer">
                                      Schedule for later
                                    </Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="ml-2">
                                          <Calendar className="h-4 w-4 mr-1" />
                                          Select date & time
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent mode="single" initialFocus />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </RadioGroup>
                              </div>

                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={() => {
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
      />
    </div>
  )
}

export { SurveySettings }
export default SurveySettings
