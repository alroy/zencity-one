import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { reportId: string } }) {
  const { reportId } = params
  console.log(`Download requested for report: ${reportId}`)

  // In a real application, you would fetch the report and generate a file.
  // Here, we simulate generating a PDF file in memory.
  const pdfContent = `This is a dummy PDF file for report ${reportId}.`
  const blob = new Blob([pdfContent], { type: "application/pdf" })

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report-${reportId}.pdf"`,
    },
  })
}
