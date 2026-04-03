import { Router } from "express";
import {
  getAnomaliesController,
  getFraudTransactionsController,
  getSystemHealth,
  getTraffic
} from "../controllers/metricsController.js";

const router = Router();

router.get("/traffic", getTraffic);
router.get("/system-health", getSystemHealth);
router.get("/anomalies", getAnomaliesController);
router.get("/fraud-transactions", getFraudTransactionsController);

export default router;
