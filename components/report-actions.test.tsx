import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ReportActions } from "./report-actions"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock toast so tests run without side-effects
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}))

// Mock ReportBuilderModal – we just need to check that it shows when open
jest.mock("./report-builder-modal", () => ({
  ReportBuilderModal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="report-modal">Build Your Report</div> : null,
}))

describe("ReportActions split button", () => {
  const setup = () => render(<ReportActions surveyId="123" onBuildCustom={jest.fn()} />)

  it("opens the modal – not the menu – when the label is clicked", async () => {
    setup()
    const labelButton = screen.getByRole("button", { name: /build a custom report/i })
    await userEvent.click(labelButton)

    // Modal should appear
    expect(screen.getByTestId("report-modal")).toBeInTheDocument()

    // Dropdown menu should NOT be visible
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("opens the dropdown – not the modal – when the chevron is clicked", async () => {
    setup()
    const chevronButton = screen.getByRole("button", { name: /more report options/i })
    await userEvent.click(chevronButton)

    // Menu should be visible
    expect(screen.getByRole("menu")).toBeInTheDocument()

    // Modal should NOT appear
    expect(screen.queryByTestId("report-modal")).not.toBeInTheDocument()
  })

  it("keyboard navigation lands on both zones and triggers correct action", async () => {
    setup()
    const user = userEvent.setup()

    // First Tab → label button
    await user.tab()
    expect(screen.getByRole("button", { name: /build a custom report/i })).toHaveFocus()

    // Press Enter → modal opens
    await user.keyboard("[Enter]")
    expect(screen.getByTestId("report-modal")).toBeInTheDocument()

    // Close modal by clicking outside (simulate)
    await user.keyboard("[Escape]")

    // Second Tab → chevron button
    await user.tab()
    const chevronButton = screen.getByRole("button", { name: /more report options/i })
    expect(chevronButton).toHaveFocus()

    // Space key should open the dropdown
    await user.keyboard("[Space]")
    expect(screen.getByRole("menu")).toBeInTheDocument()
  })
})
