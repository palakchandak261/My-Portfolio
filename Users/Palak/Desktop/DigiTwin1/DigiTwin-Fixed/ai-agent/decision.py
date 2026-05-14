def analyze(issue: str) -> dict:
    """Return root cause and candidate fixes for a detected issue."""
    fixes_map = {
        "High CPU usage": {
            "root_cause": "CPU overload due to heavy or runaway process",
            "fixes": [
                "Rolling restart with new memory limit",
                "Kill the heaviest process and restart gracefully",
                "Horizontal scale-out — add one more replica",
            ],
        },
        "High Memory usage": {
            "root_cause": "Memory leak or unbounded cache growth",
            "fixes": [
                "Restart app with increased memory limit",
                "Clear in-memory cache and run GC",
                "Rolling restart — preserve traffic, drain old pod",
            ],
        },
    }
    return fixes_map.get(issue, {"root_cause": "Unknown issue", "fixes": []})
