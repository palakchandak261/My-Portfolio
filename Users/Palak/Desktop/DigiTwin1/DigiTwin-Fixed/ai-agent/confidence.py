def evaluate_confidence(best_fix: str, simulation_passed: bool = True) -> dict:
    """Return a confidence score and recommended action for the chosen fix."""
    score = 0.92 if simulation_passed else 0.45

    if score >= 0.80:
        action = f"AUTO-DEPLOY: {best_fix}"
        label  = "high"
    elif score >= 0.50:
        action = f"REVIEW BEFORE DEPLOY: {best_fix}"
        label  = "medium"
    else:
        action = f"DO NOT DEPLOY (low confidence): {best_fix}"
        label  = "low"

    return {
        "score":             round(score, 2),
        "label":             label,
        "action":            action,
        "simulation_passed": simulation_passed,
    }
