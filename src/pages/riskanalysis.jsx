import React, { useState, useEffect } from 'react';
import { getRiskScore } from '../services/api';
import { usePlacementForm } from '../context/PlacementFormContext';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight, 
  Info 
} from 'lucide-react';

function RiskAnalysis() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const { formData } = usePlacementForm();

  const checkRisk = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      const res = await getRiskScore(formData);
      setRisk(res.data);
    } catch (error) {
      alert('Risk analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  // Automatically check risk if form data is already present
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0 && formData.cgpa !== '') {
      checkRisk();
    }
    // eslint-disable-next-line
  }, [formData]);

  // Determine advice details based on scores
  const getPersonalizedAdvice = () => {
    if (!formData) return [];
    const advice = [];
    
    if (Number(formData.backlogs) > 0) {
      advice.push({
        type: 'danger',
        text: `Active Backlogs (${formData.backlogs}): Most companies have a strict 0 active backlog policy. Focus on clearing backlogs immediately.`
      });
    }
    if (Number(formData.cgpa) < 7.5) {
      advice.push({
        type: 'warning',
        text: `CGPA (${formData.cgpa}/10): Aim to increase your CGPA above 7.5 to clear the initial resume screening filters of top tech firms.`
      });
    }
    if (Number(formData.attendance_percentage) < 75) {
      advice.push({
        type: 'danger',
        text: `Low Attendance (${formData.attendance_percentage}%): Attendance below 75% could disqualify you from campus recruitment drives.`
      });
    }
    if (Number(formData.coding_skill_score) < 6) {
      advice.push({
        type: 'warning',
        text: `Coding Score (${formData.coding_skill_score}/10): Competitive coding is critical. Practice DSA on LeetCode/CodeChef to improve.`
      });
    }
    if (Number(formData.mock_interview_score) < 6) {
      advice.push({
        type: 'warning',
        text: `Mock Interview (${formData.mock_interview_score}/10): Brush up on system design and core subjects; practice mock coding interviews.`
      });
    }
    if (Number(formData.internships_count) === 0) {
      advice.push({
        type: 'info',
        text: `No Internships: Having at least one internship significantly improves selection odds. Consider virtual internships or projects.`
      });
    }
    
    if (advice.length === 0) {
      advice.push({
        type: 'success',
        text: 'Your profile satisfies all primary placement filters! Continue practicing advanced technical problems.'
      });
    }
    
    return advice;
  };

  const adviceItems = getPersonalizedAdvice();

  if (!formData || formData.cgpa === '') {
    return (
      <div className="centered-container animate-slide-up" style={{ minHeight: '60vh' }}>
        <div className="glass-card" style={{ maxWidth: '520px', textAlign: 'center', padding: '3rem 2rem' }}>
          <ShieldAlert size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>No Profile Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            We need a student profile to calculate readiness risk. Please fill out the Placement Prediction form first to set up the metrics.
          </p>
          <Link to="/placement" className="btn-primary" style={{ textDecoration: 'none' }}>
            Go to Prediction Form
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Speedometer arc calculations (半圆 gauge)
  const radius = 90;
  const stroke = 12;
  const score = risk ? risk.risk_score : 0;
  const isReady = risk ? risk.risk_level === "Placement Ready" : false;
  const isHighRisk = risk ? risk.risk_level === "High Risk" : false;

  const colorClass = isReady 
    ? 'var(--color-success)' 
    : isHighRisk 
      ? 'var(--color-danger)' 
      : 'var(--color-warning)';

  const strokeDasharray = radius * Math.PI;
  const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;

  return (
    <div className="animate-slide-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
        
        {/* Left: Speedometer Gauge */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Readiness Score
          </h3>
          
          <div style={{ position: 'relative', width: '200px', height: '120px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <svg width="190" height="110">
              <path
                d="M 10 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={stroke}
                strokeLinecap="round"
              />
              <path
                d="M 10 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={colorClass}
                strokeWidth={stroke}
                strokeDasharray={`${strokeDasharray} ${strokeDasharray}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', bottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {loading ? '...' : `${score}%`}
              </span>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Readiness Index
              </span>
            </div>
          </div>

          <div style={{ 
            marginTop: '1rem',
            padding: '0.4rem 1.25rem', 
            borderRadius: '99px', 
            fontWeight: 800,
            fontSize: '0.85rem',
            background: isReady ? 'var(--color-success-glow)' : isHighRisk ? 'var(--color-danger-glow)' : 'var(--color-warning-glow)',
            color: colorClass,
            border: `1px solid ${colorClass}40`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            {isReady ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            {loading ? 'Evaluating...' : risk?.risk_level}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.25rem', maxWidth: '300px' }}>
            Index computed dynamically using ML coefficients representing student academic records and assessment values.
          </p>
        </div>

        {/* Right: Personalized Recommendations */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--accent-secondary)' }} />
            Risk Factor Evaluation
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', maxHeight: '350px', paddingRight: '0.25rem' }}>
            {adviceItems.map((item, idx) => {
              let iconColor = 'var(--accent-secondary)';
              let cardBg = 'rgba(14, 165, 233, 0.05)';
              let cardBorder = 'rgba(14, 165, 233, 0.15)';

              if (item.type === 'danger') {
                iconColor = 'var(--color-danger)';
                cardBg = 'var(--color-danger-glow)';
                cardBorder = 'rgba(244, 63, 94, 0.2)';
              } else if (item.type === 'warning') {
                iconColor = 'var(--color-warning)';
                cardBg = 'var(--color-warning-glow)';
                cardBorder = 'rgba(245, 158, 11, 0.2)';
              } else if (item.type === 'success') {
                iconColor = 'var(--color-success)';
                cardBg = 'var(--color-success-glow)';
                cardBorder = 'rgba(16, 185, 129, 0.2)';
              }

              return (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    background: cardBg, 
                    border: `1px solid ${cardBorder}` 
                  }}
                >
                  <Info size={18} style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default RiskAnalysis;