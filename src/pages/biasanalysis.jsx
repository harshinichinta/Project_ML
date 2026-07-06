import React, { useEffect, useState } from 'react';
import { getBiasAnalysis } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';
import { Scale, Activity, ArrowUpRight } from 'lucide-react';

const gapBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
  color: '#fff',
  borderRadius: 16,
  padding: '4px 14px',
  fontWeight: 700,
  fontSize: '0.85rem',
  marginLeft: 12,
  boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          Category: {label}
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
          {payload[0].name}: {Number(payload[0].value).toFixed(1)}%
        </div>
      </div>
    );
  }
  return null;
};

function BiasAnalysis() {
  const [bias, setBias] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBiasAnalysis();
        setBias(res.data);
      } catch {
        alert('Bias API Error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="centered-container" style={{ minHeight: '60vh' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Computing demographic placement statistics...
        </div>
      </div>
    );
  }

  if (!bias) {
    return (
      <div className="centered-container" style={{ minHeight: '60vh' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-danger)' }}>
          No bias analysis data available.
        </div>
      </div>
    );
  }

  const genderBias = (bias.gender_analysis?.gender_bias || [])
    .filter(item => item.gender !== 'Other')
    .map(item => ({
      gender: item.gender,
      placement_rate: Number(item.placement_rate)
    }));
  const genderBiasGap = bias.gender_analysis?.gender_bias_gap;

  const branchBias = bias.branch_analysis?.branch_bias?.map(item => ({
    branch: item.branch,
    placement_rate: Number(item.placement_rate)
  })) || [];
  const branchBiasGap = bias.branch_analysis?.branch_bias_gap;

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '1rem 0' }}>
      
      {/* Intro Fairness Header */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.02) 100%)' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.1)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Scale size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Demographic Parity & Algorithmic Fairness</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Check historical placement rates grouped by demographic fields to assess model fairness. High bias gaps indicate systemic disparity or unbalanced representation in the source training data.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2rem' }}>
        
        {/* Gender Bias Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} style={{ color: 'var(--accent-primary)' }} />
            Gender Placement Disparity
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderBias}>
                <defs>
                  <linearGradient id="genderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="gender" tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="placement_rate" name="Placement Rate" fill="url(#genderGrad)" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  <LabelList dataKey="placement_rate" position="top" formatter={(v) => v.toFixed(1) + '%'} style={{ fill: '#fff', fontSize: 12, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Gender Disparity Gap</span>
            <span style={gapBadge}>{genderBiasGap}%</span>
          </div>
        </div>

        {/* Branch Bias Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} style={{ color: 'var(--accent-secondary)' }} />
            Academic Branch Rates
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchBias}>
                <defs>
                  <linearGradient id="branchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="branch" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="placement_rate" name="Placement Rate" fill="url(#branchGrad)" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  <LabelList dataKey="placement_rate" position="top" formatter={(v) => v.toFixed(1) + '%'} style={{ fill: '#fff', fontSize: 11, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Branch Spread Gap</span>
            <span style={gapBadge}>{branchBiasGap}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BiasAnalysis;