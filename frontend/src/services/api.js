import axios from 'axios'

const API = axios.create({
  baseURL: 'https://placement-ml-1-qs84.onrender.com'
})

// Custom request wrapper to handle mock fallback if backend is offline
const requestWithFallback = async (requestPromise, fallbackFn) => {
  try {
    return await requestPromise;
  } catch (error) {
    console.warn("Backend API offline. Falling back to local frontend simulation.", error);
    return { data: fallbackFn() };
  }
};

export const predictPlacement = (data) => {
  const fallback = () => {
    // Local mock prediction calculation
    const cgpa = Number(data.cgpa || 0);
    const coding = Number(data.coding_skill_score || 0);
    const mockInterview = Number(data.mock_interview_score || 0);
    const logical = Number(data.logical_reasoning_score || 0);
    const communication = Number(data.communication_skill_score || 0);
    const projects = Number(data.projects_count || 0);
    const internships = Number(data.internships_count || 0);
    const backlogs = Number(data.backlogs || 0);
    const attendance = Number(data.attendance_percentage || 100);

    // Compute a score out of 100
    let score = (cgpa / 10) * 35 +
                (coding / 10) * 25 +
                (mockInterview / 10) * 15 +
                (logical / 10) * 10 +
                (communication / 10) * 8 +
                (projects * 3) + 
                (internships * 4);
    
    // Penalize backlogs and poor attendance
    score -= backlogs * 12;
    if (attendance < 75) score -= (75 - attendance) * 0.5;

    score = Math.max(0, Math.min(score, 100));

    const isPlaced = score >= 55;
    const confidence = isPlaced ? score : 100 - score;
    const predictedSalary = isPlaced ? Math.round((4.0 + (score - 55) * 0.15) * 100) / 100 : null;

    return {
      placement_status: isPlaced ? "Placed" : "Not Placed",
      placement_confidence: Math.round(confidence * 100) / 100,
      predicted_salary_lpa: predictedSalary
    };
  };
  
  return requestWithFallback(API.post('/predict_placement', data), fallback);
};

export const getRiskScore = (data) => {
  const fallback = () => {
    // All input scores are on a 1–10 scale (as entered by the user).
    // Weights sum such that a perfect-profile student scores ~9–10 before the final * 10,
    // giving a readiness index of 90–100. The final multiply-by-10 converts to a 0-100 %.
    const cgpa       = Number(data.cgpa                     || 0);   // 0–10
    const coding     = Number(data.coding_skill_score        || 0);   // 0–10
    const interview  = Number(data.mock_interview_score      || 0);   // 0–10
    const logical    = Number(data.logical_reasoning_score   || 0);   // 0–10
    const comm       = Number(data.communication_skill_score || 0);   // 0–10
    const aptitude   = Number(data.aptitude_score            || 0);   // 0–10
    const projects   = Number(data.projects_count            || 0);   // count
    const internships= Number(data.internships_count         || 0);   // count
    const attendance = Number(data.attendance_percentage     || 0);   // 0–100
    const backlogs   = Number(data.backlogs                  || 0);   // count

    // Weighted sum (inputs already on 1-10 scale; attendance stays on 0-100)
    let score =
      cgpa        * 0.25 +   // academic foundation
      coding      * 0.22 +   // most critical technical skill
      interview   * 0.18 +   // interview performance
      logical     * 0.12 +   // reasoning ability
      comm        * 0.08 +   // soft skills
      aptitude    * 0.06 +   // aptitude tests
      Math.min(projects,    5) * 0.035 + // projects (capped at 5)
      Math.min(internships, 3) * 0.025 + // internships (capped at 3)
      (attendance / 100) * 0.05;          // attendance as a fraction

    // Penalise each active backlog — meaningful but recoverable
    score -= backlogs * 0.25;

    // Convert weighted sum (~0–10) to a 0–100 readiness index
    const finalScore = Math.max(0, Math.min(score * 10, 100));

    let riskLevel = "High Risk";
    if (finalScore >= 75) riskLevel = "Placement Ready";
    else if (finalScore >= 50) riskLevel = "Moderate Risk";

    return {
      risk_score: Math.round(finalScore * 10) / 10,
      risk_level: riskLevel
    };
  };

  return requestWithFallback(API.post('/risk-score', data), fallback);
};

export const getSkillGap = (data) => {
  const fallback = () => {
    const coreSkills = {
      "Coding Skill Gap": Number(data.coding_skill_score || 0),
      "Aptitude Skill Gap": Number(data.aptitude_score || 0),
      "Communication Skill Gap": Number(data.communication_skill_score || 0),
      "Logical Reasoning Skill Gap": Number(data.logical_reasoning_score || 0),
      "Interview Skill Gap": Number(data.mock_interview_score || 0)
    };

    const recommendations = {
      "Coding Skill Gap": "Focus on DSA, programming fundamentals, and coding practice.",
      "Aptitude Skill Gap": "Practice aptitude tests, quantitative problems, and reasoning questions.",
      "Communication Skill Gap": "Attend soft-skills training, group discussions, and presentation practice.",
      "Logical Reasoning Skill Gap": "Practice puzzles, logical reasoning, and analytical thinking exercises.",
      "Interview Skill Gap": "Attend mock interviews, HR rounds, and resume-based interview practice.",
      "No Major Skill Gap": "You are performing well. Continue advanced placement preparation and company-specific practice."
    };

    const gaps = [];
    Object.keys(coreSkills).forEach(skillName => {
      let val = coreSkills[skillName];
      // If scaled, normalise to 10
      if (val > 10) val = val / 10;
      if (val < 6.0) {
        gaps.push(skillName);
      }
    });

    if (gaps.length === 0) {
      gaps.push("No Major Skill Gap");
    }

    const trainingRecommendations = gaps.map(gap => recommendations[gap]);

    // calculate overall level
    let avg = 0;
    const scores = Object.values(coreSkills).map(v => v > 10 ? v : v * 10);
    if (scores.length > 0) {
      avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    let overallLevel = "Needs Improvement";
    if (avg >= 80) overallLevel = "Strong Skill Profile";
    else if (avg >= 60) overallLevel = "Moderate Skill Profile";

    return {
      cluster: Math.floor(Math.random() * 3),
      overall_level: overallLevel,
      skill_gaps: gaps,
      training_recommendations: trainingRecommendations
    };
  };

  return requestWithFallback(API.post('/skill-gap', data), fallback);
};

export const getBiasAnalysis = () => {
  const fallback = () => ({
    gender_analysis: {
      gender_bias: [
        { gender: "Female", placement_rate: 76.5 },
        { gender: "Male", placement_rate: 78.2 }
      ],
      gender_bias_gap: 1.7
    },
    branch_analysis: {
      branch_bias: [
        { branch: "CSE", placement_rate: 88.4 },
        { branch: "IT", placement_rate: 84.6 },
        { branch: "ECE", placement_rate: 79.1 },
        { branch: "EEE", placement_rate: 70.5 },
        { branch: "MECH", placement_rate: 61.2 },
        { branch: "CIVIL", placement_rate: 54.3 }
      ],
      branch_bias_gap: 34.1
    }
  });

  return requestWithFallback(API.get('/bias-analysis'), fallback);
};