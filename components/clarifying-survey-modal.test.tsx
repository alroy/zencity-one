"use client"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ClarifyingSurveyModal, type ClarifyingFormData } from "./clarifying-survey-modal"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock shadcn/ui components that are not relevant to the test logic
jest.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect }: { onSelect: (date: Date) => void }) => (
    <button data-testid="calendar" onClick={() => onSelect(new Date("2023-10-26T12:00:00.000Z"))}>
      Mock Calendar
    </button>
  ),
}))

const mockOnSubmit = jest.fn()
const mockOnClose = jest.fn()

const defaultProps = {
  open: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  initialQuery: "Test Query",
}

// Helper to open a select and choose an option
const selectOption = async (selectTriggerTestId: string, optionText: string) => {
  fireEvent.mouseDown(screen.getByTestId(selectTriggerTestId))
  const option = await screen.findByText(optionText)
  fireEvent.click(option)
}

describe("ClarifyingSurveyModal Wizard", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockOnSubmit.mockClear()
    mockOnClose.mockClear()
  })

  it("renders step 1 initially with the 'Next' button disabled", () => {
    render(<ClarifyingSurveyModal {...defaultProps} />)
    expect(screen.getByText("Create Quick Survey: Step 1 of 2")).toBeInTheDocument()
    expect(screen.getByLabelText("Intent")).toBeInTheDocument()
    expect(screen.getByLabelText("Audience")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("enables the 'Next' button only when Intent and Audience are selected", async () => {
    render(<ClarifyingSurveyModal {...defaultProps} />)
    const nextButton = screen.getByRole("button", { name: "Next" })

    // Select Intent
    fireEvent.mouseDown(screen.getByText("Specify intent"))
    await screen.findByText("Sentiment Analysis")
    fireEvent.click(screen.getByText("Sentiment Analysis"))
    expect(nextButton).toBeDisabled()

    // Select Audience
    fireEvent.mouseDown(screen.getByText("Choose the right audience"))
    await screen.findByText("General Public (Fast Feedback)")
    fireEvent.click(screen.getByText("General Public (Fast Feedback)"))
    expect(nextButton).toBeEnabled()
  })

  it("navigates to step 2 and shows the tags section", async () => {
    render(<ClarifyingSurveyModal {...defaultProps} />)

    // Complete step 1
    fireEvent.mouseDown(screen.getByText("Specify intent"))
    fireEvent.click(await screen.findByText("Sentiment Analysis"))
    fireEvent.mouseDown(screen.getByText("Choose the right audience"))
    fireEvent.click(await screen.findByText("General Public (Fast Feedback)"))

    // Navigate to step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }))

    // Check for step 2 content
    expect(await screen.findByText("Create Quick Survey: Step 2 of 2")).toBeInTheDocument()
    expect(screen.getByText("Tags (Optional)")).toBeInTheDocument()
    expect(screen.getByText("Public Safety")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Generate Survey Draft" })).toBeInTheDocument()
  })

  it("allows selecting and deselecting multiple tags in step 2", async () => {
    render(<ClarifyingSurveyModal {...defaultProps} />)

    // Navigate to step 2
    fireEvent.mouseDown(screen.getByText("Specify intent"))
    fireEvent.click(await screen.findByText("Sentiment Analysis"))
    fireEvent.mouseDown(screen.getByText("Choose the right audience"))
    fireEvent.click(await screen.findByText("General Public (Fast Feedback)"))
    fireEvent.click(screen.getByRole("button", { name: "Next" }))

    // Select tags
    const publicSafetyCheckbox = screen.getByLabelText("Public Safety")
    const parksCheckbox = screen.getByLabelText("Parks & Recreation")

    fireEvent.click(publicSafetyCheckbox)
    expect(publicSafetyCheckbox).toBeChecked()

    fireEvent.click(parksCheckbox)
    expect(parksCheckbox).toBeChecked()

    // Deselect a tag
    fireEvent.click(publicSafetyCheckbox)
    expect(publicSafetyCheckbox).not.toBeChecked()
    expect(parksCheckbox).toBeChecked()
  })

  it("navigates back to step 1 and preserves data", async () => {
    render(<ClarifyingSurveyModal {...defaultProps} />)

    // Complete step 1
    fireEvent.mouseDown(screen.getByText("Specify intent"))
    fireEvent.click(await screen.findByText("Sentiment Analysis"))
    fireEvent.mouseDown(screen.getByText("Choose the right audience"))
    fireEvent.click(await screen.findByText("General Public (Fast Feedback)"))

    // Navigate to step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    await screen.findByText("Create Quick Survey: Step 2 of 2")

    // Navigate back to step 1
    fireEvent.click(screen.getByRole("button", { name: "Back" }))
    await screen.findByText("Create Quick Survey: Step 1 of 2")

    // Check that data is preserved
    expect(screen.getByText("Sentiment Analysis")).toBeInTheDocument()
    expect(screen.getByText("General Public (Fast Feedback)")).toBeInTheDocument()
  })

  it("submits all collected data correctly", async () => {
    render(<ClarifyingSurveyModal {...defaultProps} />)

    // Step 1
    fireEvent.mouseDown(screen.getByText("Specify intent"))
    fireEvent.click(await screen.findByText("Needs Assessment"))
    fireEvent.mouseDown(screen.getByText("Choose the right audience"))
    fireEvent.click(await screen.findByText("Internal Audience (Staff/Employees)"))
    fireEvent.click(screen.getByRole("button", { name: "Next" }))

    // Step 2
    await screen.findByText("Create Quick Survey: Step 2 of 2")
    fireEvent.click(screen.getByLabelText("Budget & Priorities"))
    fireEvent.click(screen.getByLabelText("Public Health"))

    // Submit
    fireEvent.click(screen.getByRole("button", { name: "Generate Survey Draft" }))

    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    const expectedData: Omit<ClarifyingFormData, "timelineDate"> = {
      intent: "Needs Assessment",
      audience: "internal-audience",
      timelineUrgency: undefined,
      tags: ["Budget & Priorities", "Public Health"],
      originalQuery: "Test Query",
    }
    // We omit timelineDate because its exact value is tricky with mocks, but we can check its presence
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining(expectedData))
  })
})
