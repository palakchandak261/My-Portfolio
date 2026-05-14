def build_prompt(issue: str, metrics: dict) -> str:
    """Build the LLM prompt for the AI DevOps agent."""
    return f"""You are an AI DevOps Agent operating a Digital Twin IT system.

System Issue: {issue}
Current Metrics: CPU={metrics.get('cpu')}%  Memory={metrics.get('memory')}%

Your task:
1. Identify the most likely root cause.
2. Propose exactly 3 remediation fixes ranked by safety.
3. Assign a confidence score (0.0-1.0) for your top fix.

Respond in this format:
Root Cause: <explanation>
Fix 1: <safest fix>
Fix 2: <medium-risk fix>
Fix 3: <aggressive fix>
Confidence: <0.0-1.0>
"""
