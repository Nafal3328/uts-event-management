import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// ─── Middleware (Buka Gembok CORS) ───────────────────────────────────────────
// Dibikin simpel biar Frontend Vercel bisa akses tanpa ribet setting origin
app.use(cors()); 

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (_req: any, res: any) => {
  res.json({
    success: true,
    message: "Event Management System API Online",
    version: "1.0.0",
    endpoints: {
      categories: "/api/categories",
      speakers: "/api/speakers",
      events: "/api/events",
    },
  });
});

app.get("/health", (_req: any, res: any) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/categories", categoryRoutes);
app.use("/api/speakers", speakerRoutes);
app.use("/api/events", eventRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;