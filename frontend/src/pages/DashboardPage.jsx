import LogFeed from "../components/LogFeed";
import FraudTable from "../components/FraudTable";
import MetricCard from "../components/MetricCard";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import TrafficCharts from "../components/TrafficCharts";
import { useDashboardData } from "../hooks/useDashboardData";
import { NAV_ITEMS } from "../utils/constants";
import { alertClass, formatNumber } from "../utils/formatters";
import { useEffect, useMemo, useState } from "react";

function DashboardPage() {
  const [activePanel, setActivePanel] = useState("overview");
  const [selectedFraudStatus, setSelectedFraudStatus] = useState("All");
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  const {
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
  } = useDashboardData();

  const growth = useMemo(() => {
    if (!metrics.currentTraffic) return 0;
    const ratio = ((metrics.predictedTraffic - metrics.currentTraffic) / metrics.currentTraffic) * 100;
    return Math.max(1, Math.floor(ratio));
  }, [metrics.currentTraffic, metrics.predictedTraffic]);

  const suspiciousCount = useMemo(() => transactions.filter((item) => item.status === "Suspicious").length, [transactions]);
  const blockedCount = useMemo(() => transactions.filter((item) => item.status === "Blocked").length, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedFraudStatus === "All") {
      return transactions;
    }
    return transactions.filter((item) => item.status === selectedFraudStatus);
  }, [selectedFraudStatus, transactions]);

  const filteredLogs = useMemo(() => {
    if (!logSearchTerm.trim()) {
      return metrics.logs || [];
    }
    const keyword = logSearchTerm.toLowerCase();
    return (metrics.logs || []).filter((entry) => {
      return String(entry.message).toLowerCase().includes(keyword) || String(entry.level).toLowerCase().includes(keyword);
    });
  }, [logSearchTerm, metrics.logs]);

  const recommendations = useMemo(() => {
    const items = [];

    if (metrics.systemHealth === "Critical") {
      items.push({
        id: "critical-health",
        severity: "critical",
        text: "System health is critical. Open Observability and isolate overloaded services before customer impact spreads.",
        actionLabel: "Open Observability",
        targetPanel: "observability"
      });
    }

    if (metrics.systemHealth === "Warning") {
      items.push({
        id: "warning-health",
        severity: "warning",
        text: "System is in warning state. Trigger anomaly diagnostics and watch latency trend for the next two polling cycles.",
        actionLabel: "Open Anomaly Engine",
        targetPanel: "anomaly"
      });
    }

    if (metrics.fraudRiskLevel === "High" || blockedCount > 0) {
      items.push({
        id: "fraud-high",
        severity: "critical",
        text: "Fraud pressure is high. Freeze suspicious checkout sessions and enforce strict verification for high-value orders.",
        actionLabel: "Open Fraud Detection",
        targetPanel: "fraud"
      });
    }

    if (suspiciousCount > 0 && metrics.fraudRiskLevel !== "High") {
      items.push({
        id: "fraud-watch",
        severity: "warning",
        text: "Suspicious transactions detected. Review flagged rows and run another scan after mitigation actions.",
        actionLabel: "Review Fraud Queue",
        targetPanel: "fraud"
      });
    }

    if ((anomalies || []).some((item) => item.severity === "critical")) {
      items.push({
        id: "anomaly-critical",
        severity: "critical",
        text: "Critical anomaly detected. Activate failover strategy and validate region capacity before traffic shifts.",
        actionLabel: "Open Failover",
        targetPanel: "failover"
      });
    }

    if (!items.length) {
      items.push({
        id: "healthy",
        severity: "info",
        text: "All key signals look healthy. Run a proactive traffic spike test to validate resilience under load.",
        actionLabel: "Run Traffic Spike Test",
        quickAction: "spike"
      });
    }

    return items;
  }, [anomalies, blockedCount, metrics.fraudRiskLevel, metrics.systemHealth, suspiciousCount]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const runFeatureSimulation = async (kind, label, targetPanel) => {
    const result = await runSimulation(kind);
    if (result?.ok) {
      setToast({ type: "success", text: `${label} completed` });
      if (targetPanel) {
        setActivePanel(targetPanel);
      }
    } else {
      setToast({ type: "error", text: result?.error || `${label} failed` });
    }
  };

  const manualRefresh = async () => {
    const result = await loadDashboard();
    if (result?.ok) {
      setToast({ type: "success", text: "Dashboard refreshed" });
    } else {
      setToast({ type: "error", text: result?.error || "Refresh failed" });
    }
  };

  const executeRecommendation = async (recommendation) => {
    if (recommendation.targetPanel) {
      setActivePanel(recommendation.targetPanel);
      return;
    }
    if (recommendation.quickAction) {
      await runFeatureSimulation(recommendation.quickAction, "Recommended action");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar navItems={NAV_ITEMS} activePanel={activePanel} onChange={setActivePanel} />

      <main className="main">
        <TopHeader health={metrics.systemHealth} />

        <div className="control-toolbar">
          <button className="action" onClick={manualRefresh}>Refresh Now</button>
          <button className="action" onClick={toggleAutoRefresh}>{isAutoRefresh ? "Pause Auto Refresh" : "Resume Auto Refresh"}</button>
          <span className="chip">Auto refresh: {isAutoRefresh ? "ON" : "OFF"}</span>
          <span className="chip">Last update: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleTimeString() : "--"}</span>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}
        {toast ? <div className={`toast toast-${toast.type}`}>{toast.text}</div> : null}

        {activePanel === "overview" ? (
          <section className="panel active">
            <div className="grid-4">
              <MetricCard title="Active Users" value={formatNumber(metrics.activeUsers)} subtext="Live sessions across all channels" />
              <MetricCard title="Predicted Traffic (10 min)" value={formatNumber(metrics.predictedTraffic)} subtext="Forecast engine confidence 93%" />
              <MetricCard title="System Health Status" value={metrics.systemHealth} subtext="Stability index from observability signals" />
              <MetricCard title="Fraud Risk Level" value={metrics.fraudRiskLevel} subtext="Behavioral + payment anomaly model" />
            </div>

            <TrafficCharts labels={labels} currentSeries={trafficSeries} predictedSeries={predictedSeries} />

            <div className="card">
              <h3>Feature Action Center</h3>
              <div className="feature-control-grid">
                <button className="feature-action-btn" onClick={() => runFeatureSimulation("spike", "Traffic spike simulation", "traffic")}>Predictive Traffic Drill</button>
                <button className="feature-action-btn" onClick={() => runFeatureSimulation("anomaly", "Anomaly simulation", "anomaly")}>Anomaly Response Drill</button>
                <button className="feature-action-btn" onClick={() => runFeatureSimulation("fraud", "Fraud simulation", "fraud")}>Fraud Defense Drill</button>
                <button className="feature-action-btn" onClick={() => setActivePanel("healing")}>Open Self-Healing Engine</button>
                <button className="feature-action-btn" onClick={() => setActivePanel("checkout")}>Open Checkout Protection</button>
                <button className="feature-action-btn" onClick={() => setActivePanel("observability")}>Open Observability</button>
                <button className="feature-action-btn" onClick={() => setActivePanel("cyber")}>Open Cyber Resilience</button>
                <button className="feature-action-btn" onClick={() => setActivePanel("failover")}>Open Failover System</button>
              </div>
            </div>

            <div className="card">
              <h3>Actionable Tips</h3>
              <div className="tip-list">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.id} className={`tip-item tip-${recommendation.severity}`}>
                    <p>{recommendation.text}</p>
                    <button className="tip-action" onClick={() => executeRecommendation(recommendation)}>{recommendation.actionLabel}</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activePanel === "traffic" ? (
          <section className="panel active">
            <div className="grid-2">
              <TrafficCharts labels={labels} currentSeries={trafficSeries} predictedSeries={predictedSeries} />
              <div className="card">
                <h3>AI Forecast Insights</h3>
                <div className="metric">Traffic expected to increase by {growth}%</div>
                <div className="delta">Event trigger: {metrics.saleEventDetected ? "Sale Event Detected" : "None"}</div>
              </div>
            </div>
          </section>
        ) : null}

        {activePanel === "healing" ? (
          <section className="panel active">
            <div className="grid-3">
              <MetricCard title="Server Count" value={metrics.serverCount} subtext="Auto-scaling adjusts by demand" />
              <MetricCard title="Service Health" value={metrics.systemHealth === "Warning" ? "Overloaded" : "Healthy"} subtext="API pods and checkout workers" />
              <MetricCard title="Rerouting" value={metrics.systemHealth === "Warning" ? "Active" : "Standby"} subtext="Cross-region traffic balancing" />
            </div>
          </section>
        ) : null}

        {activePanel === "fraud" ? (
          <section className="panel active">
            <div className="card">
              <h3>Real-Time Fraud Detection</h3>
              <div className="fraud-toolbar">
                <span className="chip">Suspicious: {suspiciousCount}</span>
                <span className="chip">Blocked: {blockedCount}</span>
                <label className="filter-label" htmlFor="fraudFilter">Filter</label>
                <select
                  id="fraudFilter"
                  className="status-filter"
                  value={selectedFraudStatus}
                  onChange={(event) => setSelectedFraudStatus(event.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Normal">Normal</option>
                  <option value="Suspicious">Suspicious</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              <FraudTable transactions={filteredTransactions} />
              <div className="controls" style={{ marginTop: 10 }}>
                <button className="action" onClick={() => runFeatureSimulation("fraud", "Fraud scan")}>Run Fraud Scan</button>
              </div>
            </div>
          </section>
        ) : null}

        {activePanel === "checkout" ? (
          <section className="panel active">
            <div className="card">
              <h3>Smart Checkout Protection</h3>
              <div className="queue">
                <div className="queue-box">
                  <div className="delta">Priority Users</div>
                  <div className="metric">{metrics.priorityUsers}</div>
                </div>
                <div className="queue-box">
                  <div className="delta">Suspicious Queue</div>
                  <div className="metric">{metrics.suspiciousUsers}</div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activePanel === "observability" ? (
          <section className="panel active">
            <div className="grid-3">
              <MetricCard title="CPU Usage" value={`${metrics.cpuUsage}%`} subtext="Infrastructure workload" />
              <MetricCard title="API Latency" value={`${metrics.apiLatency}ms`} subtext="Gateway and service mesh latency" />
              <MetricCard title="Error Rate" value={`${metrics.errorRate}%`} subtext="Application errors in rolling window" />
            </div>
            <div className="card">
              <h3>Health Pressure Meters</h3>
              <div className="meter-grid">
                <div>
                  <div className="delta">CPU</div>
                  <div className="progress"><span style={{ width: `${Math.min(100, metrics.cpuUsage)}%` }} /></div>
                </div>
                <div>
                  <div className="delta">Latency</div>
                  <div className="progress"><span style={{ width: `${Math.min(100, Math.round(metrics.apiLatency / 3))}%` }} /></div>
                </div>
                <div>
                  <div className="delta">Error Rate</div>
                  <div className="progress"><span style={{ width: `${Math.min(100, Math.round(metrics.errorRate * 10))}%` }} /></div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activePanel === "anomaly" ? (
          <section className="panel active">
            <div className="card">
              <h3>AI Anomaly Detection Engine</h3>
              <div className="alerts">
                {anomalies.map((anomaly) => (
                  <div key={anomaly.id} className={`alert-item ${alertClass(anomaly.severity)}`}>
                    {anomaly.message}
                  </div>
                ))}
              </div>
              <div className="controls" style={{ marginTop: 10 }}>
                <button className="action" onClick={() => runFeatureSimulation("anomaly", "Anomaly scan")}>Trigger Anomaly Event</button>
              </div>
            </div>
          </section>
        ) : null}

        {activePanel === "cyber" ? (
          <section className="panel active">
            <div className="grid-3">
              <MetricCard title="DDoS Detection" value={metrics.systemHealth === "Warning" ? "Alerting" : "Stable"} subtext="Threat analytics stream" />
              <MetricCard title="API Abuse Alerts" value={metrics.fraudRiskLevel} subtext="Behavioral abuse monitoring" />
              <MetricCard title="Rate Limiting" value={metrics.systemHealth === "Warning" ? "Strict" : "Normal"} subtext="Adaptive edge policy" />
            </div>
          </section>
        ) : null}

        {activePanel === "failover" ? (
          <section className="panel active">
            <div className="card">
              <h3>Intelligent Failover System</h3>
              <div className="region-grid">
                <div className={`region ${metrics.systemHealth === "Critical" ? "failed" : "active"}`}><strong>Region A</strong><div>{metrics.systemHealth === "Critical" ? "Failed" : "Active"}</div></div>
                <div className="region backup"><strong>Region B</strong><div>Backup</div></div>
                <div className="region backup"><strong>Region C</strong><div>Backup</div></div>
              </div>
            </div>
          </section>
        ) : null}

        {activePanel === "order" ? (
          <section className="panel active">
            <div className="card">
              <h3>Order Integrity Engine</h3>
              <div className="stepper">
                <div className="step active">Payment</div>
                <div className="step">Processing</div>
                <div className="step">Confirmation</div>
              </div>
              <div className="delta">Duplicate order prevention and retry safety checks enabled.</div>
            </div>
          </section>
        ) : null}

        {activePanel === "architecture" ? (
          <section className="panel active">
            <div className="card">
              <h3>Architecture View</h3>
              <div className="architecture">
                <div className="arch-node">Web Traffic Ingress</div>
                <div className="arch-node">Predictive AI Engine</div>
                <div className="arch-node">Self-Healing Controller</div>
                <div className="arch-node">Fraud Risk Model</div>
                <div className="arch-node">Checkout Queue Orchestrator</div>
                <div className="arch-node">Observability Stack</div>
                <div className="arch-node">Anomaly Detection Core</div>
                <div className="arch-node">Failover Director</div>
              </div>
            </div>
          </section>
        ) : null}

        <LogFeed logs={filteredLogs} searchTerm={logSearchTerm} onSearchTermChange={setLogSearchTerm} />
      </main>
    </div>
  );
}

export default DashboardPage;
