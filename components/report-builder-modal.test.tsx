import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ReportBuilderModal } from "./report-builder-modal"
import { useToast } from "@/hooks/use-toast"
import jest from "jest"
import { Toaster } from "@/components/ui/toaster"

// Mock the useToast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}))

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  }),
) as jest.Mock

// Mock Lucide icons
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
  const surveyId = "survey-123"

  beforeEach(() => {
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    mockToast.mockClear()
    mockOnOpenChange.mockClear()
    ;(global.fetch as jest.Mock).mockClear()
  })

  const renderComponent = () => {
    render(
      <>
        <ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} surveyId={surveyId} />
        <Toaster />
      </>,
    )
  }

  it("should render correctly and disable generate button", () => {
    renderComponent()
    expect(screen.getByText("Build Your Report")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Generate Report" })).toBeDisabled()
  })

  it("should enable generate button after adding a widget", () => {
    renderComponent()
    fireEvent.click(screen.getAllByRole("button", { name: /Add/i })[0])
    expect(screen.getByRole("button", { name: "Generate Report" })).not.toBeDisabled()
  })

  it("should show an error toast if 'Generate Report' is clicked with no widgets selected", () => {
    renderComponent()

    const generateButton = screen.getByRole("button", { name: "Generate Report" })
    fireEvent.click(generateButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: "No Widgets Selected",
      description: "Please add at least one widget to generate a report.",
      variant: "destructive",
    })
    expect(mockOnOpenChange).not.toHaveBeenCalled()
  })

  it("should add a widget to the report list when 'Add' is clicked", () => {
    renderComponent()

    expect(screen.getByText("Your Report (0)")).toBeInTheDocument()

    const addButtons = screen.getAllByRole("button", { name: /Add/i })
    fireEvent.click(addButtons[0]) // Add "Top Insights"

    expect(screen.getByText("Your Report (1)")).toBeInTheDocument()
    expect(screen.getByText("Top Insights")).toBeInTheDocument()
  })

  it("should remove a widget from the report list when its remove button is clicked", () => {
    renderComponent()

    // Add a widget first
    const addButtons = screen.getAllByRole("button", { name: /Add/i })
    fireEvent.click(addButtons[0])
    expect(screen.getByText("Your Report (1)")).toBeInTheDocument()

    // Remove the widget
    const removeButton = screen.getByRole("button", { name: /Remove Top Insights/i })
    fireEvent.click(removeButton)

    expect(screen.getByText("Your Report (0)")).toBeInTheDocument()
    expect(screen.queryByText("Top Insights")).not.toBeInTheDocument()
  })

  it("should successfully generate a custom report", async () => {
    renderComponent()

    // Add a widget
    fireEvent.click(screen.getAllByRole("button", { name: /Add/i })[0])

    // Click generate
    const generateButton = screen.getByRole("button", { name: "Generate Report" })
    fireEvent.click(generateButton)

    // Check for loading state
    expect(await screen.findByText("Generating...")).toBeInTheDocument()
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument()
    expect(generateButton).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()

    // Wait for async operations to complete
    await waitFor(() => {
      // Check that API was called
      expect(global.fetch).toHaveBeenCalledWith("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          surveyId: surveyId,
          widgets: ["top-insights"],
        }),
      })
    })

    await waitFor(() => {
      // Check that success toast was shown
      expect(mockToast).toHaveBeenCalledWith({
        title: "Custom report generation started",
        description: "Your report will be available in the reports section shortly.",
        duration: 5000,
      })
    })

    await waitFor(() => {
      // Check that modal was closed
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it("should show an error toast if API call fails", async () => {
    // Make fetch fail
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error("API Error")))

    renderComponent()

    fireEvent.click(screen.getAllByRole("button", { name: /Add/i })[0])
    fireEvent.click(screen.getByRole("button", { name: "Generate Report" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Generation Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    })

    // Ensure modal did not try to close
    expect(mockOnOpenChange).not.toHaveBeenCalled()
    // Ensure loading state is removed
    expect(screen.queryByText("Generating...")).not.toBeInTheDocument()
  })

  it("renders the modal with title and description", () => {
    renderComponent()
    expect(screen.getByRole("heading", { name: /build a custom report/i })).toBeInTheDocument()
    expect(screen.getByText(/select the sections you want to include/i)).toBeInTheDocument()
  })

  it("renders all available section checkboxes", () => {
    renderComponent()
    expect(screen.getByLabelText(/executive summary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/methodology/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/key findings/i)).toBeInTheDocument()
  })

  it("allows selecting and deselecting sections", async () => {
    renderComponent()
    const methodologyCheckbox = screen.getByLabelText(/methodology/i)
    const summaryCheckbox = screen.getByLabelText(/executive summary/i)

    expect(methodologyCheckbox).not.toBeChecked()
    expect(summaryCheckbox).toBeChecked()

    await fireEvent.click(methodologyCheckbox)
    expect(methodologyCheckbox).toBeChecked()

    await fireEvent.click(summaryCheckbox)
    expect(summaryCheckbox).not.toBeChecked()
  })

  it("calls the API with correct data on 'Build Report' click", async () => {
    renderComponent()
    const buildButton = screen.getByRole("button", { name: /build report/i })

    // Deselect one default option and select a new one
    await fireEvent.click(screen.getByLabelText(/executive summary/i))
    await fireEvent.click(screen.getByLabelText(/methodology/i))

    await fireEvent.click(buildButton)

    expect(mockToast).toHaveBeenCalledWith({
      description: "Building your custom report. It will be saved in the Reports section.",
      duration: 5000,
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          surveyId,
          sections: ["key_findings", "detailed_results", "methodology"],
        }),
      })
    })

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it("shows an error toast if no sections are selected", async () => {
    renderComponent()
    // Deselect all default sections
    await fireEvent.click(screen.getByLabelText(/executive summary/i))
    await fireEvent.click(screen.getByLabelText(/key findings/i))
    await fireEvent.click(screen.getByLabelText(/detailed_results/i))

    await fireEvent.click(screen.getByRole("button", { name: /build report/i }))

    expect(mockToast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "No sections selected",
      description: "Please select at least one section to include in the report.",
    })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("closes the modal on 'Cancel' click", async () => {
    renderComponent()
    await fireEvent.click(screen.getByRole("button", { name: /cancel/i }))
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})
