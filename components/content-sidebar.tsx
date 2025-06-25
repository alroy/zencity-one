"use client"

import type React from "react"
import {
  List,
  ChevronDown,
  ImageIcon,
  Type,
  Target,
  Star,
  SlidersHorizontal,
  Table,
  MapPin,
  ListOrdered,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContentItem {
  name: string
  icon: React.ReactNode
  color: string
}

interface ContentSection {
  title: string
  items: ContentItem[]
}

const contentSections: ContentSection[] = [
  {
    title: "SELECTS",
    items: [
      {
        name: "Multiple Choice",
        icon: <List className="w-5 h-5" />,
        color: "bg-green-100 text-green-700",
      },
      {
        name: "Dropdown",
        icon: <ChevronDown className="w-5 h-5" />,
        color: "bg-green-100 text-green-700",
      },
      {
        name: "Image Select",
        icon: <ImageIcon className="w-5 h-5" />,
        color: "bg-green-100 text-green-700",
      },
      {
        name: "Yes or No",
        icon: (
          <span className="font-bold text-sm">
            Y<span className="text-gray-400">/</span>N
          </span>
        ),
        color: "bg-green-100 text-green-700",
      },
    ],
  },
  {
    title: "OPEN ENDED",
    items: [
      {
        name: "Text Input",
        icon: <Type className="w-5 h-5" />,
        color: "bg-red-100 text-red-700",
      },
    ],
  },
  {
    title: "NUMERIC",
    items: [
      {
        name: "Budget - Fixed Value",
        icon: <Target className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-700",
      },
      {
        name: "Budget - Open Value",
        icon: <Target className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-700",
      },
      {
        name: "Number Input",
        icon: <span className="font-bold text-sm">12</span>,
        color: "bg-blue-100 text-blue-700",
      },
      {
        name: "Rating",
        icon: <Star className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-700",
      },
      {
        name: "Slider",
        icon: <SlidersHorizontal className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-700",
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        name: "Matrix",
        icon: <Table className="w-5 h-5" />,
        color: "bg-yellow-100 text-yellow-700",
      },
      {
        name: "Map Pin Drop",
        icon: <MapPin className="w-5 h-5" />,
        color: "bg-yellow-100 text-yellow-700",
      },
      {
        name: "Image Pin Drop",
        icon: <MapPin className="w-5 h-5" />,
        color: "bg-yellow-100 text-yellow-700",
      },
      {
        name: "Ranking",
        icon: <ListOrdered className="w-5 h-5" />,
        color: "bg-yellow-100 text-yellow-700",
      },
      {
        name: "Image Ranking",
        icon: <ListOrdered className="w-5 h-5" />,
        color: "bg-yellow-100 text-yellow-700",
      },
    ],
  },
]

export function ContentSidebar() {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          Content
          <Info className="w-4 h-4 ml-2 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {contentSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-md mr-3 ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
