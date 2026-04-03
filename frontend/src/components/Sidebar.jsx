function Sidebar({ navItems, activePanel, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>AI-Powered Self-Healing & Fraud-Resilient Commerce Platform</h1>
        <p>Enterprise Simulation Console</p>
      </div>
      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-btn ${activePanel === item.key ? "active" : ""}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
