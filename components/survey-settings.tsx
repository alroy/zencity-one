"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SurveySettingsProps {
  onBack: () => void
  onSave: () => void
  initialTitle?: string
  templateName?: string
}

export function SurveySettings({ onBack, onSave, initialTitle, templateName }: SurveySettingsProps) {
  const [distributionMethod, setDistributionMethod] = useState("representative")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [customParameters, setCustomParameters] = useState([{ key: "", value: "" }])
  const [httpHeaders, setHttpHeaders] = useState([{ name: "", value: "" }])
  const [httpMethod, setHttpMethod] = useState("POST")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [selectedCadence, setSelectedCadence] = useState("select")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 2, 1)) // March 1, 2025
  const [endDate, setEndDate] = useState<Date | undefined>()

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
              <Button onClick={onSave} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
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
                        disabled={distributionMethod !== "representative"}
                      >
                        <SelectTrigger
                          id="cadence"
                          className={cn(
                            "mt-1",
                            distributionMethod !== "representative" && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          <SelectValue placeholder="Select cadence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="select">Select cadence</SelectItem>
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

                      {/* Show end date picker only for Fast and Self-distributed methods */}
                      {(distributionMethod === "fast" || distributionMethod === "self-distributed") && (
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
                      <Select defaultValue="select">
                        <SelectTrigger id="geo-distribution" className="mt-1">
                          <SelectValue placeholder="Select map" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="select">Select map</SelectItem>
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
                          <Checkbox id="augment" className="text-[#3BD1BB] border-[#3BD1BB]" />
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
      </div>
    </div>
  )
}
