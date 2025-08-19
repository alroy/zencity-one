"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/* ─────────── types ─────────── */

export interface BreadcrumbItem {
  label: string
  path?: string
  isClickable?: boolean
  isCurrent?: boolean
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbItems?: BreadcrumbItem[]
  onNavigate?: (path: string) => void
  actions?: ReactNode
  className?: string
}

/* ─────────── helpers ─────────── */

const Breadcrumb = ({
  items,
  onNavigate,
}: {
  items: BreadcrumbItem[]
  onNavigate?: (path: string) => void
}) => {
  if (!items?.length) return null
  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          const clickable = item.isClickable && !isLast
          return (
            <li key={idx} className="flex items-center gap-1">
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onNavigate?.(item.path!)}
                  className="hover:underline text-gray-600"
                >
                  {item.label}
                </button>
              ) : (
                <span className={cn("truncate", item.isCurrent && "font-medium text-gray-700")}>{item.label}</span>
              )}
              {!isLast && <span className="px-1">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ─────────── component ─────────── */

export function PageHeader({ title, description, breadcrumbItems, onNavigate, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("space-y-1", className)}>
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} onNavigate={onNavigate} />}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>

        {actions ?? null}
      </div>
    </header>
  )
}

/* export default as convenience */
export default PageHeader
