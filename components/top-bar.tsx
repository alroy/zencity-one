"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, FileEdit, Send, Users, Globe, BoxIcon as Toolbox } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TopBarProps {
  customerName: string
}

export function TopBar({ customerName = "Adams County" }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [greeting, setGreeting] = useState<string>("")
  const [weather, setWeather] = useState<string>("50°F")

  const { toast } = useToast()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleAction = (action: string) => {
    toast({
      title: "Action Selected",
      description: `You selected: ${action}`,
      duration: 3000,
    })
    setDropdownOpen(false)
  }

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "pm" : "am"}`
      setCurrentTime(formattedTime)

      // Set greeting based on time of day
      if (hours >= 5 && hours < 12) {
        setGreeting("Good morning,")
      } else if (hours >= 12 && hours < 18) {
        setGreeting("Good afternoon,")
      } else {
        setGreeting("Good evening,")
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    // Mock weather data - in a real app, you would fetch this from a weather API
    setWeather("50°F")

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex items-center mr-4">
            <Image
              src="/images/city-illustration.png"
              alt="City illustration"
              width={48}
              height={48}
              className="h-auto"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-600">
              Time: {currentTime} | Weather: {weather}
            </div>
            <div className="text-lg font-medium text-gray-800">
              {greeting} {customerName}
            </div>
          </div>
        </div>

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="h-10 px-3 flex items-center gap-2 bg-[#3BD1BB]/10 hover:bg-[#3BD1BB]/20 text-[#3BD1BB] border border-[#3BD1BB]/30 font-medium">
              <Toolbox className="h-4 w-4" />
              TOOLKIT
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sentiment Control</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAction("Request an insight")}>
                <BarChart3 className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Request an insight</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Create a project")}>
                <FileText className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Create a project</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Create a custom digest")}>
                <FileEdit className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Create a custom digest</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Publish a post")}>
                <Send className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Publish a post</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Ask your residents</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAction("Conduct a survey")}>
                <Users className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Conduct a survey</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Launch an online engagement")}>
                <Globe className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Launch an online engagement</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
