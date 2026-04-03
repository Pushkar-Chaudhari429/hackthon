import { apiRequest } from "./apiClient";

export const dashboardService = {
  getTraffic: () => apiRequest("/traffic"),
  getSystemHealth: () => apiRequest("/system-health"),
  getAnomalies: () => apiRequest("/anomalies"),
  getFraudTransactions: () => apiRequest("/fraud-transactions"),
  simulateSpike: () => apiRequest("/simulate/spike", { method: "POST" }),
  simulateAnomaly: () => apiRequest("/simulate/anomaly", { method: "POST" }),
  simulateFraud: () => apiRequest("/simulate/fraud", { method: "POST" })
};
