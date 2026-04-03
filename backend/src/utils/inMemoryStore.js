export const store = {
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
  anomalies: [
    { id: 1, type: "None", severity: "good", message: "No critical anomaly detected", timestamp: Date.now() }
  ],
  transactions: createTransactions(),
  logs: []
};

function createTransactions() {
  const items = [];
  for (let i = 0; i < 10; i += 1) {
    items.push({
      id: i + 1,
      userId: `U-${1000 + i * 7}`,
      amount: Math.floor(Math.random() * 2600) + 25,
      status: "Normal"
    });
  }
  return items;
}

export function appendLog(message, level = "info") {
  store.logs.unshift({
    id: crypto.randomUUID(),
    level,
    message,
    timestamp: Date.now()
  });
  store.logs = store.logs.slice(0, 50);
}
