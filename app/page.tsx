import { PageHeader } from "@/components/page-header"
import { SurveyManager } from "@/components/survey-manager"
import { CommunityMetricsDashboard } from "@/components/community-metrics-dashboard"

export default function Home() {
  const breadcrumbs = [{ label: "Surveys", href: "/surveys" }]

  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Community Survey" breadcrumbs={breadcrumbs} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <CommunityMetricsDashboard />
        </div>
        <SurveyManager />
      </main>
    </div>
  )
}
