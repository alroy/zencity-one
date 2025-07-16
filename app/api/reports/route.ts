import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// In a real application, you would save this data to a database.
// For this example, we'll simulate a data store.
const reports: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { surveyId, widgets, format } = body

    if (!surveyId || !widgets || !format) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reportId = uuidv4()
    const newReport = {
      id: reportId,
      surveyId,
      widgets,
      format,
      status: "generating",
      createdAt: new Date().toISOString(),
    }

    reports.push(newReport)
    console.log("Generated new report:", newReport)

    // Simulate the time it takes to generate the report file.
    setTimeout(() => {
      const report = reports.find((r) => r.id === reportId)
      if (report) {
        report.status = "ready"
        console.log(`Report ${reportId} is ready for download.`)
      }
    }, 5000)

    return NextResponse.json({ id: reportId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
