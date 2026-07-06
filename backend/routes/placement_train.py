import json

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from xgboost import XGBClassifier
import joblib

df=pd.read_csv("D:\\TEKWORKS-AU\\PLACEMENT_PREDICTION\\project\\dataset\\balanced_placement_dataset.csv")
df

corr = df.corr(numeric_only=True)

salary_corr = corr['salary_package_lpa'].sort_values(
    ascending=False
)

# Generate realistic salary only for placed students

# Salary generation

df['salary_package_lpa'] = np.where(

    df['placement_status'] == 'Placed',

    (
        2 +

        df['internships_count'] * 0.8 +
        df['coding_skill_score'] * 0.35 +
        df['projects_count'] * 0.6 +
        df['mock_interview_score'] * 0.25 +
        df['cgpa'] * 0.45 -

        df['backlogs'] * 0.5 +

        df['aptitude_score'] * 0.15 +
        df['communication_skill_score'] * 0.15 +
        df['logical_reasoning_score'] * 0.15 +

        np.random.normal(0, 0.7, len(df))
    ),

    0
)

# round instead of aggressive clipping
df['salary_package_lpa'] = (
    df['salary_package_lpa']
    .round(2)
)

# safety bounds only
df['salary_package_lpa'] = (
    df['salary_package_lpa']
    .clip(lower=0, upper=20)
)

print(df['salary_package_lpa'].describe())
print(df['salary_package_lpa'].head(20))


df = pd.get_dummies(df, columns=['gender', 'branch'], drop_first=True)

placed_df = df[df['placement_status'] == 'Placed']
placed_df.head()
#----------------------------classification----------------------------
X = df.drop(['placement_status', 'salary_package_lpa'], axis=1)

# Convert target into binary
y = (df['placement_status'] == 'Placed').astype(int)


X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)


placement_status = XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

# Train model
placement_status.fit(X_train, y_train)

# Prediction
y_pred = placement_status.predict(X_test)

# ---------------------------- REGRESSION ----------------------------

# Only placed students for salary prediction
placed_df = df[
    df['placement_status'] == 'Placed'
]

# Features
X = placed_df.drop(
    ['salary_package_lpa', 'placement_status'],
    axis=1
)

# Target
y = placed_df['salary_package_lpa']

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Salary model
salary_predictor = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=5,
    min_child_weight=2,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.2,
    reg_lambda=2,
    random_state=42
)

# Train
salary_predictor.fit(
    X_train,
    y_train
)

# Predict
train_pred = salary_predictor.predict(
    X_train
)

test_pred = salary_predictor.predict(
    X_test
)

# ---------------- FEATURE IMPORTANCE ----------------

importances = (
    salary_predictor
    .feature_importances_
)

feature_importance_df = pd.DataFrame({
    'Feature': X.columns,
    'Importance': importances * 100
})

# Sort
feature_importance_df = (
    feature_importance_df
    .sort_values(
        by='Importance',
        ascending=False
    )
)

# Convert encoded names back
feature_importance_df[
    'Feature'
] = feature_importance_df[
    'Feature'
].replace({

    "branch_CSE": "branch",
    "branch_ECE": "branch",
    "branch_MECH": "branch",
    "branch_MBA": "branch",
    "branch_CIVIL": "branch",
    "branch_AIML": "branch",

    "gender_Male": "gender",
    "gender_Female": "gender"
})

# Merge duplicate branch/gender rows
feature_importance_df = (
    feature_importance_df
    .groupby('Feature')
    ['Importance']
    .sum()
    .reset_index()
)

# Remove zero values
feature_importance_df = (
    feature_importance_df[
        feature_importance_df[
            'Importance'
        ] > 0
    ]
)

# Sort descending
feature_importance_df = (
    feature_importance_df
    .sort_values(
        by='Importance',
        ascending=False
    )
)

print(feature_importance_df)


# ---------------- BAR PLOT ----------------

plt.figure(figsize=(10, 6))

sns.barplot(
    x='Importance',
    y='Feature',
    data=feature_importance_df
)

plt.title(
    'Feature Importance for Salary Prediction'
)

plt.xlabel('Importance')
plt.ylabel('Feature')

plt.tight_layout()
plt.show()