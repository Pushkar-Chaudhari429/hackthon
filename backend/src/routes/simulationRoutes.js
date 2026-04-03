import { Router } from "express";
import {
  simulateAnomalyController,
  simulateFraudController,
  simulateSpikeController
} from "../controllers/simulationController.js";

const router = Router();

router.post("/simulate/spike", simulateSpikeController);
router.post("/simulate/anomaly", simulateAnomalyController);
router.post("/simulate/fraud", simulateFraudController);

export default router;
