import os
import pandas as pd
import numpy as np

def generate_student_data(num_samples=1000, output_path='student_placement_data.csv'):
    np.random.seed(42)

    # Generate features
    cgpa = np.round(np.random.uniform(5.5, 9.8, num_samples), 2)
    backlogs = np.random.choice([0, 1, 2, 3], size=num_samples, p=[0.75, 0.15, 0.07, 0.03])
    dsa = np.random.randint(30, 99, size=num_samples)
    communication = np.random.randint(40, 99, size=num_samples)
    aptitude = np.random.randint(40, 99, size=num_samples)
    projects = np.random.choice([0, 1, 2, 3, 4], size=num_samples, p=[0.1, 0.3, 0.35, 0.18, 0.07])
    internships = np.random.choice([0, 1, 2], size=num_samples, p=[0.6, 0.3, 0.1])
    tier = np.random.choice([1, 2, 3], size=num_samples, p=[0.15, 0.35, 0.5])

    # Construct dataframe
    df = pd.DataFrame({
        'cgpa': cgpa,
        'backlogs': backlogs,
        'dsa': dsa,
        'communication': communication,
        'aptitude': aptitude,
        'projects': projects,
        'internships': internships,
        'tier': tier
      })

    # Heuristic score for placement outcome (0 to 1)
    # CGPA (35%), DSA (25%), Internships (15%), Communication (10%), Aptitude (10%), Projects (5%)
    # Deduct score for backlogs and lower college tier
    tier_factor = np.where(df['tier'] == 1, 1.0, np.where(df['tier'] == 2, 0.95, 0.88))
    backlog_deduction = df['backlogs'] * 0.12
    
    score = (
        (df['cgpa'] / 10.0) * 0.35 +
        (df['dsa'] / 100.0) * 0.25 +
        (df['internships'] / 2.0) * 0.15 +
        (df['communication'] / 100.0) * 0.10 +
        (df['aptitude'] / 100.0) * 0.10 +
        (df['projects'] / 4.0) * 0.05
    ) * tier_factor - backlog_deduction
    
    # Introduce noise
    noise = np.random.normal(0, 0.04, num_samples)
    final_score = score + noise
    
    # Placement prediction targets (probability threshold >= 0.60)
    placed = (final_score >= 0.60).astype(int)
    
    # Expected salary estimation: 
    # Base: Tier 1: 12 LPA, Tier 2: 6.5 LPA, Tier 3: 3.5 LPA
    base_salary = np.where(df['tier'] == 1, 11.5, np.where(df['tier'] == 2, 6.0, 3.2))
    
    # Salary gains based on performance
    salary_gains = (
        (df['cgpa'] - 5.0) * 0.8 + 
        (df['dsa'] / 10) * 0.5 + 
        df['projects'] * 1.2 + 
        df['internships'] * 2.2
    )
    
    expected_salary = np.round(base_salary + salary_gains * 0.9, 1)
    
    # Set salary to 0 if not placed (or keep it as expected salary when placed, 
    # but for regressors it predicts expected salary when placed, so we only train
    # the regressor on placed students, or just keep it as potential expected salary).
    # Standard is: predict expected package if placed. Let's keep it as expected salary package.
    df['placed'] = placed
    df['salary'] = expected_salary

    # Save to file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {num_samples} records. Saved to {output_path}")

if __name__ == '__main__':
    generate_student_data(output_path='data/student_placement_data.csv')
