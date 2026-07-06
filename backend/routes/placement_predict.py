import json
import joblib
import pandas as pd
import os


# ---------------- Paths ----------------

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    '..',
    'model'
)


# ---------------- Load Models ----------------

placement_status_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        'placement_status_model.pkl'
    )
)

salary_predictor_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        'salary_predictor_model.pkl'
    )
)


# ---------------- Load Feature Columns ----------------

with open(
    os.path.join(
        MODEL_DIR,
        'feature_columns.json'
    ),
    'r'
) as f:

    feature_columns = json.load(f)


# ---------------- Prediction Function ----------------

def predict_placement(student_data):

    original_student_data = student_data.copy()

    # ---------------- Fix Scale Issue ----------------
    # Frontend gives scores in 1–10
    # Model trained on 1–100

    score_columns = [
        "aptitude_score",
        "coding_skill_score",
        "communication_skill_score",
        "logical_reasoning_score",
        "mock_interview_score"
    ]

    for col in score_columns:
        if col in student_data:
            # Only scale if frontend provided 1-10 values. If already 0-100, keep as is.
            try:
                val = float(student_data[col])
                student_data[col] = val * 10 if val <= 10 else val
            except Exception:
                # leave as-is on failure
                pass

    # Convert input to dataframe
    input_df = pd.DataFrame(
        [student_data]
    )

    # One hot encoding
    input_df = pd.get_dummies(
        input_df,
        columns=['gender', 'branch']
    )

    # Add missing columns
    for col in feature_columns:

        if col not in input_df.columns:
            input_df[col] = 0

    # Correct feature order
    input_df = input_df[
        feature_columns
    ]

    # ---------------- Placement Prediction ----------------

    placement_prediction = (
        placement_status_model
        .predict(input_df)[0]
    )

    # Confidence
    confidence = (
        placement_status_model
        .predict_proba(input_df)[0][1]
        * 100
    )

    # ---------------- If NOT placed ----------------

    if int(placement_prediction) == 0:

        return {
            "placement_status":
                "Not Placed",

            "placement_confidence":
                float(round(confidence, 2)),

            "predicted_salary_lpa":
                None
        }

    # ---------------- Salary Prediction ----------------
    # Debug: print input features before salary prediction
    try:
        print("[predict_placement] input_df:")
        print(input_df.to_dict(orient='records'))
    except Exception:
        pass

    salary_prediction = (
        salary_predictor_model
        .predict(input_df)[0]
    )

    # Blend the trained regressor with a profile-based estimate so the
    # returned package still varies when the persisted model saturates.
    try:
        profile_score = 0.0
        cgpa = float(original_student_data.get('cgpa', 0) or 0)
        coding = float(original_student_data.get('coding_skill_score', 0) or 0)
        mock_interview = float(original_student_data.get('mock_interview_score', 0) or 0)
        logical = float(original_student_data.get('logical_reasoning_score', 0) or 0)
        communication = float(original_student_data.get('communication_skill_score', 0) or 0)
        projects = float(original_student_data.get('projects_count', 0) or 0)
        internships = float(original_student_data.get('internships_count', 0) or 0)
        backlogs = float(original_student_data.get('backlogs', 0) or 0)
        attendance = float(original_student_data.get('attendance_percentage', 100) or 100)

        profile_score = (
            (cgpa / 10) * 35 +
            (coding / 10) * 25 +
            (mock_interview / 10) * 15 +
            (logical / 10) * 10 +
            (communication / 10) * 8 +
            (projects * 3) +
            (internships * 4)
        )
        profile_score -= backlogs * 12
        if attendance < 75:
            profile_score -= (75 - attendance) * 0.5

        profile_score = max(0, min(profile_score, 100))
        profile_salary = 4.0 + max(0, profile_score - 55) * 0.15

        # Confidence nudges the estimate upward a little for stronger predictions.
        confidence_factor = 0.9 + (confidence / 100) * 0.2
        salary_prediction = (
            (float(salary_prediction) * 0.35) +
            (float(profile_salary) * 0.65)
        ) * confidence_factor
    except Exception:
        pass

    salary_prediction = max(3.0, min(float(salary_prediction), 20.0))

    # Debug: log raw salary prediction
    try:
        print(f"[predict_placement] salary_prediction: {salary_prediction}")
    except Exception:
        pass

    # ---------------- Final Output ----------------

    return {
        "placement_status":
            "Placed",

        "placement_confidence":
            float(round(confidence, 2)),

        "predicted_salary_lpa":
            float(round(
                salary_prediction,
                2
            ))
    }