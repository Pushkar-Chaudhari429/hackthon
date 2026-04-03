import {
  getSnapshot,
  simulateAnomaly,
  simulateFraudAttack,
  simulateTrafficSpike
} from "../services/simulationService.js";

export function simulateSpikeController(_req, res) {
  const snapshot = simulateTrafficSpike();
  res.status(200).json({ message: "Traffic spike simulated", snapshot });
}

export function simulateAnomalyController(_req, res) {
  const result = simulateAnomaly();
  res.status(200).json({ message: "Anomaly simulation triggered", ...result });
}

export function simulateFraudController(_req, res) {
  const result = simulateFraudAttack();
  res.status(200).json({ message: "Fraud attack simulation triggered", ...result, snapshot: getSnapshot() });
}
