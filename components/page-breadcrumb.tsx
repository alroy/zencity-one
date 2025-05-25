"use client"

import { ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import React from "react"

interface BreadcrumbItemProps {
  label: string
  path?: string
  isCurrent?: boolean
  isClickable?: boolean
}

interface PageBreadcrumbProps {
  items: BreadcrumbItemProps[]
  onNavigate?: (path: string) => void
}

export function PageBreadcrumb({ items, onNavigate }: PageBreadcrumbProps) {
  const { toast } = useToast()

  const handleClick = (path?: string, isClickable?: boolean) => {
    if (!path || !isClickable) return

    if (onNavigate) {
      onNavigate(path)
    } else {
      // Default behavior - show toast for now
      toast({
        title: "Navigation",
        description: `Navigating to: ${path}`,
        duration: 3000,
      })
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="pt-6 pb-4">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li aria-hidden="true" className="text-gray-400">
                <ChevronRight className="h-4 w-4" />
              </li>
            )}
            <li className="text-sm">
              {index === items.length - 1 ? (
                <span aria-current="page" className="font-medium text-gray-900">
                  {item.label}
                </span>
              ) : item.isClickable ? (
                <button
                  onClick={() => handleClick(item.path, item.isClickable)}
                  className="text-gray-600 hover:text-[#3BD1BB] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-gray-600">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
