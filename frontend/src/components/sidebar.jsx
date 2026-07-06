import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Target, 
  BarChart3, 
  LineChart, 
  AlertTriangle, 
  Scale, 
  GraduationCap 
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/placement', label: 'Placement Prediction', icon: Target },
  { to: '/feature', label: 'Feature Importance', icon: BarChart3 },
  { to: '/skill-gap', label: 'Skill Gap', icon: LineChart },
  { to: '/risk', label: 'Risk Analysis', icon: AlertTriangle },
  { to: '/bias', label: 'Bias Analysis', icon: Scale },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <GraduationCap className="sidebar-logo-icon" style={{ color: 'var(--accent-primary)', width: '32px', height: '32px' }} />
        <span className="sidebar-logo-text">InsightRecruit</span>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon className="sidebar-link-icon" style={{ width: '20px', height: '20px' }} />
              <span className="sidebar-link-label">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;