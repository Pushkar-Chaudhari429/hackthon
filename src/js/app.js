const state = {
  activeUsers: 12100,
  currentTraffic: 920,
  predictedTraffic: 1840,
  health: "Good",
  fraudRisk: "Low",
  serverCount: 42,
  cpu: 44,
  latency: 112,
  errorRate: 0.8,
  priorityUsers: 120,
  suspiciousUsers: 18,
  saleEvent: false
};

const labels = Array.from({ length: 20 }, (_, i) => i + 1);
const trafficSeries = Array.from({ length: 20 }, () => rand(700, 1000));
const predSeries = Array.from({ length: 20 }, () => rand(800, 1150));

const trafficChart = new Chart(document.getElementById("trafficChart"), {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Traffic Requests/min",
      data: trafficSeries,
      borderColor: "#2a7fff",
      pointRadius: 0,
      tension: 0.35,
      fill: true,
      backgroundColor: "rgba(42,127,255,0.18)"
    }]
  },
  options: chartOpts("Requests")
});

const predictChart = new Chart(document.getElementById("predictChart"), {
  type: "line",
  data: {
    labels,
    datasets: [
      {
        label: "Current",
        data: trafficSeries.slice(),
        borderColor: "#1d4f9a",
        pointRadius: 0,
        tension: 0.3
      },
      {
        label: "Predicted",
        data: predSeries,
        borderColor: "#22b59a",
        pointRadius: 0,
        borderDash: [7, 5],
        tension: 0.3
      }
    ]
  },
  options: chartOpts("Traffic")
});

function chartOpts(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#26406b" } } },
    scales: {
      x: { ticks: { color: "#6c7ea4" }, grid: { color: "rgba(170,190,224,0.18)" } },
      y: { ticks: { color: "#6c7ea4" }, title: { display: true, text: yLabel }, grid: { color: "rgba(170,190,224,0.18)" } }
    }
  };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function withCommas(v) {
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function log(message, level = "info") {
  const feed = document.getElementById("logFeed");
  const t = new Date().toLocaleTimeString();
  const row = document.createElement("div");
  row.className = "log-line";
  row.innerHTML = "<span class='tag " + level + "'>[" + level.toUpperCase() + "]</span>" + t + " - " + message;
  feed.prepend(row);
  while (feed.children.length > 40) feed.removeChild(feed.lastChild);
}

function setHealth(status) {
  state.health = status;
  const healthText = document.getElementById("healthText");
  const global = document.getElementById("globalHealth");
  healthText.textContent = status;
  global.className = "status-pill " +
    (status === "Good" ? "status-good" : status === "Warning" ? "status-warn" : "status-critical");
  global.textContent = "System Health: " + status.toUpperCase();
}

function updateOverview() {
  document.getElementById("activeUsers").textContent = withCommas(state.activeUsers);
  document.getElementById("predTraffic").textContent = withCommas(state.predictedTraffic);
  document.getElementById("fraudRisk").textContent = state.fraudRisk;
}

function updateHealing() {
  document.getElementById("serverCount").textContent = state.serverCount;
  document.getElementById("loadA").style.width = rand(30, 55) + "%";
  document.getElementById("loadB").style.width = rand(25, 50) + "%";
  document.getElementById("loadC").style.width = rand(20, 45) + "%";
  document.getElementById("serviceHealth").textContent = state.errorRate > 2 ? "Overloaded" : "Healthy";
}

function updateObservability() {
  document.getElementById("cpuMetric").textContent = state.cpu + "%";
  document.getElementById("latencyMetric").textContent = state.latency + "ms";
  document.getElementById("errorMetric").textContent = state.errorRate.toFixed(1) + "%";
  document.getElementById("cpuBar").style.width = state.cpu + "%";
  document.getElementById("latencyBar").style.width = Math.min(100, Math.floor(state.latency / 3)) + "%";
  document.getElementById("errorBar").style.width = Math.min(100, Math.floor(state.errorRate * 10)) + "%";

  const alerts = [];
  if (state.latency > 220) alerts.push("<div class='alert-item alert-warning'>High latency detected</div>");
  if (state.cpu > 85) alerts.push("<div class='alert-item alert-warning'>Compute pressure rising</div>");
  if (state.errorRate > 2.5) alerts.push("<div class='alert-item alert-critical'>Database overload or service instability</div>");
  if (!alerts.length) alerts.push("<div class='alert-item alert-good'>All telemetry pipelines healthy</div>");
  document.getElementById("obsAlerts").innerHTML = alerts.join("");
}

function refreshForecast() {
  const growth = Math.max(1, Math.floor(((state.predictedTraffic - state.currentTraffic) / state.currentTraffic) * 100));
  document.getElementById("forecastText").textContent = "Traffic expected to increase by " + growth + "%";
  document.getElementById("eventText").textContent = "Event trigger: " + (state.saleEvent ? "Sale Event Detected" : "None");
}

function setFraudLevel() {
  if (state.suspiciousUsers > 45) state.fraudRisk = "High";
  else if (state.suspiciousUsers > 25) state.fraudRisk = "Medium";
  else state.fraudRisk = "Low";
}

function tick() {
  state.activeUsers = Math.max(1500, state.activeUsers + rand(-120, 200));
  state.currentTraffic = Math.max(400, state.currentTraffic + rand(-45, 70));
  state.predictedTraffic = Math.max(700, state.currentTraffic + rand(90, 420));
  state.cpu = Math.max(20, Math.min(96, state.cpu + rand(-5, 6)));
  state.latency = Math.max(65, Math.min(420, state.latency + rand(-18, 24)));
  state.errorRate = Math.max(0.2, Math.min(5.5, state.errorRate + (Math.random() * 0.34 - 0.16)));
  state.priorityUsers = Math.max(30, state.priorityUsers + rand(-6, 8));
  state.suspiciousUsers = Math.max(4, state.suspiciousUsers + rand(-3, 4));

  if (state.currentTraffic > 1300) {
    state.serverCount = Math.min(90, state.serverCount + 2);
  } else if (state.currentTraffic < 850) {
    state.serverCount = Math.max(24, state.serverCount - 1);
  }

  if (state.errorRate > 3 || state.latency > 250) setHealth("Warning");
  else setHealth("Good");

  setFraudLevel();
  updateOverview();
  updateHealing();
  updateObservability();
  refreshForecast();

  document.getElementById("priorityUsers").textContent = state.priorityUsers;
  document.getElementById("suspiciousUsers").textContent = state.suspiciousUsers;

  trafficSeries.push(state.currentTraffic);
  trafficSeries.shift();
  predSeries.push(state.predictedTraffic);
  predSeries.shift();

  trafficChart.data.datasets[0].data = trafficSeries;
  trafficChart.update("none");

  predictChart.data.datasets[0].data = trafficSeries;
  predictChart.data.datasets[1].data = predSeries;
  predictChart.update("none");
}

function seedFraudTable() {
  const body = document.getElementById("fraudTableBody");
  body.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement("tr");
    const amount = rand(25, 2600);
    const user = "U-" + rand(1000, 9999);
    tr.innerHTML = "<td>" + user + "</td><td>$" + amount + "</td><td>Normal</td>";
    tr.className = "row-normal";
    body.appendChild(tr);
  }
}

function runFraudScan() {
  const rows = [...document.querySelectorAll("#fraudTableBody tr")];
  rows.forEach((r) => {
    const roll = Math.random();
    let status = "Normal";
    let cls = "row-normal";
    if (roll > 0.84 && roll <= 0.95) {
      status = "Suspicious";
      cls = "row-suspicious";
    } else if (roll > 0.95) {
      status = "Blocked";
      cls = "row-blocked";
    }
    r.className = cls;
    r.children[2].textContent = status;
  });
  const blocked = rows.filter(r => r.children[2].textContent === "Blocked").length;
  const suspicious = rows.filter(r => r.children[2].textContent === "Suspicious").length;
  state.suspiciousUsers += suspicious + blocked;
  setFraudLevel();
  updateOverview();
  log("Fraud scan completed. Suspicious: " + suspicious + ", Blocked: " + blocked, blocked > 0 ? "warn" : "success");
}

function triggerAnomalyEvent() {
  const alerts = [
    "<div class='alert-item alert-critical'>Sudden traffic spike in US-East</div>",
    "<div class='alert-item alert-warning'>Unusual login burst from single ASN</div>",
    "<div class='alert-item alert-warning'>Region-based anomaly in payment latency</div>"
  ];
  document.getElementById("anomalyList").innerHTML = alerts.join("");
  state.latency += 60;
  state.errorRate += 0.8;
  setHealth("Warning");
  log("Anomaly event triggered by AI engine", "warn");
}

function simulateTrafficSpike() {
  state.currentTraffic += rand(320, 560);
  state.predictedTraffic += rand(500, 800);
  state.saleEvent = true;
  state.cpu = Math.min(96, state.cpu + 12);
  state.latency = Math.min(420, state.latency + 36);
  refreshForecast();
  log("Traffic spike detected. Predictive auto-scaling preparing capacity.", "warn");
  setTimeout(() => {
    state.saleEvent = false;
    refreshForecast();
  }, 14000);
}

function simulateFraudAttack() {
  state.suspiciousUsers += rand(20, 34);
  state.errorRate += 0.6;
  state.fraudRisk = "High";
  updateOverview();
  runFraudScan();
  log("Fraud attack simulation launched. Attack vectors blocked with adaptive rules.", "error");
}

function simulateApiFailure() {
  document.getElementById("serviceHealth").textContent = "Overloaded";
  document.getElementById("rerouteStatus").textContent = "Rerouting...";
  state.errorRate += 1.2;
  setHealth("Critical");
  log("API failure detected. Self-healing restart initiated.", "error");
  setTimeout(() => {
    document.getElementById("serviceHealth").textContent = "Healthy";
    document.getElementById("rerouteStatus").textContent = "Complete";
    state.errorRate = Math.max(0.5, state.errorRate - 1.0);
    setHealth("Good");
    log("Service auto-restart successful. Traffic rerouted and stabilized.", "success");
  }, 3500);
}

function simulateCheckoutCycle() {
  state.priorityUsers += rand(8, 16);
  state.suspiciousUsers = Math.max(3, state.suspiciousUsers - rand(2, 6));
  document.getElementById("priorityUsers").textContent = state.priorityUsers;
  document.getElementById("suspiciousUsers").textContent = state.suspiciousUsers;
  log("Checkout protection prioritized trusted users; suspicious bots delayed.", "info");
}

function simulateAttackBlocking() {
  document.getElementById("ddosStatus").textContent = "Attack Mitigated";
  document.getElementById("apiAbuse").textContent = "Detected";
  document.getElementById("rateLimit").textContent = "Strict";
  state.cpu = Math.min(96, state.cpu + 8);
  log("Cyber resilience layer blocked DDoS and enforced dynamic rate limits.", "success");
  setTimeout(() => {
    document.getElementById("ddosStatus").textContent = "Stable";
    document.getElementById("apiAbuse").textContent = "Low";
    document.getElementById("rateLimit").textContent = "Normal";
  }, 5500);
}

function simulateFailover() {
  const a = document.getElementById("regionA");
  const b = document.getElementById("regionB");
  a.className = "region failed";
  b.className = "region active";
  a.querySelector("div").textContent = "Failed";
  b.querySelector("div").textContent = "Active";
  document.getElementById("regionC").querySelector("div").textContent = "Backup";
  log("Region A failure simulated. Failover activated to Region B.", "warn");
  setTimeout(() => {
    a.className = "region backup";
    b.className = "region active";
    a.querySelector("div").textContent = "Backup";
  }, 7000);
}

function simulatePaymentFailure() {
  const s1 = document.getElementById("stepPayment");
  const s2 = document.getElementById("stepProcessing");
  const s3 = document.getElementById("stepConfirm");
  const status = document.getElementById("orderStatus");

  s1.classList.add("active");
  s2.classList.remove("active");
  s3.classList.remove("active");
  status.textContent = "Payment failed. Retry in progress...";
  log("Payment verification failed. Auto-retry and duplicate prevention checks started.", "warn");

  setTimeout(() => {
    s2.classList.add("active");
    status.textContent = "Retry successful. Processing order...";
  }, 1800);

  setTimeout(() => {
    s3.classList.add("active");
    status.textContent = "Order confirmed. Duplicate order prevented by integrity engine.";
    log("Order integrity engine completed safe confirmation.", "success");
  }, 3600);
}

function navSetup() {
  const buttons = [...document.querySelectorAll(".nav-btn")];
  const panels = [...document.querySelectorAll(".panel")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
    });
  });
}

document.getElementById("btnSpike").addEventListener("click", simulateTrafficSpike);
document.getElementById("btnAnomaly").addEventListener("click", triggerAnomalyEvent);
document.getElementById("btnFraudAttack").addEventListener("click", simulateFraudAttack);
document.getElementById("btnFraudScan").addEventListener("click", runFraudScan);
document.getElementById("btnAnomalyEvent").addEventListener("click", triggerAnomalyEvent);
document.getElementById("btnApiFail").addEventListener("click", simulateApiFailure);
document.getElementById("btnBlockAttack").addEventListener("click", simulateAttackBlocking);
document.getElementById("btnFailover").addEventListener("click", simulateFailover);
document.getElementById("btnPaymentFail").addEventListener("click", simulatePaymentFailure);
document.getElementById("btnCheckoutCycle").addEventListener("click", simulateCheckoutCycle);

navSetup();
seedFraudTable();
updateOverview();
updateHealing();
updateObservability();
refreshForecast();
log("Platform simulation booted successfully.", "success");

setInterval(tick, 2000);
setInterval(() => {
  if (Math.random() > 0.82) log("Auto-scaling triggered to maintain SLA stability.", "info");
  if (Math.random() > 0.9) log("Background fraud model retrained with latest transaction features.", "info");
}, 5000);
