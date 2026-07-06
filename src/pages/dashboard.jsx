import React from 'react';
import PredictionCard from '../components/PredictionCard';
import { Percent, Users, Sparkles, DollarSign, ShieldCheck } from 'lucide-react';

const cardData = [
  {
    title: 'Model Accuracy',
    value: '89.4%',
    icon: ShieldCheck,
    color: '#6366f1',
    trend: '✓ Validated via cross-validation',
    trendColor: '#818cf8'
  },
  {
    title: 'Students Analyzed',
    value: '1,240+',
    icon: Users,
    color: '#0ea5e9',
    trend: '+14% growth vs last semester',
    trendColor: '#38bdf8'
  },
  {
    title: 'Average Package',
    value: '5.6 LPA',
    icon: DollarSign,
    color: '#10b981',
    trend: '+8.2% higher than industry average',
    trendColor: '#34d399'
  },
  {
    title: 'Placement Rate',
    value: '78.5%',
    icon: Percent,
    color: '#f59e0b',
    trend: 'Top 5% among regional institutes',
    trendColor: '#fbbf24'
  },
];

function Dashboard() {
  return (
    <div className="animate-slide-up">

      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(14,165,233,0.05) 100%)',
          border: '1px solid rgba(99,102,241,0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-secondary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-secondary)' }}>
            Welcome to InsightRecruit
          </span>
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Intelligence-Driven Student Placement Prediction
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', fontSize: '0.975rem', lineHeight: '1.6' }}>
          Leverage historical placement datasets and machine learning algorithms to predict student
          employment probability, identify critical skill gaps, run branch/gender fairness analysis,
          and discover optimization factors.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="modern-dashboard-grid">
        {cardData.map((card, idx) => (
          <PredictionCard key={idx} {...card} />
        ))}
      </div>

      {/* Quick Access */}
      <div className="glass-card" style={{ marginTop: '0.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Getting Started with Placement Analysis
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>🎯</span>
            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.95rem' }}>1. Placement Prediction</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Enter student profiles to run live classification and estimate salary metrics.
            </p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📈</span>
            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.95rem' }}>2. Skill Gap Mapping</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Detect technical or behavioral bottlenecks and review recommended training.
            </p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>⚖️</span>
            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.95rem' }}>3. Bias &amp; Fairness Analytics</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Monitor demographic differences across departments and gender categories.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;