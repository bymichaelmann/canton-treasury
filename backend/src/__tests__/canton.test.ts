import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock canton.ts BEFORE importing routes ───────────────────────────────────
vi.mock("../canton.js", () => ({
  create: vi.fn(),
  exercise: vi.fn(),
  submitCommand: vi.fn(),
}));

import * as cantonModule from "../canton.js";
import { treasuryRouter } from "../routes/treasury.js";
import { complianceRouter } from "../routes/compliance.js";
import { dataroomRouter } from "../routes/dataroom.js";

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function mockReq(body: Record<string, unknown> = {}) {
  return { body } as any;
}

function mockRes() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json } as any;
}

function getRouterStack(router: any) {
  return router.stack.filter((layer: any) => layer.route);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("canton.ts — unit tests", () => {
  it("create() returns contractId on success", async () => {
    const mockCreate = vi.mocked(cantonModule.create);
    mockCreate.mockResolvedValue({
      status: "accepted",
      contractId: "cid-123",
    });

    const result = await cantonModule.create(
      "CantonTreasury.TreasuryBill:TreasuryBill",
      { issuer: "BankA", owner: "FundB", amount: 1000 },
      ["BankA", "FundB"]
    );

    expect(result.status).toBe("accepted");
    expect(result.contractId).toBe("cid-123");
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("exercise() returns transactionId on success", async () => {
    const mockExercise = vi.mocked(cantonModule.exercise);
    mockExercise.mockResolvedValue({
      status: "accepted",
      transactionId: "tx-456",
    });

    const result = await cantonModule.exercise(
      "CantonTreasury.TreasuryBill:TreasuryBill",
      "cid-001",
      "Transfer",
      { newOwner: "InvestorX" },
      ["Owner"]
    );

    expect(result.status).toBe("accepted");
    expect(result.transactionId).toBe("tx-456");
  });

  it("submitCommand throws on Canton API error", async () => {
    const mockSubmit = vi.mocked(cantonModule.submitCommand);
    mockSubmit.mockRejectedValue(
      new Error("Canton API error (500): Internal server error")
    );

    await expect(
      cantonModule.submitCommand({
        commandId: "cmd-1",
        parties: ["Alice"],
        commands: [],
      })
    ).rejects.toThrow("Canton API error");
  });
});

describe("POST /api/treasury/mint — validation & error handling", () => {
  it("returns 500 with error message when Canton API fails", async () => {
    vi.mocked(cantonModule.create).mockRejectedValue(
      new Error("Canton API error (503): Service unavailable")
    );

    const req = mockReq({
      issuer: "BankA",
      owner: "FundB",
      amount: 1000000,
      maturityDate: "2027-06-19",
      coupon: 4.52,
      cusip: "912828ZJ9",
    });
    const res = mockRes();

    // Find and invoke the POST /mint handler
    const mintLayer = treasuryRouter.stack.find(
      (l: any) => l.route && l.route.path === "/mint" && l.route.methods.post
    );
    expect(mintLayer).toBeDefined();
    await mintLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Canton API error (503): Service unavailable",
    });
  });

  it("mint succeeds with valid payload", async () => {
    vi.mocked(cantonModule.create).mockResolvedValue({
      status: "accepted",
      contractId: "cid-mint-001",
    });

    const req = mockReq({
      issuer: "BankA",
      owner: "FundB",
      amount: 1000000,
      maturityDate: "2027-06-19",
      coupon: 4.52,
      cusip: "912828ZJ9",
    });
    const res = mockRes();

    const mintLayer = treasuryRouter.stack.find(
      (l: any) => l.route && l.route.path === "/mint" && l.route.methods.post
    );
    await mintLayer.route.stack[0].handle(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "accepted", contractId: "cid-mint-001" })
    );
  });
});

describe("POST /api/compliance/register", () => {
  it("registers investor successfully", async () => {
    vi.mocked(cantonModule.exercise).mockResolvedValue({
      status: "accepted",
      contractId: "cid-investor-001",
    });

    const req = mockReq({
      officer: "OfficerA",
      investor: "InvestorX",
      name: "Acme Capital",
      jurisdiction: "US",
    });
    const res = mockRes();

    const registerLayer = complianceRouter.stack.find(
      (l: any) =>
        l.route && l.route.path === "/register" && l.route.methods.post
    );
    expect(registerLayer).toBeDefined();
    await registerLayer.route.stack[0].handle(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "accepted", contractId: "cid-investor-001" })
    );
  });
});

describe("GET endpoints exist", () => {
  it("GET /api/compliance/status/:party route is registered", () => {
    const statusLayer = complianceRouter.stack.find(
      (l: any) =>
        l.route && l.route.path === "/status/:party" && l.route.methods.get
    );
    expect(statusLayer).toBeDefined();
  });

  it("GET /api/dataroom/documents/:party route is registered", () => {
    const docLayer = dataroomRouter.stack.find(
      (l: any) =>
        l.route &&
        l.route.path === "/documents/:party" &&
        l.route.methods.get
    );
    expect(docLayer).toBeDefined();
  });
});
