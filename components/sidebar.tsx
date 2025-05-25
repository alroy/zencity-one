"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Monitor,
  MessageSquare,
  Workflow,
  FileText,
  BarChart3,
  Archive,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  Users,
  LinkIcon,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState(["city-explorer", "engagement-manager"])
  const { toast } = useToast()

  // Ensure the parent sections of active items are expanded
  useEffect(() => {
    if (activeSection === "monitor" || activeSection === "research-assistant") {
      setExpandedSections((prev) => (prev.includes("city-explorer") ? prev : [...prev, "city-explorer"]))
    } else if (activeSection === "survey-builder") {
      setExpandedSections((prev) => (prev.includes("engagement-manager") ? prev : [...prev, "engagement-manager"]))
    } else if (
      activeSection === "internal-platforms" ||
      activeSection === "resident-feedback" ||
      activeSection === "integration-health"
    ) {
      setExpandedSections((prev) => (prev.includes("integrations") ? prev : [...prev, "integrations"]))
    }
  }, [activeSection])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleSectionClick = (sectionId: string) => {
    const functionalSections = [
      "monitor",
      "research-assistant",
      "survey-builder",
      "internal-platforms",
      "resident-feedback",
      "integration-health",
    ]

    if (functionalSections.includes(sectionId)) {
      console.log(`Navigating to section: ${sectionId}`)
      onSectionChange(sectionId)
    } else {
      // Show toast notification instead of navigating
      toast({
        title: "Feature Coming Soon",
        description: "This section is currently under development and will be available in a future update.",
        duration: 3000,
      })
    }
  }

  const menuItems = [
    {
      id: "city-explorer",
      title: "City Explorer",
      icon: Monitor,
      children: [
        { id: "monitor", title: "Monitor", icon: Monitor, badge: "3" },
        { id: "research-assistant", title: "Research Assistant", icon: MessageSquare },
        { id: "workflows", title: "Workflows", icon: Workflow },
      ],
    },
    {
      id: "engagement-manager",
      title: "Engagement Manager",
      icon: Users,
      children: [
        { id: "survey-builder", title: "Survey Builder", icon: FileText, badge: "2" },
        { id: "citizen-participation", title: "Residents Participation", icon: Users },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      icon: BarChart3,
      children: [
        { id: "overview", title: "Overview", icon: BarChart3 },
        { id: "report-generator", title: "Report Generator", icon: FileBarChart },
        { id: "archive", title: "Archive", icon: Archive },
      ],
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: LinkIcon,
      children: [
        { id: "internal-platforms", title: "Internal Platforms", icon: LinkIcon },
        { id: "resident-feedback", title: "Resident Feedback", icon: Users },
        { id: "integration-health", title: "Integration Health", icon: CheckCircle },
      ],
    },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header with Zencity Logo - Removed border-b */}
      <div className="p-4">
        <div className="flex items-center">
          <Image src="/images/zencity-logo.png" alt="Zencity" width={120} height={30} className="h-auto" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((section) => (
          <div key={section.id}>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center">
                <section.icon className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{section.title}</span>
              </div>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>

            {expandedSections.includes(section.id) && (
              <div className="ml-4 mt-1 space-y-1">
                {section.children.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start p-2 h-auto ${
                      activeSection === item.id ? "bg-[#3BD1BB]/10 text-[#3BD1BB] hover:bg-[#3BD1BB]/20" : ""
                    }`}
                    onClick={() => handleSectionClick(item.id)}
                  >
                    <item.icon className={`w-4 h-4 mr-2 ${activeSection === item.id ? "text-[#3BD1BB]" : ""}`} />
                    <span className="text-sm">{item.title}</span>
                    {item.badge && (
                      <Badge className={`ml-auto ${activeSection === item.id ? "bg-[#3BD1BB]/20 text-[#3BD1BB]" : ""}`}>
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Admin Section */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start p-2 h-auto"
            onClick={() => handleSectionClick("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">ADMIN</span>
          </Button>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start p-2 h-auto"
          onClick={() => handleSectionClick("profile")}
        >
          <User className="w-4 h-4 mr-2" />
          <div className="text-left">
            <div className="text-sm font-medium">John Smith</div>
            <div className="text-xs text-gray-500">City Manager</div>
          </div>
        </Button>
      </div>
    </div>
  )
}
