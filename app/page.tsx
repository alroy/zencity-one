"use client"

import { useState, useEffect } from "react"
import { Monitor } from "@/components/monitor"
import { ResearchAssistant } from "@/components/research-assistant"
import { SurveyBuilder } from "@/components/survey-builder"
import { ComingSoon } from "@/components/coming-soon"
import ClientLayout from "./clientLayout"

export default function ZencityPlatform() {
  const [activeSection, setActiveSection] = useState("community-pulse")

  // Get the active section from the URL or localStorage on initial load
  useEffect(() => {
    const section = window.location.pathname.split("/").pop() || "community-pulse"
    if (["community-pulse", "research-assistant", "survey-builder"].includes(section)) {
      setActiveSection(section)
    }
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case "community-pulse":
        return <Monitor />
      case "research-assistant":
        return <ResearchAssistant />
      case "survey-builder":
        return <SurveyBuilder />
      default:
        // For any other section, show the coming soon component
        return <ComingSoon section={activeSection} />
    }
  }

  // The actual content is now rendered in the ClientLayout component
  return <ClientLayout>{renderContent()}</ClientLayout>
}
