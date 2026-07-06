import React, { useEffect, useState } from 'react';
import { usePlacementForm } from '../context/PlacementFormContext';
import { getSkillGap } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

function SkillGap() {
  const { formData, skillGapData, setSkillGapData } = usePlacementForm();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSkillGapData = async (payload) => {
    setLoading(true);
    try {
      const res = await getSkillGap(payload);
      setSkillGapData(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Skill gap fetch failed', err);
      setSkillGapData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0 && formData.cgpa !== '') {
      const payload = { ...formData };
      ['coding_skill_score','aptitude_score','communication_skill_score','logical_reasoning_score','mock_interview_score'].forEach(k => {
        const v = Number(payload[k]);
        if (!isNaN(v)) payload[k] = v <= 10 ? v * 10 : v;
      });
      fetchSkillGapData(payload);
    }
    // eslint-disable-next-line
  }, [formData]);

  const handleRefresh = () => {
    if (!formData || Object.keys(formData).length === 0 || formData.cgpa === '') return;
    const payload = { ...formData };
    ['coding_skill_score','aptitude_score','communication_skill_score','logical_reasoning_score','mock_interview_score'].forEach(k => {
      const v = Number(payload[k]);
      if (!isNaN(v)) payload[k] = v <= 10 ? v * 10 : v;
    });
    fetchSkillGapData(payload);
  };

  if (!formData || formData.cgpa === '') {
    return (
      <div className="centered-container animate-slide-up" style={{ minHeight: '60vh' }}>
        <div className="glass-card" style={{ maxWidth: '520px', textAlign: 'center', padding: '3rem 2rem' }}>
          <ShieldAlert size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>No Profile Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            To analyze skill gaps, please fill in the student profile first in the prediction panel.
          </p>
          <Link to="/placement" className="btn-primary" style={{ textDecoration: 'none' }}>
            Go to Prediction Form
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const isStrong = skillGapData?.overall_level.includes('Strong');
  const isModerate = skillGapData?.overall_level.includes('Moderate');
  const levelColor = isStrong 
    ? 'var(--color-success)' 
    : isModerate 
      ? 'var(--color-warning)' 
      : 'var(--color-danger)';

  const levelBg = isStrong 
    ? 'var(--color-success-glow)' 
    : isModerate 
      ? 'var(--color-warning-glow)' 
      : 'var(--color-danger-glow)';

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      <div className="glass-card" style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        
        {/* Header Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Target size={24} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Skill Gap Report</h2>
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={loading}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid var(--border-glass)', 
              padding: '0.5rem 1rem', 
              borderRadius: '10px', 
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Analyzing...' : 'Re-Evaluate'}
          </button>
        </div>

        {loading && !skillGapData ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Evaluating skills gap patterns...
          </div>
        ) : skillGapData ? (
          <div>
            {/* Overall Skill Summary Card */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '2rem'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Competency Profile
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  {skillGapData.overall_level}
                </h3>
              </div>
              <div style={{ 
                padding: '0.4rem 1rem', 
                borderRadius: '99px', 
                fontWeight: 800, 
                fontSize: '0.8rem',
                background: levelBg, 
                color: levelColor,
                border: `1px solid ${levelColor}40`
              }}>
                {isStrong ? 'Optimal' : isModerate ? 'Attention Needed' : 'Action Required'}
              </div>
            </div>

            {/* Gaps List Section */}
            <div style={{ marginBottom: '2.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Detected Gaps & Vulnerabilities
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {skillGapData.skill_gaps && skillGapData.skill_gaps.map((gap, idx) => {
                  const isClear = gap === 'No Major Skill Gap';
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        background: isClear ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                        border: `1px solid ${isClear ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'}`
                      }}
                    >
                      {isClear ? (
                        <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      ) : (
                        <AlertTriangle size={18} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                        {gap}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations Section */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Actionable Training Roadmap
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {skillGapData.training_recommendations && skillGapData.training_recommendations.map((rec, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      padding: '1rem', 
                      borderRadius: '12px', 
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.03)' 
                    }}
                  >
                    <span style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 500 }}>
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {lastUpdated && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2rem', textAlign: 'right' }}>
                Last updated at: {lastUpdated}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <HelpCircle size={32} style={{ color: 'var(--accent-secondary)', marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Failed to load skill details. Try clicking Re-Evaluate.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default SkillGap;