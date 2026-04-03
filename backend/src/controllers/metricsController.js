import { getAnomalies } from "../services/anomalyService.js";
import { getFraudTransactions } from "../services/fraudService.js";
import { getSnapshot, tickSystem } from "../services/simulationService.js";
import { store } from "../utils/inMemoryStore.js";

export function getTraffic(_req, res) {
  tickSystem();
  const snapshot = getSnapshot();
  res.json({
    currentTraffic: snapshot.currentTraffic,
    predictedTraffic: snapshot.predictedTraffic,
    saleEventDetected: snapshot.saleEventDetected,
    activeUsers: snapshot.activeUsers
  });
}

export function getSystemHealth(_req, res) {
  const snapshot = getSnapshot();
  res.json({
    systemHealth: snapshot.systemHealth,
    cpuUsage: snapshot.cpuUsage,
    apiLatency: snapshot.apiLatency,
    errorRate: snapshot.errorRate,
    serverCount: snapshot.serverCount,
    fraudRiskLevel: snapshot.fraudRiskLevel,
    priorityUsers: snapshot.priorityUsers,
    suspiciousUsers: snapshot.suspiciousUsers,
    logs: store.logs.slice(0, 20)
  });
}

export function getAnomaliesController(_req, res) {
  res.json({ anomalies: getAnomalies() });
}

export function getFraudTransactionsController(_req, res) {
  res.json({ transactions: getFraudTransactions() });
}
