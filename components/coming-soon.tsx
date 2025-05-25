"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Construction } from "lucide-react"
import Image from "next/image"

interface ComingSoonProps {
  section: string
}

export function ComingSoon({ section }: ComingSoonProps) {
  const sectionNames: Record<string, string> = {
    workflows: "Workflows",
    "citizen-participation": "Residents Participation",
    overview: "Reports Overview",
    "report-generator": "Report Generator",
    archive: "Archive",
    settings: "Admin Settings",
    profile: "User Profile",
  }

  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {section === "citizen-participation" ? (
            <div className="flex justify-center mb-4">
              <Image
                src="/images/residents-participation-coming-soon.png"
                alt="Residents Participation Coming Soon"
                width={50}
                height={50}
                className="h-auto"
              />
            </div>
          ) : (
            <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          )}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{sectionNames[section] || "Feature"} Coming Soon</h2>
          <p className="text-gray-600">
            This section is currently under development and will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
