import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ReportBuilderModal } from "./report-builder-modal"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import jest from "jest" // Declare the jest variable

// Mock the useToast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}))

// Mock the jsPDF library
const mockSave = jest.fn()
jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => {
    return {
      text: jest.fn(),
      setFontSize: jest.fn(),
      save: mockSave,
    }
  })
})

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

  beforeEach(() => {
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    mockToast.mockClear()
    mockOnOpenChange.mockClear()
    mockSave.mockClear()
    ;(jsPDF as jest.Mock).mockClear()
  })

  it("should render correctly and disable generate button", () => {
    render(<ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} />)
    expect(screen.getByText("Build Your Report")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Generate Report" })).toBeDisabled()
  })

  it("should enable generate button after adding a widget", () => {
    render(<ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} />)
    fireEvent.click(screen.getAllByRole("button", { name: /Add/i })[0])
    expect(screen.getByRole("button", { name: "Generate Report" })).not.toBeDisabled()
  })

  it("should show an error toast if 'Generate Report' is clicked with no widgets selected", () => {
    render(<ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} />)

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
    render(<ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByText("Your Report (0)")).toBeInTheDocument()

    const addButtons = screen.getAllByRole("button", { name: /Add/i })
    fireEvent.click(addButtons[0]) // Add "Top Insights"

    expect(screen.getByText("Your Report (1)")).toBeInTheDocument()
    expect(screen.getByText("Top Insights")).toBeInTheDocument()
  })

  it("should remove a widget from the report list when its remove button is clicked", () => {
    render(<ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} />)

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

  it("should successfully generate and download a report", async () => {
    render(<ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} />)

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
      // Check that PDF was created and saved
      expect(jsPDF).toHaveBeenCalledTimes(1)
      expect(mockSave).toHaveBeenCalledWith("Zencity-Report.pdf")
    })

    await waitFor(() => {
      // Check that modal was closed
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    await waitFor(() => {
      // Check that success toast was shown
      expect(mockToast).toHaveBeenCalledWith({
        title: "Report Downloaded",
        description: "Your custom report has been generated and downloaded.",
      })
    })
  })

  it("should show an error toast if PDF generation fails", async () => {
    // Make the save function throw an error
    mockSave.mockImplementation(() => {
      throw new Error("PDF Generation Failed")
    })

    render(<ReportBuilderModal open={true} onOpenChange={mockOnOpenChange} />)

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
})
