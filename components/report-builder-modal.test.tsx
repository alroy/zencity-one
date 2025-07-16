import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ReportBuilderModal } from "./report-builder-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import jest from "jest"

// Mocks
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}))

global.fetch = jest.fn()

jest.mock("lucide-react", () => ({
  __esModule: true,
  ...jest.requireActual("lucide-react"),
  GripVertical: () => <div data-testid="grip-icon" />,
  PlusCircle: () => <div data-testid="plus-icon" />,
  XCircle: () => <div data-testid="x-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}))

describe("ReportBuilderModal", () => {
  const mockToast = jest.fn()
  const mockOnOpenChange = jest.fn()
  const mockOnSaveSuccess = jest.fn()
  const surveyId = "survey-123"

  beforeEach(() => {
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    mockToast.mockClear()
    mockOnOpenChange.mockClear()
    mockOnSaveSuccess.mockClear()
    ;(global.fetch as jest.Mock).mockClear()
  })

  const renderComponent = (props = {}) => {
    render(
      <>
        <ReportBuilderModal
          open={true}
          onOpenChange={mockOnOpenChange}
          surveyId={surveyId}
          onSaveSuccess={mockOnSaveSuccess}
          {...props}
        />
        <Toaster />
      </>,
    )
  }

  it("should render correctly and disable save button", () => {
    renderComponent()
    expect(screen.getByText("Build Your Report")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save Report" })).toBeDisabled()
  })

  it("should enable save button after adding a widget", () => {
    renderComponent()
    fireEvent.click(screen.getAllByRole("button", { name: /Add/i })[0])
    expect(screen.getByRole("button", { name: "Save Report" })).not.toBeDisabled()
  })

  it("should show an error toast if 'Save Report' is clicked with no widgets selected", () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: "Save Report" }))
    expect(mockToast).toHaveBeenCalledWith({
      title: "No Widgets Selected",
      description: "Please add at least one widget to save a report.",
      variant: "destructive",
    })
    expect(mockOnSaveSuccess).not.toHaveBeenCalled()
  })

  it("should successfully save a custom report and call onSaveSuccess", async () => {
    const newReportId = "new-rep-id"
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, reportId: newReportId }),
    })

    renderComponent()

    // Add a widget and select slides format
    fireEvent.click(screen.getAllByRole("button", { name: /Add/i })[0])
    fireEvent.click(screen.getByRole("button", { name: "Slides" }))

    // Click save
    const saveButton = screen.getByRole("button", { name: "Save Report" })
    fireEvent.click(saveButton)

    // Check for loading state
    expect(await screen.findByTestId("loader-icon")).toBeInTheDocument()
    expect(saveButton).toBeDisabled()

    // Wait for API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          surveyId: surveyId,
          widgets: ["top-insights"],
          format: "slides",
        }),
      })
    })

    // Check that success callback was called with correct data
    await waitFor(() => {
      expect(mockOnSaveSuccess).toHaveBeenCalledWith(newReportId, "slides")
    })

    // Check that modal does not close itself
    expect(mockOnOpenChange).not.toHaveBeenCalled()
  })

  it("should show an error toast if API call fails on save", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"))
    renderComponent()

    fireEvent.click(screen.getAllByRole("button", { name: /Add/i })[0])
    fireEvent.click(screen.getByRole("button", { name: "Save Report" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Save Failed",
        description: "Could not save the report configuration. Please try again.",
        variant: "destructive",
      })
    })

    expect(mockOnSaveSuccess).not.toHaveBeenCalled()
    expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument()
  })
})
