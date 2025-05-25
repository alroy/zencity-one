"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
            box-shadow: 0 0 0 0 rgba(252, 119, 83, 0);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(252, 119, 83, 0.3);
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
              className={`rounded-full p-0 flex items-center justify-center shadow-lg ${
                showAnimation ? "toolkit-button-animated toolkit-button-halo" : ""
              }`}
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #FDA891 0%, #FC7753 100%)",
                border: "none",
              }}
              aria-label="Toolkit"
            >
              <div className="bg-white rounded-full p-2">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Toolkit Box */}
                  <rect x="5" y="7" width="18" height="4" rx="1" fill="#FC7753" />
                  <rect x="7" y="11" width="14" height="10" rx="1" fill="#FDA891" fillOpacity="0.6" />

                  {/* Ruler */}
                  <rect x="8" y="13" width="12" height="2" rx="0.5" fill="#FC7753" />
                  <rect x="9" y="13" width="0.5" height="1" fill="white" />
                  <rect x="11" y="13" width="0.5" height="1" fill="white" />
                  <rect x="13" y="13" width="0.5" height="1" fill="white" />
                  <rect x="15" y="13" width="0.5" height="1" fill="white" />
                  <rect x="17" y="13" width="0.5" height="1" fill="white" />

                  {/* Paintbrush */}
                  <rect x="10" y="16" width="1.5" height="4" rx="0.75" fill="#FC7753" />
                  <path
                    d="M9 16C9 15.4477 9.44772 15 10 15H11.5C12.0523 15 12.5 15.4477 12.5 16V16H9V16Z"
                    fill="#FDA891"
                  />

                  {/* Color Palette */}
                  <circle cx="16" cy="18" r="1.5" fill="#FC7753" />
                  <circle cx="18" cy="16" r="1.5" fill="#FDA891" />
                </svg>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
            <DropdownMenuLabel>Sentiment Control</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAction("Request an insight")}>
                <BarChart3 className="mr-2 h-4 w-4 text-[#FC7753]" />
                <span>Request an insight</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Create a project")}>
                <FileText className="mr-2 h-4 w-4 text-[#FC7753]" />
                <span>Create a project</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Create a custom digest")}>
                <FileEdit className="mr-2 h-4 w-4 text-[#FC7753]" />
                <span>Create a custom digest</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Publish a post")}>
                <Send className="mr-2 h-4 w-4 text-[#FC7753]" />
                <span>Publish a post</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Ask your residents</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAction("Conduct a survey")}>
                <Users className="mr-2 h-4 w-4 text-[#FC7753]" />
                <span>Conduct a survey</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Launch an online engagement")}>
                <Globe className="mr-2 h-4 w-4 text-[#FC7753]" />
                <span>Launch an online engagement</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
