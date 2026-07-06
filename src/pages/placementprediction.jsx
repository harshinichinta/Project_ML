import React, { useState, useEffect } from 'react';
import { predictPlacement, getSkillGap } from '../services/api';
import { usePlacementForm } from '../context/PlacementFormContext';
import { 
  BookOpen, 
  Award, 
  User, 
  Sparkles, 
  DollarSign, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const defaultForm = {
  age: 22,
  cgpa: '',
  internships_count: '',
  projects_count: '',
  aptitude_score: '',
  coding_skill_score: '',
  communication_skill_score: '',
  logical_reasoning_score: '',
  mock_interview_score: '',
  backlogs: '',
  attendance_percentage: '',
  gender: 'Female',
  branch: 'ECE'
};

function PlacementPrediction() {
  const { formData: contextForm, setFormData: setContextForm, setSkillGapData } = usePlacementForm();
  const [formData, setFormData] = useState(contextForm || defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Restore form from context on mount
  useEffect(() => {
    if (contextForm) setFormData(contextForm);
  }, [contextForm]);

  // Save form to context on change
  useEffect(() => {
    setContextForm(formData);
    // eslint-disable-next-line
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setResult(null);
    setContextForm(defaultForm);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(false);
    
    // Quick validation
    const requiredKeys = ['cgpa', 'internships_count', 'projects_count', 'aptitude_score', 'coding_skill_score', 'communication_skill_score', 'logical_reasoning_score', 'mock_interview_score', 'backlogs', 'attendance_percentage'];
    const missing = requiredKeys.filter(k => formData[k] === '');
    if (missing.length > 0) {
      alert(`Please fill in all scores and academic details.`);
      return;
    }

    setLoading(true);
    try {
      const response = await predictPlacement(formData);
      setResult(response.data);
      
      // Fetch skill gap data after prediction
      const payload = { ...formData };
      ['coding_skill_score','aptitude_score','communication_skill_score','logical_reasoning_score','mock_interview_score'].forEach(k => {
        const v = Number(payload[k]);
        if (!isNaN(v)) payload[k] = v <= 10 ? v * 10 : v;
      });
      const skillGapResponse = await getSkillGap(payload);
      setSkillGapData(skillGapResponse.data);
    } catch (error) {
      console.error(error);
      alert('Prediction or skill gap fetch failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // SVG circular progress calculation
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const confidence = result ? result.placement_confidence : 0;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="modern-placement-form-bg animate-slide-up">
      <div className="modern-placement-form">
        <form className="modern-placement-form-grid" onSubmit={handleSubmit}>
          
          {/* Section 1: Academic Records */}
          <div className="form-section-title">
            <BookOpen size={18} />
            Academic Credentials
          </div>
          
          <div className="modern-placement-form-field">
            <label>Cumulative GPA (/10)</label>
            <input type="number" step="0.1" min="0" max="10" name="cgpa" placeholder="e.g. 8.5" value={formData.cgpa} onChange={handleChange} required />
          </div>
          
          <div className="modern-placement-form-field">
            <label>Branch of Study</label>
            <select name="branch" value={formData.branch} onChange={handleChange}>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="IT">Information Tech (IT)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="EEE">Electrical (EEE)</option>
              <option value="MECH">Mechanical (MECH)</option>
              <option value="CIVIL">Civil (CIVIL)</option>
            </select>
          </div>

          <div className="modern-placement-form-field">
            <label>Attendance Percentage</label>
            <input type="number" min="0" max="100" name="attendance_percentage" placeholder="e.g. 85" value={formData.attendance_percentage} onChange={handleChange} required />
          </div>

          <div className="modern-placement-form-field">
            <label>Active Backlogs</label>
            <input type="number" min="0" max="10" name="backlogs" placeholder="e.g. 0" value={formData.backlogs} onChange={handleChange} required />
          </div>

          {/* Section 2: Assessment Scores */}
          <div className="form-section-title">
            <Award size={18} />
            Skill Assessments (Score 0-10)
          </div>

          <div className="modern-placement-form-field">
            <label>Coding Skill Score</label>
            <input type="number" min="0" max="10" name="coding_skill_score" placeholder="0–10" value={formData.coding_skill_score} onChange={handleChange} required />
          </div>

          <div className="modern-placement-form-field">
            <label>Aptitude Score</label>
            <input type="number" min="0" max="10" name="aptitude_score" placeholder="0–10" value={formData.aptitude_score} onChange={handleChange} required />
          </div>

          <div className="modern-placement-form-field">
            <label>Mock Interview Performance</label>
            <input type="number" min="0" max="10" name="mock_interview_score" placeholder="0–10" value={formData.mock_interview_score} onChange={handleChange} required />
          </div>

          <div className="modern-placement-form-field">
            <label>Logical Reasoning</label>
            <input type="number" min="0" max="10" name="logical_reasoning_score" placeholder="0–10" value={formData.logical_reasoning_score} onChange={handleChange} required />
          </div>

          <div className="modern-placement-form-field">
            <label>Communication Score</label>
            <input type="number" min="0" max="10" name="communication_skill_score" placeholder="0–10" value={formData.communication_skill_score} onChange={handleChange} required />
          </div>

          {/* Section 3: Personal & Background */}
          <div className="form-section-title">
            <User size={18} />
            Background & Profile
          </div>

          <div className="modern-placement-form-field">
            <label>Age (Years)</label>
            <input type="number" min="18" max="30" name="age" placeholder="e.g. 21" value={formData.age} onChange={handleChange} required />
          </div>

          <div className="modern-placement-form-field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="modern-placement-form-field">
            <label>Projects Completed</label>
            <input type="number" min="0" max="20" name="projects_count" placeholder="e.g. 3" value={formData.projects_count} onChange={handleChange} required />
          </div>

          <div className="modern-placement-form-field">
            <label>Internships Completed</label>
            <input type="number" min="0" max="10" name="internships_count" placeholder="e.g. 1" value={formData.internships_count} onChange={handleChange} required />
          </div>
        </form>

        <div className="modern-placement-form-actions">
          <button className="modern-placement-form-btn reset" type="button" onClick={handleReset}>
            Reset Fields
          </button>
          <button className="modern-placement-form-btn submit" type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Evaluating...' : 'Predict Status'}
          </button>
        </div>

        {/* Prediction Output Results */}
        {result && (
          <div className="modern-placement-form-result">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--accent-secondary)' }}>Evaluation Report</span>
            </div>

            <div className="result-flex-container">
              {/* Circular Gauge */}
              <div className="progress-ring-container">
                <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    stroke="rgba(255, 255, 255, 0.05)"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  <circle
                    stroke={result.placement_status === "Placed" ? "var(--color-success)" : "var(--color-danger)"}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ 
                      strokeDashoffset, 
                      transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      strokeLinecap: 'round'
                    }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                </svg>
                <div className="progress-ring-value">
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, lineHeight: 1 }}>{confidence}%</div>
                  <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginTop: '2px' }}>Confidence</div>
                </div>
              </div>

              {/* Status and Salary Details */}
              <div className="result-main-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {result.placement_status === "Placed" ? (
                    <CheckCircle size={22} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <XCircle size={22} style={{ color: 'var(--color-danger)' }} />
                  )}
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 900, 
                    color: result.placement_status === "Placed" ? 'var(--color-success)' : 'var(--color-danger)'
                  }}>
                    {result.placement_status}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'left', marginTop: '0.25rem' }}>
                  {result.placement_status === "Placed" 
                    ? "Congratulations! The model predicts that this student has a high probability of securing a placement package."
                    : "The model suggests a lower placement probability. Review the Skill Gap tab for concrete training plans."
                  }
                </p>

                {result.predicted_salary_lpa !== null && (
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem', 
                    borderRadius: '10px', 
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                    <DollarSign size={16} style={{ color: 'var(--color-success)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Estimated Package: </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--color-success)' }}>
                      {result.predicted_salary_lpa} LPA
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacementPrediction;