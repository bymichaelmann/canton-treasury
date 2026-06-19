import express from "express";
import cors from "cors";
import { treasuryRouter } from "./routes/treasury.js";
import { complianceRouter } from "./routes/compliance.js";
import { dataroomRouter } from "./routes/dataroom.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "canton-treasury-backend" });
});

// Routes
app.use("/api/treasury", treasuryRouter);
app.use("/api/compliance", complianceRouter);
app.use("/api/dataroom", dataroomRouter);

app.listen(PORT, () => {
  console.log(`[canton-treasury] Backend listening on http://0.0.0.0:${PORT}`);
});

export default app;
