import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ReportActions } from "./report-actions"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the useToast hook
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}))

const mockToast = jest.fn()

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Success" }),
  }),
) as jest.Mock

describe("ReportActions", () => {
  const mockOnBuildCustom = jest.fn()
  const surveyId = "survey-123"

  beforeEach(() => {
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    jest.clearAllMocks()
  })

  it("renders the split button", () => {
    render(<ReportActions surveyId={surveyId} onBuildCustom={mockOnBuildCustom} />)
    expect(screen.getByRole("button", { name: /generate report/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /more report options/i })).toBeInTheDocument()
  })

  it("clicking the main button generates an executive summary", async () => {
    render(
      <>
        <ReportActions surveyId={surveyId} onBuildCustom={mockOnBuildCustom} />
        <Toaster />
      </>,
    )

    await userEvent.click(screen.getByRole("button", { name: /generate report/i }))

    expect(mockToast).toHaveBeenCalledWith({
      description: "Generating executive summary report. It will be saved in the Reports section.",
      duration: 5000,
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "executive_summary", surveyId }),
      })
    })
  })

  it("opens dropdown and generates executive summary from menu", async () => {
    render(
      <>
        <ReportActions surveyId={surveyId} onBuildCustom={mockOnBuildCustom} />
        <Toaster />
      </>,
    )

    await userEvent.click(screen.getByRole("button", { name: /more report options/i }))
    await userEvent.click(screen.getByRole("menuitem", { name: /generate executive summary/i }))

    expect(mockToast).toHaveBeenCalledWith({
      description: "Generating executive summary report. It will be saved in the Reports section.",
      duration: 5000,
    })
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "executive_summary", surveyId }),
      })
    })
  })

  it("opens dropdown and generates comprehensive report from menu", async () => {
    render(
      <>
        <ReportActions surveyId={surveyId} onBuildCustom={mockOnBuildCustom} />
        <Toaster />
      </>,
    )

    await userEvent.click(screen.getByRole("button", { name: /more report options/i }))
    await userEvent.click(screen.getByRole("menuitem", { name: /generate comprehensive report/i }))

    expect(mockToast).toHaveBeenCalledWith({
      description: "Generating comprehensive report. It will be saved in the Reports section.",
      duration: 5000,
    })
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "comprehensive", surveyId }),
      })
    })
  })

  it("opens dropdown and calls onBuildCustom for custom report", async () => {
    render(<ReportActions surveyId={surveyId} onBuildCustom={mockOnBuildCustom} />)

    await userEvent.click(screen.getByRole("button", { name: /more report options/i }))
    await userEvent.click(screen.getByRole("menuitem", { name: /build a custom report/i }))

    expect(mockOnBuildCustom).toHaveBeenCalledTimes(1)
    expect(fetch).not.toHaveBeenCalled()
    expect(mockToast).not.toHaveBeenCalled()
  })

  describe("Keyboard Navigation and Accessibility", () => {
    it("allows keyboard navigation through menu items", async () => {
      render(<ReportActions surveyId={surveyId} onBuildCustom={mockOnBuildCustom} />)
      const trigger = screen.getByRole("button", { name: /more report options/i })
      trigger.focus()

      await userEvent.keyboard("{enter}")
      const menu = screen.getByRole("menu")
      expect(menu).toBeVisible()

      const menuItems = screen.getAllByRole("menuitem")
      expect(menuItems[0]).toHaveFocus()

      await userEvent.keyboard("{arrowdown}")
      expect(menuItems[1]).toHaveFocus()

      await userEvent.keyboard("{arrowdown}") // Skips separator
      expect(menuItems[2]).toHaveFocus()

      await userEvent.keyboard("{enter}")
      expect(mockOnBuildCustom).toHaveBeenCalledTimes(1)

      // Focus should return to the trigger button
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  })
})
