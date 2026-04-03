import { appendLog, store } from "../utils/inMemoryStore.js";
import { clamp, rand } from "../utils/random.js";

function evaluateHealth() {
  if (store.errorRate > 3 || store.apiLatency > 250) {
    store.systemHealth = "Warning";
    return;
  }
  store.systemHealth = "Good";
}

function evaluateFraudRisk() {
  if (store.suspiciousUsers > 45) {
    store.fraudRiskLevel = "High";
  } else if (store.suspiciousUsers > 25) {
    store.fraudRiskLevel = "Medium";
  } else {
    store.fraudRiskLevel = "Low";
  }
}

export function tickSystem() {
  store.activeUsers = Math.max(1500, store.activeUsers + rand(-120, 200));
  store.currentTraffic = Math.max(400, store.currentTraffic + rand(-45, 70));
  store.predictedTraffic = Math.max(700, store.currentTraffic + rand(90, 420));
  store.cpuUsage = clamp(store.cpuUsage + rand(-5, 6), 20, 96);
  store.apiLatency = clamp(store.apiLatency + rand(-18, 24), 65, 420);
  store.errorRate = clamp(store.errorRate + (Math.random() * 0.34 - 0.16), 0.2, 5.5);
  store.priorityUsers = Math.max(30, store.priorityUsers + rand(-6, 8));
  store.suspiciousUsers = Math.max(4, store.suspiciousUsers + rand(-3, 4));

  if (store.currentTraffic > 1300) {
    store.serverCount = Math.min(90, store.serverCount + 2);
  } else if (store.currentTraffic < 850) {
    store.serverCount = Math.max(24, store.serverCount - 1);
  }

  evaluateHealth();
  evaluateFraudRisk();

  return getSnapshot();
}

export function simulateTrafficSpike() {
  store.currentTraffic += rand(320, 560);
  store.predictedTraffic += rand(500, 800);
  store.saleEventDetected = true;
  store.cpuUsage = Math.min(96, store.cpuUsage + 12);
  store.apiLatency = Math.min(420, store.apiLatency + 36);
  evaluateHealth();
  appendLog("Traffic spike detected. Predictive auto-scaling preparing capacity.", "warn");

  setTimeout(() => {
    store.saleEventDetected = false;
  }, 12000);

  return getSnapshot();
}

export function simulateAnomaly() {
  const anomalyEvents = [
    { id: Date.now(), type: "Traffic Spike", severity: "critical", message: "Sudden traffic spike in US-East", timestamp: Date.now() },
    { id: Date.now() + 1, type: "Behavior", severity: "warning", message: "Unusual login burst from single ASN", timestamp: Date.now() },
    { id: Date.now() + 2, type: "Regional", severity: "warning", message: "Region-based anomaly in payment latency", timestamp: Date.now() }
  ];

  store.anomalies = anomalyEvents;
  store.apiLatency = Math.min(420, store.apiLatency + 60);
  store.errorRate = Math.min(5.5, store.errorRate + 0.8);
  evaluateHealth();
  appendLog("Anomaly event triggered by AI engine.", "warn");

  return { anomalies: store.anomalies, systemHealth: store.systemHealth };
}

export function simulateFraudAttack() {
  store.suspiciousUsers += rand(20, 34);
  store.errorRate = Math.min(5.5, store.errorRate + 0.6);
  store.fraudRiskLevel = "High";

  store.transactions = store.transactions.map((transaction) => {
    const roll = Math.random();
    if (roll > 0.95) {
      return { ...transaction, status: "Blocked" };
    }
    if (roll > 0.84) {
      return { ...transaction, status: "Suspicious" };
    }
    return { ...transaction, status: "Normal" };
  });

  appendLog("Fraud attack simulation launched. Adaptive rules blocked high-risk traffic.", "error");
  evaluateHealth();
  return {
    transactions: store.transactions,
    fraudRiskLevel: store.fraudRiskLevel,
    systemHealth: store.systemHealth
  };
}

export function getSnapshot() {
  return {
    activeUsers: store.activeUsers,
    currentTraffic: store.currentTraffic,
    predictedTraffic: store.predictedTraffic,
    systemHealth: store.systemHealth,
    fraudRiskLevel: store.fraudRiskLevel,
    serverCount: store.serverCount,
    cpuUsage: store.cpuUsage,
    apiLatency: store.apiLatency,
    errorRate: Number(store.errorRate.toFixed(2)),
    priorityUsers: store.priorityUsers,
    suspiciousUsers: store.suspiciousUsers,
    saleEventDetected: store.saleEventDetected
  };
}
