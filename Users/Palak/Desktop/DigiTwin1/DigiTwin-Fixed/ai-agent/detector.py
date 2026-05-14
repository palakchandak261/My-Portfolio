def detect(metrics: dict) -> str | None:
    """Detect anomalies from system metrics. Returns issue string or None."""
    cpu    = metrics.get("cpu",    0)
    memory = metrics.get("memory", 0)
    if cpu > 90:
        return "High CPU usage"
    if memory > 90:
        return "High Memory usage"
    return None
