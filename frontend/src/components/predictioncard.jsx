import React from 'react';

function PredictionCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendColor
}) {
  return (
    <div className="modern-card" style={{ borderLeft: `4px solid ${color || 'var(--accent-primary)'}` }}>
      <div 
        className="modern-card-icon" 
        style={{ 
          background: `linear-gradient(135deg, ${color || 'var(--accent-primary)'} 0%, rgba(255,255,255,0.05) 150%)`,
          boxShadow: `0 4px 12px ${color}33`,
          color: '#ffffff'
        }}
      >
        {typeof Icon === 'function' ? <Icon size={24} /> : Icon}
      </div>
      <div className="modern-card-content">
        <h3 className="modern-card-title">{title}</h3>
        <h2 className="modern-card-value">{value}</h2>
        {trend && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: trendColor || 'var(--text-muted)', marginTop: '2px' }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export default PredictionCard;