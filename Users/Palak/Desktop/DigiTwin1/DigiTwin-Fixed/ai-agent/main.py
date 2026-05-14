from detector   import detect
from decision   import analyze
from tournament import run_tournament
from confidence import evaluate_confidence
from postmortem import generate_report
from agent      import build_prompt


def run_ai_agent(metrics: dict | None = None) -> dict:
    """
    Full Digital-Twin agent pipeline:
    1. Detect anomaly  2. Analyze  3. Tournament on shadow twin
    4. Confidence eval  5. Post-mortem report
    """
    if metrics is None:
        metrics = {"cpu": 95, "memory": 85}

    print("\n🔄 AI Agent — monitoring system…")

    issue = detect(metrics)
    print(f"  Issue: {issue}")

    if not issue:
        print("  ✅ System healthy.")
        return {
            "issue":      None,
            "decision":   {},
            "tournament": {},
            "confidence": {},
            "report":     {"summary": "System healthy — no action needed."},
            "prompt":     "",
        }

    decision   = analyze(issue)
    prompt     = build_prompt(issue, metrics)
    print(f"  Root cause: {decision['root_cause']}")

    print("  Running fix tournament on digital twin…")
    tournament = run_tournament(decision)
    print(f"  Winner: {tournament['winner']}")

    confidence = evaluate_confidence(
        tournament["winner"],
        simulation_passed=tournament["twin_passed"],
    )
    print(f"  Confidence: {confidence['label']} ({confidence['score']})")

    report = generate_report(issue, tournament["winner"], confidence, tournament)
    print(f"  {report['summary']}")

    return {
        "issue":      issue,
        "decision":   decision,
        "tournament": tournament,
        "confidence": confidence,
        "report":     report,
        "prompt":     prompt,
    }


if __name__ == "__main__":
    import json
    print(json.dumps(run_ai_agent(), indent=2))
