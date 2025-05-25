"use client"

import { PageBreadcrumb } from "@/components/page-breadcrumb"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbItems: {
    label: string
    path?: string
    isCurrent?: boolean
    isClickable?: boolean
  }[]
  onNavigate?: (path: string) => void
}

export function PageHeader({ title, description, breadcrumbItems, onNavigate }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <PageBreadcrumb items={breadcrumbItems} onNavigate={onNavigate} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
    </div>
  )
}
