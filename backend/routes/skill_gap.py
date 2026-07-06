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


# ---------------- Load Saved Model ----------------

saved_objects = joblib.load(
    os.path.join(
        MODEL_DIR,
        'skill_gap_model.pkl'
    )
)

skill_gap_model = saved_objects["model"]
skill_gap_scaler = saved_objects["scaler"]


# ---------------- Required Columns ----------------

skill_columns = [
    "coding_skill_score",
    "aptitude_score",
    "communication_skill_score",
    "logical_reasoning_score",
    "mock_interview_score"
]


# ---------------- Recommendations ----------------

recommendations = {
    "Coding Skill Gap":
        "Focus on DSA, programming fundamentals, and coding practice.",

    "Aptitude Skill Gap":
        "Practice aptitude tests, quantitative problems, and reasoning questions.",

    "Communication Skill Gap":
        "Attend soft-skills training, group discussions, and presentation practice.",

    "Logical Reasoning Skill Gap":
        "Practice puzzles, logical reasoning, and analytical thinking exercises.",

    "Interview Skill Gap":
        "Attend mock interviews, HR rounds, and resume-based interview practice.",

    "No Major Skill Gap":
        "You are performing well. Continue advanced placement preparation and company-specific practice."
}


# ---------------- Helper Functions ----------------

def find_user_skill_gaps(scores):

    gaps = []

    for skill_name, score in scores.items():

        if score < 60:

            gaps.append(skill_name)

    if len(gaps) == 0:

        return ["No Major Skill Gap"]

    return gaps


def get_overall_level(scores):

    avg_score = sum(scores.values()) / len(scores)

    if avg_score >= 80:

        return "Strong Skill Profile"

    elif avg_score >= 60:

        return "Moderate Skill Profile"

    else:

        return "Needs Improvement"


# ---------------- Prediction Function ----------------

def predict_skill_gap(student_data):

    input_df = pd.DataFrame(
        [student_data]
    )

    input_df = input_df[
        skill_columns
    ]

    scaled_input = skill_gap_scaler.transform(
        input_df
    )

    cluster_prediction = skill_gap_model.predict(
        scaled_input
    )[0]

    user_scores = {
        "Coding Skill Gap":
            student_data["coding_skill_score"],

        "Aptitude Skill Gap":
            student_data["aptitude_score"],

        "Communication Skill Gap":
            student_data["communication_skill_score"],

        "Logical Reasoning Skill Gap":
            student_data["logical_reasoning_score"],

        "Interview Skill Gap":
            student_data["mock_interview_score"]
    }

    skill_gaps = find_user_skill_gaps(
        user_scores
    )

    overall_level = get_overall_level(
        user_scores
    )

    training_recommendations = []

    for gap in skill_gaps:

        training_recommendations.append(
            recommendations[gap]
        )

    return {
        "cluster":
            int(cluster_prediction),

        "overall_level":
            overall_level,

        "skill_gaps":
            skill_gaps,

        "training_recommendations":
            training_recommendations
    }