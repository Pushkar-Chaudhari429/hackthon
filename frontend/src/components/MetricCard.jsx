function MetricCard({ title, value, subtext }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="metric">{value}</div>
      <div className="delta">{subtext}</div>
    </div>
  );
}

export default MetricCard;
