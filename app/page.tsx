import { PageHeader } from "@/components/page-header"
import { SurveyManager } from "@/components/survey-manager"

export default function Home() {
  const breadcrumbs = [{ label: "Surveys", href: "/surveys" }]

  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Community Survey" breadcrumbs={breadcrumbs} />
      <main className="flex-1 p-6 overflow-auto">
        <SurveyManager />
      </main>
    </div>
  )
}
