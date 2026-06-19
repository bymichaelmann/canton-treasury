import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";

beforeEach(() => {
  vi.resetAllMocks();
});

// Mock global fetch
const mockBills = [
  {
    cusip: "912828ZJ9",
    amount: 10000000,
    maturityDate: "2027-06-19",
    coupon: 4.52,
  },
  {
    cusip: "912828ZK5",
    amount: 5000000,
    maturityDate: "2027-12-15",
    coupon: 4.35,
  },
];

function renderDashboard() {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
}

describe("Dashboard", () => {
  it("renders the page title and description", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockBills), { status: 200 })
    );
    renderDashboard();
    expect(
      screen.getByRole("heading", { name: /issuer dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mint and manage tokenized treasury bills/i)
    ).toBeInTheDocument();
  });

  it("displays the Mint T-Bill form with all required fields", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockBills), { status: 200 })
    );
    renderDashboard();
    expect(
      screen.getByRole("heading", { name: /mint t-bill/i })
    ).toBeInTheDocument();
    // Input fields are identified by their labels rendered as text
    expect(screen.getByText(/issuer party id/i)).toBeInTheDocument();
    expect(screen.getByText(/owner party id/i)).toBeInTheDocument();
    expect(screen.getByText(/face value/i)).toBeInTheDocument();
    expect(screen.getByText(/maturity date/i)).toBeInTheDocument();
    expect(screen.getByText(/coupon/i)).toBeInTheDocument();
    expect(screen.getByText(/cusip/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mint t-bill/i })
    ).toBeInTheDocument();
  });

  it("loads and displays issued T-Bills from the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockBills), { status: 200 })
    );
    renderDashboard();

    // Wait for bills to load
    await waitFor(() => {
      expect(screen.getByText("912828ZJ9")).toBeInTheDocument();
    });

    expect(screen.getByText("912828ZK5")).toBeInTheDocument();
    expect(screen.getByText("$10,000,000")).toBeInTheDocument();
    expect(screen.getByText("$5,000,000")).toBeInTheDocument();
  });

  it("shows loading state while fetching bills", () => {
    // Return a promise that never resolves to test loading state
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));
    renderDashboard();
    expect(screen.getByText(/loading bills/i)).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/error.*network error/i)).toBeInTheDocument();
    });
  });

  it("shows empty state when no bills returned", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/no bills issued yet/i)).toBeInTheDocument();
    });
  });
});
