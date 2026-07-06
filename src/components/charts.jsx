import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          Feature: {label}
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
          Weight Score: {payload[0].value}%
        </div>
      </div>
    );
  }
  return null;
};

function Charts({ data, title = 'Skill Analysis', color = 'var(--accent-primary)' }) {
  const gradientId = `chartGrad_${title.replace(/\s+/g, '')}`;

  return (
    <div style={{ width: '100%' }}>
      <h3 className="modern-chart-title" style={{ justifyContent: 'center', fontSize: '1.2rem', marginBottom: '1.5rem', color: '#fff' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barCategoryGap={24}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontWeight: 600, fontSize: 13, fill: 'var(--text-secondary)' }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="score" fill={`url(#${gradientId})`} radius={[8, 8, 0, 0]} maxBarSize={60}>
            <LabelList 
              dataKey="score" 
              position="top" 
              style={{ fontWeight: 700, fill: '#ffffff', fontSize: 13 }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;