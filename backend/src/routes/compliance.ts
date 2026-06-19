import { Router, Request, Response } from "express";
import { create, exercise } from "../canton.js";
import type { RegisterInvestorRequest, ApproveKYCRequest } from "../types.js";

export const complianceRouter = Router();

const OFFICER_TEMPLATE = "CantonTreasury.InvestorRegistry:ComplianceOfficer";
const RECORD_TEMPLATE = "CantonTreasury.InvestorRegistry:InvestorRecord";

/**
 * POST /api/compliance/register
 * Register a new investor for KYC/AML.
 */
complianceRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body as RegisterInvestorRequest;
    const result = await exercise(
      OFFICER_TEMPLATE,
      body.officer,
      "RegisterInvestor",
      {
        investor: body.investor,
        name: body.name,
        jurisdiction: body.jurisdiction,
      },
      [body.officer]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/compliance/approve
 * Approve (or update) an investor's KYC status.
 */
complianceRouter.post("/approve", async (req: Request, res: Response) => {
  try {
    const body = req.body as ApproveKYCRequest;
    const result = await exercise(
      RECORD_TEMPLATE,
      body.contractId,
      "UpdateKYCStatus",
      { newStatus: "Approved" },
      [body.officer]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /api/compliance/status/:party
 * Returns a structured mock of the investor's KYC status.
 */
complianceRouter.get("/status/:party", (req: Request, res: Response) => {
  const { party } = req.params;
  res.json({
    party,
    kycStatus: "Approved",
    accreditation: "AccreditedInvestor",
    jurisdiction: "US",
    registeredAt: "2026-06-19",
  });
});
