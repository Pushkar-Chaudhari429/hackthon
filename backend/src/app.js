import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(requestLogger);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "AI Commerce backend is running.",
    frontend: "http://localhost:5173",
    apiBase: "/api"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend running" });
});

app.use("/api", metricsRoutes);
app.use("/api", simulationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
