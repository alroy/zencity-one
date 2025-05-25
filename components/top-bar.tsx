"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface TopBarProps {
  customerName: string
}

export function TopBar({ customerName = "Adams County" }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [greeting, setGreeting] = useState<string>("")
  const [weather, setWeather] = useState<string>("50°F")
  const [showAnimation, setShowAnimation] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Check if animation has been shown this session
    const hasShownAnimation = sessionStorage.getItem("toolkitButtonAnimated")
    if (!hasShownAnimation) {
      setShowAnimation(true)
      sessionStorage.setItem("toolkitButtonAnimated", "true")
    }

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
    <>
      <style jsx global>{`
      `}</style>

      <div className="w-full bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
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
      </div>
    </>
  )
}
