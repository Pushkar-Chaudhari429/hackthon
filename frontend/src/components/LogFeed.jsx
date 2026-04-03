function LogFeed({ logs, searchTerm, onSearchTermChange }) {
  return (
    <div className="card">
      <div className="log-feed-header">
        <h3>Global Activity Feed</h3>
        <input
          type="text"
          className="log-search"
          placeholder="Search logs"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
      </div>
      <div className="log-feed">
        {logs.length === 0 ? <div className="log-line">No logs yet.</div> : null}
        {logs.map((log) => (
          <div key={log.id} className="log-line">
            <span className={`tag ${log.level}`}>[{log.level.toUpperCase()}]</span>
            {new Date(log.timestamp).toLocaleTimeString()} - {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogFeed;
