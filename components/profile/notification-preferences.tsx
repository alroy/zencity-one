"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NotificationPreferences() {
  const { toast } = useToast()
  const [emailNotifications, setEmailNotifications] = useState({
    surveyCreated: true,
    surveyCompleted: true,
    reportGenerated: true,
    weeklyDigest: true,
    monthlyInsights: false,
    systemUpdates: true,
  })

  const [inAppNotifications, setInAppNotifications] = useState({
    surveyCreated: true,
    surveyCompleted: true,
    reportGenerated: true,
    newComments: true,
    systemUpdates: true,
    teamActivity: false,
  })

  const breadcrumbItems = [
    { label: "User Settings", path: "user-settings", isClickable: false },
    { label: "Notification Preferences", isCurrent: true },
  ]

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleInAppToggle = (key: keyof typeof inAppNotifications) => {
    setInAppNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been updated successfully.",
      duration: 3000,
    })
  }

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="Notification Preferences"
        description="Manage how and when you receive notifications"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="mt-8 space-y-6">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="email">Email Notifications</TabsTrigger>
            <TabsTrigger value="inapp">In-App Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure which email notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Survey Created</h4>
                      <p className="text-sm text-gray-500">Receive an email when a new survey is created</p>
                    </div>
                    <Switch
                      checked={emailNotifications.surveyCreated}
                      onCheckedChange={() => handleEmailToggle("surveyCreated")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Survey Completed</h4>
                      <p className="text-sm text-gray-500">
                        Receive an email when a survey reaches its target responses
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.surveyCompleted}
                      onCheckedChange={() => handleEmailToggle("surveyCompleted")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Report Generated</h4>
                      <p className="text-sm text-gray-500">Receive an email when a new report is generated</p>
                    </div>
                    <Switch
                      checked={emailNotifications.reportGenerated}
                      onCheckedChange={() => handleEmailToggle("reportGenerated")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Weekly Digest</h4>
                      <p className="text-sm text-gray-500">Receive a weekly summary of platform activity</p>
                    </div>
                    <Switch
                      checked={emailNotifications.weeklyDigest}
                      onCheckedChange={() => handleEmailToggle("weeklyDigest")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Monthly Insights</h4>
                      <p className="text-sm text-gray-500">Receive monthly analytics and trend reports</p>
                    </div>
                    <Switch
                      checked={emailNotifications.monthlyInsights}
                      onCheckedChange={() => handleEmailToggle("monthlyInsights")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">System Updates</h4>
                      <p className="text-sm text-gray-500">Receive emails about system updates and new features</p>
                    </div>
                    <Switch
                      checked={emailNotifications.systemUpdates}
                      onCheckedChange={() => handleEmailToggle("systemUpdates")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>In-App Notifications</CardTitle>
                <CardDescription>Configure which notifications you want to see within the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Survey Created</h4>
                      <p className="text-sm text-gray-500">Receive a notification when a new survey is created</p>
                    </div>
                    <Switch
                      checked={inAppNotifications.surveyCreated}
                      onCheckedChange={() => handleInAppToggle("surveyCreated")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Survey Completed</h4>
                      <p className="text-sm text-gray-500">
                        Receive a notification when a survey reaches its target responses
                      </p>
                    </div>
                    <Switch
                      checked={inAppNotifications.surveyCompleted}
                      onCheckedChange={() => handleInAppToggle("surveyCompleted")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Report Generated</h4>
                      <p className="text-sm text-gray-500">Receive a notification when a new report is generated</p>
                    </div>
                    <Switch
                      checked={inAppNotifications.reportGenerated}
                      onCheckedChange={() => handleInAppToggle("reportGenerated")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">New Comments</h4>
                      <p className="text-sm text-gray-500">Receive notifications for new comments on your reports</p>
                    </div>
                    <Switch
                      checked={inAppNotifications.newComments}
                      onCheckedChange={() => handleInAppToggle("newComments")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">System Updates</h4>
                      <p className="text-sm text-gray-500">
                        Receive notifications about system updates and new features
                      </p>
                    </div>
                    <Switch
                      checked={inAppNotifications.systemUpdates}
                      onCheckedChange={() => handleInAppToggle("systemUpdates")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Team Activity</h4>
                      <p className="text-sm text-gray-500">Receive notifications about team member actions</p>
                    </div>
                    <Switch
                      checked={inAppNotifications.teamActivity}
                      onCheckedChange={() => handleInAppToggle("teamActivity")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
