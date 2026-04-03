import { healthClass } from "../utils/formatters";

function TopHeader({ health }) {
  return (
    <section className="topbar">
      <div>
        <h2>Enterprise AI Monitoring Command Center</h2>
        <p>Real-time simulation of traffic, resilience, fraud protection, and anomaly response</p>
      </div>
      <span className={`status-pill ${healthClass(health)}`}>System Health: {health.toUpperCase()}</span>
    </section>
  );
}

export default TopHeader;
