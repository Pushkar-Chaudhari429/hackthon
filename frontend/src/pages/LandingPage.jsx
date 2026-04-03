function LandingPage({ onEnterDashboard }) {
  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="landing-brand">NeuroShield Commerce AI</div>
        <button className="landing-ghost" onClick={onEnterDashboard}>Open Dashboard</button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Enterprise AI Commerce Platform</p>
          <h1>Self-Healing Infrastructure with Real-Time Fraud Resilience</h1>
          <p className="hero-text">
            Predict demand, neutralize anomalous behavior, and preserve checkout integrity during peak traffic.
            Built for modern commerce teams that need reliability and trust at scale.
          </p>
          <div className="hero-actions">
            <button className="landing-cta" onClick={onEnterDashboard}>Launch Command Center</button>
            <a className="landing-link" href="/api/health" target="_blank" rel="noreferrer">View API Status</a>
          </div>
        </div>

        <div className="hero-stat-card">
          <div className="stat-row">
            <span>Projected Traffic (10m)</span>
            <strong>+38%</strong>
          </div>
          <div className="stat-row">
            <span>Fraud Block Rate</span>
            <strong>99.4%</strong>
          </div>
          <div className="stat-row">
            <span>Auto-Recovery SLA</span>
            <strong>98.9%</strong>
          </div>
          <div className="pulse-grid">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h3>Predictive Traffic Intelligence</h3>
          <p>Continuously forecasts load and pre-scales compute capacity before congestion events occur.</p>
        </article>
        <article className="feature-card">
          <h3>Self-Healing Runtime</h3>
          <p>Detects API degradation and applies automatic reroute and restart policies in seconds.</p>
        </article>
        <article className="feature-card">
          <h3>Adaptive Fraud Defense</h3>
          <p>Flags suspicious transactions in real time and hardens checkout pathways against attack spikes.</p>
        </article>
      </section>
    </div>
  );
}

export default LandingPage;
