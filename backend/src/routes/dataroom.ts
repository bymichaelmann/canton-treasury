import { Router, Request, Response } from "express";
import { create, exercise } from "../canton.js";
import type { CreateDocumentRequest, GrantAccessRequest } from "../types.js";

export const dataroomRouter = Router();

const DOCUMENT_TEMPLATE = "CantonTreasury.PrivateDataRoom:DataRoomDocument";
const ACCESS_TEMPLATE = "CantonTreasury.PrivateDataRoom:DocumentAccess";

/**
 * POST /api/dataroom/create
 * Create a new document in the private data room.
 */
dataroomRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateDocumentRequest;
    const result = await create(
      DOCUMENT_TEMPLATE,
      {
        issuer: body.issuer,
        documentId: body.documentId,
        title: body.title,
        description: body.description,
        ipfsHash: body.ipfsHash,
        isConfidential: body.isConfidential,
        createdAt: new Date().toISOString().split("T")[0],
      },
      [body.issuer]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/dataroom/grant
 * Grant document access to an investor.
 */
dataroomRouter.post("/grant", async (req: Request, res: Response) => {
  try {
    const body = req.body as GrantAccessRequest;
    const result = await exercise(
      DOCUMENT_TEMPLATE,
      body.documentCid,
      "GrantAccess",
      { investor: body.investor },
      [body.issuer]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /api/dataroom/documents/:party
 * Returns a mock array of documents visible to the party.
 */
dataroomRouter.get("/documents/:party", (req: Request, res: Response) => {
  const { party } = req.params;
  res.json([
    {
      id: "doc-001",
      documentId: "doc-001",
      issuer: party,
      title: "T-Bill Series A Prospectus",
      description: "Offering memorandum for Series A Treasury Bills",
      ipfsHash: "QmX7...3fZ",
      isConfidential: true,
      createdAt: "2026-06-19",
    },
    {
      id: "doc-002",
      documentId: "doc-002",
      issuer: party,
      title: "Q4 2026 Financial Statement",
      description: "Audited financial report",
      ipfsHash: "QmY8...4gA",
      isConfidential: true,
      createdAt: "2026-06-19",
    },
  ]);
});
