import { useCallback, useEffect, useMemo, useState } from "react";
import { dashboardService } from "../services/dashboardService";

function defaultMetrics() {
  return {
    activeUsers: 12100,
    currentTraffic: 920,
    predictedTraffic: 1840,
    systemHealth: "Good",
    fraudRiskLevel: "Low",
    serverCount: 42,
    cpuUsage: 44,
    apiLatency: 112,
    errorRate: 0.8,
    priorityUsers: 120,
    suspiciousUsers: 18,
    saleEventDetected: false,
    logs: []
  };
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [transactions, setTransactions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [error, setError] = useState("");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const [trafficSeries, setTrafficSeries] = useState(Array.from({ length: 20 }, (_, i) => 850 + i * 5));
  const [predictedSeries, setPredictedSeries] = useState(Array.from({ length: 20 }, (_, i) => 960 + i * 6));
  const labels = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), []);

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      const [trafficData, systemData, anomalyData, fraudData] = await Promise.all([
        dashboardService.getTraffic(),
        dashboardService.getSystemHealth(),
        dashboardService.getAnomalies(),
        dashboardService.getFraudTransactions()
      ]);

      setMetrics((prev) => ({
        ...prev,
        ...trafficData,
        ...systemData
      }));
      setAnomalies(anomalyData.anomalies || []);
      setTransactions(fraudData.transactions || []);

      setTrafficSeries((prev) => [...prev.slice(1), trafficData.currentTraffic]);
      setPredictedSeries((prev) => [...prev.slice(1), trafficData.predictedTraffic]);
      setLastUpdatedAt(Date.now());
      return { ok: true };
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
      return { ok: false, error: err.message || "Unable to load dashboard data." };
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    if (!isAutoRefresh) {
      return undefined;
    }
    const id = setInterval(loadDashboard, 3000);
    return () => clearInterval(id);
  }, [isAutoRefresh, loadDashboard]);

  const runSimulation = useCallback(async (kind) => {
    try {
      setError("");
      if (kind === "spike") {
        await dashboardService.simulateSpike();
      }
      if (kind === "anomaly") {
        await dashboardService.simulateAnomaly();
      }
      if (kind === "fraud") {
        await dashboardService.simulateFraud();
      }
      await loadDashboard();
      return { ok: true };
    } catch (err) {
      setError(err.message || "Simulation failed.");
      return { ok: false, error: err.message || "Simulation failed." };
    }
  }, [loadDashboard]);

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefresh((prev) => !prev);
  }, []);

  return {
    labels,
    metrics,
    anomalies,
    transactions,
    error,
    trafficSeries,
    predictedSeries,
    runSimulation,
    loadDashboard,
    isAutoRefresh,
    toggleAutoRefresh,
    lastUpdatedAt
  };
}
