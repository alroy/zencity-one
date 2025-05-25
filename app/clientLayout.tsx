"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { TopBar } from "@/components/top-bar"
import { Monitor } from "@/components/monitor"
import { ResearchAssistant } from "@/components/research-assistant"
import { SurveyManager } from "@/components/survey-manager"
import { ComingSoon } from "@/components/coming-soon"
import { InternalPlatforms } from "@/components/integrations/internal-platforms"
import { ResidentFeedbackPlatforms } from "@/components/integrations/resident-feedback"
import { IntegrationHealth } from "@/components/integrations/integration-health"
import { FloatingToolkit } from "@/components/floating-toolkit"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("monitor")
  const [sectionOptions, setSectionOptions] = useState<any>(null)
  const customerName = "Adams County" // This would typically come from a context or API

  const handleSectionChange = (section: string, options?: any) => {
    console.log(`Setting active section to: ${section}`, options)
    setActiveSection(section)
    setSectionOptions(options || null)
  }

  const renderContent = () => {
    console.log(`Rendering content for section: ${activeSection}`)
    switch (activeSection) {
      case "monitor":
        return <Monitor onSectionChange={handleSectionChange} />
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
      default:
        // For any other section, show the coming soon component
        return <ComingSoon section={activeSection} />
    }
  }

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-50">
          <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar customerName={customerName} />
            <div className="flex-1 flex justify-center overflow-hidden">
              <main className="w-[80%] overflow-y-auto">{renderContent()}</main>
            </div>
            <FloatingToolkit onSectionChange={handleSectionChange} />
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
