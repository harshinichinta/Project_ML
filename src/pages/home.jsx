import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BarChart3, ShieldCheck, Target } from 'lucide-react';

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Placement Prediction',
    text: 'Estimate placement probability from student profile inputs and historical patterns.'
  },
  {
    icon: BarChart3,
    title: 'Feature Insights',
    text: 'Review the strongest factors influencing success and model decisions.'
  },
  {
    icon: Target,
    title: 'Skill Gap Analysis',
    text: 'Spot gaps early and identify the most useful training focus areas.'
  }
];

function Home() {
  return (
    <div className="animate-slide-up">
      <div
        className="glass-card"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(99,102,241,0.08) 100%)',
          border: '1px solid rgba(14,165,233,0.18)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-secondary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-secondary)' }}>
            Welcome to InsightRecruit
          </span>
        </div>
        <h2 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: '0.85rem', letterSpacing: '-0.03em' }}>
          Start with the home page, then explore the platform tools.
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '760px', fontSize: '1rem', lineHeight: '1.7' }}>
          This landing screen gives you a quick overview of what the platform can do. Use it to
          jump straight to prediction, feature importance, skill gap, risk, and fairness analysis tools.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link
            to="/placement"
            className="sidebar-link"
            style={{
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-primary)'
            }}
          >
            Go to Prediction
          </Link>
        </div>
      </div>

      <div className="modern-dashboard-grid">
        {highlights.map(({ icon: Icon, title, text }) => (
          <div key={title} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'grid', placeItems: 'center', marginBottom: '1rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(14,165,233,0.18) 100%)' }}>
              <Icon size={22} style={{ color: '#fff' }} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;