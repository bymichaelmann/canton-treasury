import { Router, Request, Response } from "express";
import { create, exercise } from "../canton.js";
import type {
  MintRequest,
  TransferRequest,
  SplitRequest,
} from "../types.js";

export const treasuryRouter = Router();

const TEMPLATE_ID = "CantonTreasury.TreasuryBill:TreasuryBill";

/**
 * POST /api/treasury/mint
 * Mint a new T-Bill token.
 */
treasuryRouter.post("/mint", async (req: Request, res: Response) => {
  try {
    const body = req.body as MintRequest;
    const result = await create(
      TEMPLATE_ID,
      {
        issuer: body.issuer,
        owner: body.owner,
        amount: body.amount,
        maturityDate: body.maturityDate,
        coupon: body.coupon,
        cusip: body.cusip,
        createdAt: new Date().toISOString().split("T")[0],
      },
      [body.issuer, body.owner]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/treasury/transfer
 * Transfer a T-Bill with compliance check.
 */
treasuryRouter.post("/transfer", async (req: Request, res: Response) => {
  try {
    const body = req.body as TransferRequest;
    const result = await exercise(
      TEMPLATE_ID,
      body.contractId,
      "Transfer",
      {
        newOwner: body.newOwner,
        restrictionCid: body.restrictionCid,
      },
      [body.newOwner]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/treasury/split
 * Split a T-Bill UTXO into two.
 */
treasuryRouter.post("/split", async (req: Request, res: Response) => {
  try {
    const body = req.body as SplitRequest;
    const result = await exercise(
      TEMPLATE_ID,
      body.contractId,
      "Split",
      { splitAmount: body.splitAmount },
      []
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
