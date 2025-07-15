"use client"

import type React from "react"

import { BarChart3, FileText, LayoutGrid, Filter } from "lucide-react"

const PlaceholderBox = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div
    className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-4 text-center text-gray-400 ${className}`}
  >
    {children}
  </div>
)

export function SurveyResultsPlaceholder() {
  return (
    <div className="space-y-10 mt-8">
      {/* Filters */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
        <PlaceholderBox className="h-20">
          <Filter className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Filter Controls</span>
        </PlaceholderBox>
      </div>

      {/* Top Insights */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlaceholderBox className="h-36">
            <FileText className="h-8 w-8 mb-2" />
            <span className="font-semibold">Key Insight 1</span>
            <p className="text-xs mt-1">Textual summary placeholder</p>
          </PlaceholderBox>
          <PlaceholderBox className="h-36">
            <FileText className="h-8 w-8 mb-2" />
            <span className="font-semibold">Key Insight 2</span>
            <p className="text-xs mt-1">Textual summary placeholder</p>
          </PlaceholderBox>
          <PlaceholderBox className="h-36">
            <FileText className="h-8 w-8 mb-2" />
            <span className="font-semibold">Key Insight 3</span>
            <p className="text-xs mt-1">Textual summary placeholder</p>
          </PlaceholderBox>
        </div>
      </div>

      {/* Overall Results */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlaceholderBox className="h-44">
            <BarChart3 className="h-8 w-8 mb-2" />
            <span className="font-semibold">Overall Score</span>
            <p className="text-xs mt-1">Metric/Chart placeholder</p>
          </PlaceholderBox>
          <PlaceholderBox className="h-44">
            <BarChart3 className="h-8 w-8 mb-2" />
            <span className="font-semibold">Response Rate</span>
            <p className="text-xs mt-1">Metric/Chart placeholder</p>
          </PlaceholderBox>
          <PlaceholderBox className="h-44">
            <BarChart3 className="h-8 w-8 mb-2" />
            <span className="font-semibold">Key Demographic</span>
            <p className="text-xs mt-1">Metric/Chart placeholder</p>
          </PlaceholderBox>
        </div>
      </div>

      {/* Results by Measure */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Results by Measure</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <PlaceholderBox className="h-28">
            <span className="font-semibold">Measure A</span>
          </PlaceholderBox>
          <PlaceholderBox className="h-28">
            <span className="font-semibold">Measure B</span>
          </PlaceholderBox>
          <PlaceholderBox className="h-28">
            <span className="font-semibold">Measure C</span>
          </PlaceholderBox>
          <PlaceholderBox className="h-28">
            <span className="font-semibold">Measure D</span>
          </PlaceholderBox>
        </div>
        <PlaceholderBox className="h-96">
          <BarChart3 className="h-12 w-12 mb-4" />
          <span className="text-lg font-semibold">Detailed Chart by Measure</span>
          <p className="text-sm mt-1">Graph placeholder</p>
        </PlaceholderBox>
      </div>

      {/* Priority Matrix */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Priority Matrix</h2>
        <PlaceholderBox className="h-[450px]">
          <LayoutGrid className="h-12 w-12 mb-4" />
          <span className="text-lg font-semibold">Priority Matrix</span>
          <p className="text-sm mt-1">Quadrant chart placeholder</p>
        </PlaceholderBox>
      </div>
    </div>
  )
}
