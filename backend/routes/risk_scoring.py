# risk scoring for given output from the user

import json


# ---------------- Load Risk Weights ----------------
weights = {
    "coding_skill_score": 0.25,
    "mock_interview_score": 0.20,
    "logical_reasoning_score": 0.15,
    "communication_skill_score": 0.10,
    "projects_count": 0.10,
    "internships_count": 0.08,
    "aptitude_score": 0.05,
    "cgpa": 0.04,
    "attendance_percentage": 0.02,
    "backlogs": -0.10
}


# ---------------- Risk Score Function ----------------

def calculate_risk_score(student_data):

    score = 0

    for feature, weight in weights.items():

        value = student_data.get(feature, 0)

        score += value * weight

    # Convert to 0–100 range
    score = max(0, min(score * 10, 100))

    return round(score, 2)


# ---------------- Risk Level Function ----------------

def placement_risk(score):

    if score >= 75:
        return "Placement Ready"

    elif score >= 50:
        return "Moderate Risk"

    return "High Risk"


# ---------------- Main Function ----------------

def get_risk_prediction(student_data):

    score = calculate_risk_score(student_data)

    risk_level = placement_risk(score)

    return {
        "risk_score": score,
        "risk_level": risk_level
    }