import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes";
import speakerRoutes from "./routes/speakerRoutes";
import eventRoutes from "./routes/eventRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Event Management System API",
    version: "1.0.0",
    endpoints: {
      categories: "/api/categories",
      speakers: "/api/speakers",
      events: "/api/events",
    },
  });
});

app.get("/health", (_req, res) => {
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
  console.log(`📦 Environment: ${process.env.NODE_ENV ?? "development"}`);
  console.log(`🌐 CORS allowed for: ${FRONTEND_URL}`);
});

export default app;
