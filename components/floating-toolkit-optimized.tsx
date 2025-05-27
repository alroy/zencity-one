"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { BarChart3, FileText, FileEdit, Send, Users, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function FloatingToolkitOptimized() {
  const [showAnimation, setShowAnimation] = useState(false)
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
    // Check if animation has been shown this session
    const hasShownAnimation = sessionStorage.getItem("toolkitButtonAnimated")
    if (!hasShownAnimation) {
      setShowAnimation(true)
      sessionStorage.setItem("toolkitButtonAnimated", "true")
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes toolkitEntry {
          from {
            transform: scale(0.95) translateY(5px);
            opacity: 0.8;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulseHalo {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 209, 187, 0);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 209, 187, 0.3);
          }
        }

        .toolkit-button-wrapper {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 50;
        }

        .toolkit-button-animated {
          animation: toolkitEntry 300ms ease-out;
        }

        .toolkit-button-halo {
          animation: pulseHalo 1.5s ease-in-out 2;
        }
      `}</style>

      <div className="toolkit-button-wrapper">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className={`rounded-full p-0 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 ${
                showAnimation ? "toolkit-button-animated toolkit-button-halo" : ""
              }`}
              style={{
                width: "68px",
                height: "68px",
                background: "transparent",
                backgroundColor: "transparent",
                border: "none",
              }}
              aria-label="Toolkit"
            >
              <div style={{ width: "68px", height: "68px", position: "relative" }}>
                <Image
                  src={dropdownOpen ? "/images/fab-close-icon-new.png" : "/images/fab-plus-icon-new.png"}
                  alt={dropdownOpen ? "Close toolkit" : "Open toolkit"}
                  fill
                  sizes="68px"
                  priority
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
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
    </>
  )
}
