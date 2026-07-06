import React from 'react';
import Charts from '../components/Charts';
import { BarChart3, HelpCircle } from 'lucide-react';

const data = [
  { name: 'CGPA', score: 35 },
  { name: 'Coding Score', score: 25 },
  { name: 'Mock Interview', score: 15 },
  { name: 'Internships', score: 10 },
  { name: 'Projects', score: 8 },
  { name: 'Aptitude Score', score: 5 },
  { name: 'Attendance %', score: 4 },
  { name: 'Communication', score: 3 }
];

function FeatureImportance() {
  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      
      {/* Intro weights card */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(14, 165, 233, 0.02) 100%)' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BarChart3 size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Model Feature Coefficients</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            This chart illustrates the relative impact (influence weight) of various student metrics on the final placement classification. Academic CGPA and core Coding assessment scores constitute over 60% of the overall decision path.
          </p>
        </div>
      </div>

      <div className="modern-chart-card">
        <Charts data={data} title="Model Classification Feature Weights (%)" color="var(--accent-secondary)" />
      </div>
    </div>
  );
}

export default FeatureImportance;