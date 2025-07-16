import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { PostSaveModal } from "./post-save-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import jest from "jest" // Declare the jest variable

// Mocks
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}))

global.fetch = jest.fn()
window.URL.createObjectURL = jest.fn(() => "blob:http://localhost/mock-url")
window.URL.revokeObjectURL = jest.fn()

describe("PostSaveModal", () => {
  const mockToast = jest.fn()
  const mockOnOpenChange = jest.fn()
  const reportId = "report-123"

  beforeEach(() => {
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    mockToast.mockClear()
    mockOnOpenChange.mockClear()
    ;(global.fetch as jest.Mock).mockClear()
    ;(window.URL.createObjectURL as jest.Mock).mockClear()
    document.createElement("a").click = jest.fn() // Mock the click
  })

  const renderComponent = (props = {}) => {
    render(
      <>
        <PostSaveModal open={true} onOpenChange={mockOnOpenChange} reportId={reportId} {...props} />
        <Toaster />
      </>,
    )
  }

  it("renders with correct title, description, and buttons", () => {
    renderComponent()
    expect(screen.getByRole("heading", { name: "Report saved" })).toBeInTheDocument()
    expect(screen.getByText(/Your report has been generated and saved in the Reports section/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Download report" })).toBeInTheDocument()
  })

  it("calls onOpenChange with false when OK button is clicked", () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: "OK" }))
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("calls download API, shows toast, and does not close modal on 'Download report' click", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["test content"])),
    })
    renderComponent()

    const downloadButton = screen.getByRole("button", { name: "Download report" })
    fireEvent.click(downloadButton)

    // Check for loading state
    expect(await screen.findByRole("button", { name: /download report/i })).toBeDisabled()

    // Check for toast
    expect(mockToast).toHaveBeenCalledWith({
      description: "Your download is starting…",
      duration: 3000,
    })

    // Check for API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/reports/${reportId}/download`)
    })

    // Check that file download was triggered
    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled()
    })

    // Check that modal remains open
    expect(mockOnOpenChange).not.toHaveBeenCalled()

    // Check that loading state is removed
    expect(await screen.findByRole("button", { name: /download report/i })).not.toBeDisabled()
  })

  it("shows an error toast if download fails", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"))
    renderComponent()

    fireEvent.click(screen.getByRole("button", { name: "Download report" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Download Failed",
        description: "Could not download the report. Please try again later.",
        variant: "destructive",
      })
    })
  })
})
