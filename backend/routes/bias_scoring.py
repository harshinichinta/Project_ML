import pandas as pd
import os


# ---------------- Load Dataset ----------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

dataset_path = os.path.join(
    BASE_DIR,
    '..',
    '..',
    'dataset',
    'balanced_placement_dataset.csv'
)

df = pd.read_csv(dataset_path)


# ---------------- Gender Bias ----------------

def gender_bias_analysis():

    gender_bias = (
        df.groupby('gender')['placement_status']
        .apply(lambda x: (x == 'Placed').mean() * 100)
        .reset_index()
    )

    gender_bias.columns = [
        'gender',
        'placement_rate'
    ]

    gender_result = gender_bias.to_dict(
        orient='records'
    )

    # Bias gap
    if len(gender_bias) >= 2:

        max_rate = gender_bias[
            'placement_rate'
        ].max()

        min_rate = gender_bias[
            'placement_rate'
        ].min()

        bias_gap = round(
            max_rate - min_rate,
            2
        )

    else:
        bias_gap = 0

    return {
        "gender_bias": gender_result,
        "gender_bias_gap": bias_gap
    }


# ---------------- Branch Bias ----------------

def branch_bias_analysis():

    branch_bias = (
        df.groupby('branch')
        ['placement_status']
        .apply(lambda x:
               (x == 'Placed').mean() * 100)
        .reset_index()
    )

    branch_bias.columns = [
        'branch',
        'placement_rate'
    ]

    branch_result = branch_bias.to_dict(
        orient='records'
    )

    # Branch bias gap
    max_rate = branch_bias[
        'placement_rate'
    ].max()

    min_rate = branch_bias[
        'placement_rate'
    ].min()

    bias_gap = round(
        max_rate - min_rate,
        2
    )

    return {
        "branch_bias": branch_result,
        "branch_bias_gap": bias_gap
    }


# ---------------- Combined Function ----------------

def get_bias_analysis():

    return {
        "gender_analysis":
            gender_bias_analysis(),

        "branch_analysis":
            branch_bias_analysis()
    }


# ---------------- Test ----------------

if __name__ == "__main__":

    result = get_bias_analysis()

    print(result)