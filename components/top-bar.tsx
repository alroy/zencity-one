"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
// Removed useToast as it's not used in this component based on the latest requirements
// import { useToast } from "@/hooks/use-toast"

interface TopBarProps {
  customerName: string
}

export function TopBar({ customerName = "Willowbrook County" }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [greeting, setGreeting] = useState<string>("")
  const [weather, setWeather] = useState<string>("50°F") // Keeping weather as per original component

  // Removed toast as it's not used
  // const { toast } = useToast()

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date() // Current moment

      // Get current hour in Willowbrook County (America/New_York) for salutation
      const hourFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false, // Use 24-hour format for easier logic
        timeZone: "America/New_York",
      })
      const currentHourInNewYork = Number.parseInt(hourFormatter.format(now))

      // Refined Salutation logic with four intervals based on New York hour
      if (currentHourInNewYork >= 5 && currentHourInNewYork < 12) {
        // 5:00 AM to 11:59 AM (hours 5-11)
        setGreeting("Good Morning,")
      } else if (currentHourInNewYork >= 12 && currentHourInNewYork < 17) {
        // 12:00 PM to 4:59 PM (hours 12-16)
        setGreeting("Good Afternoon,")
      } else if (currentHourInNewYork >= 17 && currentHourInNewYork < 21) {
        // 5:00 PM to 8:59 PM (hours 17-20)
        setGreeting("Good Evening,")
      } else {
        // 9:00 PM to 4:59 AM (hours 21-4)
        setGreeting("Good Night,")
      }

      // Format time for display in Willowbrook County (America/New_York)
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit", // Added seconds for real-time feel
        hour12: true,
        timeZone: "America/New_York",
        timeZoneName: "short", // Displays EDT/EST
      })
      setCurrentTime(timeFormatter.format(now))

      // Update document title with current temperature
      document.title = `${weather} - Zencity Platform`
    }

    updateDateTime() // Initial call
    const intervalId = setInterval(updateDateTime, 1000) // Update every second

    // Mock weather data - in a real app, you would fetch this from a weather API
    // This is kept from the original component structure.
    setWeather("50°F")

    return () => clearInterval(intervalId) // Cleanup interval on component unmount
  }, []) // Empty dependency array ensures this runs once on mount

  return (
    <>
      {/* Removed style jsx global as it was empty and not used */}
      <div className="w-full bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <Image
              src="/images/city-illustration.png"
              alt="City illustration"
              width={42}
              height={42}
              className="h-auto"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">
              Time in Willowbrook County: {currentTime} | Weather: {weather}
            </div>
            <div className="text-xl font-semibold text-gray-800">
              {greeting} {customerName}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
