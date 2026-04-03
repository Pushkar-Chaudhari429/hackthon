export function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

export function healthClass(status) {
  if (status === "Critical") {
    return "status-critical";
  }
  if (status === "Warning") {
    return "status-warn";
  }
  return "status-good";
}

export function alertClass(severity) {
  if (severity === "critical") {
    return "alert-critical";
  }
  if (severity === "warning") {
    return "alert-warning";
  }
  return "alert-good";
}
