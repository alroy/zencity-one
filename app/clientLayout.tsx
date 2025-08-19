"use client"

import type React from "react"
import { useState } from "react"
import { UserProvider } from "@/contexts/user-context"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FloatingToolkit } from "@/components/floating-toolkit"
import { Toaster } from "@/components/ui/toaster"
import { Monitor } from "@/components/monitor"
import { ResearchAssistant } from "@/components/research-assistant"
import { SurveyManager } from "@/components/survey-manager"
import { ComingSoon } from "@/components/coming-soon"
import { InternalPlatforms } from "@/components/integrations/internal-platforms"
import { ResidentFeedbackPlatforms } from "@/components/integrations/resident-feedback"
import { IntegrationHealth } from "@/components/integrations/integration-health"
import { ProfileInformation } from "@/components/profile/profile-information"
import { NotificationPreferences } from "@/components/profile/notification-preferences"
import { SecuritySettings } from "@/components/profile/security-settings"
import { CompStatDashboard } from "@/components/compstat-dashboard"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("monitor")
  const [sectionOptions, setSectionOptions] = useState<any>(null)
  const customerName = "Willowbrook County"

  const handleSectionChange = (section: string, options?: any) => {
    setActiveSection(section)
    setSectionOptions(options || null)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "monitor":
        return <Monitor onSectionChange={handleSectionChange} />
      case "compstat-dashboard":
        return <CompStatDashboard onSectionChange={handleSectionChange} />
      case "research-assistant":
        return <ResearchAssistant onSectionChange={handleSectionChange} />
      case "survey-builder":
        return <SurveyManager initialOptions={sectionOptions} />
      case "internal-platforms":
        return <InternalPlatforms />
      case "resident-feedback":
        return <ResidentFeedbackPlatforms />
      case "integration-health":
        return <IntegrationHealth />
      case "profile-information":
        return <ProfileInformation />
      case "notification-preferences":
        return <NotificationPreferences />
      case "security-settings":
        return <SecuritySettings />
      default:
        // The original logic showed a "Coming Soon" component for unhandled sections.
        // If you want to render the page content from Next.js routing instead,
        // you can replace this with: return children;
        return <ComingSoon section={activeSection} />
    }
  }

  return (
    <UserProvider>
      <div className="flex h-screen bg-gray-50 font-sans">
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar customerName={customerName} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{renderContent()}</main>
        </div>
        <FloatingToolkit onSectionChange={handleSectionChange} />
      </div>
      <Toaster />
    </UserProvider>
  )
}
