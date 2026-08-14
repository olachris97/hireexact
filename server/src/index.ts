import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import { candidatesRouter } from "./routes/candidates.js";
import { bookingsRouter } from "./routes/bookings.js";
import { applicationsRouter } from "./routes/applications.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { aiRouter } from "./routes/ai.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", brand: "HireExact" });
});

app.use("/api/auth", authRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ai", aiRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HireExact API listening on port ${PORT}`);
});
