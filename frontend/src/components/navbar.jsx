
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const titleMap = {
  '/': 'Home',
  '/placement': 'Placement Predictive Model',
  '/feature': 'Feature Importance Ranking',
  '/skill-gap': 'Skill Gap Analysis & Recommendations',
  '/risk': 'Placement Risk Profile',
  '/bias': 'Model Fairness & Bias Analysis',
};

function Navbar() {
  const location = useLocation();
  const currentTitle = titleMap[location.pathname] || 'Student Placement Analytics';

  return (
    <header className="navbar">
      <h1 className="navbar-title">{currentTitle}</h1>
      <div className="navbar-actions">
        <div className="navbar-avatar">
          <User size={20} style={{ color: '#fff' }} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;