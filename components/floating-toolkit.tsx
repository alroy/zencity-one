"use client"

import { useState, useEffect, useRef } from "react"
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

interface FloatingToolkitProps {
  onSectionChange?: (section: string, options?: any) => void
}

export function FloatingToolkit({ onSectionChange }: FloatingToolkitProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { toast } = useToast()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleAction = (action: string) => {
    // Handle the "Conduct a survey" action specifically
    if (action === "Conduct a survey" && onSectionChange) {
      // Navigate to survey manager with template modal open
      onSectionChange("survey-builder", {
        showTemplateModal: true,
      })
    } else {
      // For other actions, just show a toast notification
      toast({
        title: "Action Selected",
        description: `You selected: ${action}`,
        duration: 3000,
      })
    }

    setDropdownOpen(false)
  }

  // Handle dropdown state changes with animation
  const handleOpenChange = (open: boolean) => {
    if (open !== dropdownOpen) {
      setIsAnimating(true)

      // If we're opening, set state immediately
      if (open) {
        setDropdownOpen(open)
      } else {
        // If we're closing, delay the state change until animation completes
        setTimeout(() => {
          setDropdownOpen(open)
        }, 150) // Half of the rotation animation time
      }

      // Reset animation flag after animation completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
  }

  useEffect(() => {
    // Check if animation has been shown this session
    const hasShownAnimation = sessionStorage.getItem("toolkitButtonAnimated")
    if (!hasShownAnimation) {
      setShowAnimation(true)
      setTimeout(() => {
        sessionStorage.setItem("toolkitButtonAnimated", "true")
      }, 2000) // After intro animation completes
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Initial entry animation */
        @keyframes toolkitEntry {
          0% {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
          }
          60% {
            transform: scale(1.05) translateY(-5px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        /* Pulse animation for first-time users */
        @keyframes pulseHalo {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 209, 187, 0);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(59, 209, 187, 0.3);
          }
        }

        /* Subtle hover animation */
        @keyframes subtleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        /* Menu item entrance animation */
        @keyframes menuItemFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toolkit-button-wrapper {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 50;
        }

        .toolkit-button {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }

        .toolkit-button:hover:not(.animating) {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(59, 209, 187, 0.25);
        }

        .toolkit-button:active:not(.animating) {
          transform: scale(0.95);
        }

        /* Remove focus border/outline */
        .toolkit-button:focus {
          outline: none !important;
          box-shadow: 0 8px 16px rgba(59, 209, 187, 0.25) !important;
          border: none !important;
        }

        .toolkit-button-animated {
          animation: toolkitEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .toolkit-button-halo {
          animation: pulseHalo 2s cubic-bezier(0.4, 0, 0.6, 1) 2;
        }

        .toolkit-button-float {
          animation: subtleFloat 3s ease-in-out infinite;
        }

        .toolkit-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .toolkit-icon-rotate {
          transform: rotate(90deg);
        }

        /* Menu animation styles */
        .toolkit-menu-content {
          transform-origin: bottom right;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
        }

        .toolkit-menu-item {
          opacity: 0;
          animation: menuItemFadeIn 0.3s ease forwards;
        }

        .toolkit-menu-item:nth-child(1) { animation-delay: 0.05s; }
        .toolkit-menu-item:nth-child(2) { animation-delay: 0.1s; }
        .toolkit-menu-item:nth-child(3) { animation-delay: 0.15s; }
        .toolkit-menu-item:nth-child(4) { animation-delay: 0.2s; }
        .toolkit-menu-item:nth-child(5) { animation-delay: 0.25s; }
        .toolkit-menu-item:nth-child(6) { animation-delay: 0.3s; }
      `}</style>

      <div className="toolkit-button-wrapper">
        <DropdownMenu open={dropdownOpen} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
              ref={buttonRef}
              className={`toolkit-button rounded-full p-0 flex items-center justify-center shadow-lg 
                ${showAnimation ? "toolkit-button-animated toolkit-button-halo" : "toolkit-button-float"}
                ${isAnimating ? "animating" : ""}`}
              style={{
                width: "68px",
                height: "68px",
                padding: 0,
                overflow: "hidden",
                border: "none",
                background: "transparent",
                backgroundColor: "transparent",
              }}
              aria-label="Toolkit"
            >
              <div
                className={`toolkit-icon ${dropdownOpen || isAnimating ? "toolkit-icon-rotate" : ""}`}
                style={{ width: "68px", height: "68px", position: "relative" }}
              >
                <Image
                  src={dropdownOpen ? "/images/fab-close-icon-new.png" : "/images/fab-plus-icon-new.png"}
                  alt={dropdownOpen ? "Close toolkit" : "Open toolkit"}
                  fill
                  sizes="68px"
                  priority
                  style={{
                    objectFit: "contain",
                    transition: "opacity 0.3s ease",
                    opacity: isAnimating ? 0.8 : 1,
                  }}
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 mb-2 toolkit-menu-content" sideOffset={8}>
            <DropdownMenuLabel>Sentiment Control</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAction("Request an insight")} className="toolkit-menu-item">
                <BarChart3 className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Request an insight</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Create a project")} className="toolkit-menu-item">
                <FileText className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Create a project</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Create a custom digest")} className="toolkit-menu-item">
                <FileEdit className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Create a custom digest</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Publish a post")} className="toolkit-menu-item">
                <Send className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Publish a post</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Ask your residents</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAction("Conduct a survey")} className="toolkit-menu-item">
                <Users className="mr-2 h-4 w-4 text-[#3BD1BB]" />
                <span>Conduct a survey</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("Launch an online engagement")}
                className="toolkit-menu-item"
              >
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
