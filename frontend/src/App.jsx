import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Sidebar from './components/sidebar'
import Navbar from './components/navbar'

import PlacementPrediction from './pages/placementprediction';
import FeatureImportance from './pages/featureimportance';
import SkillGap from './pages/skillgap';
import RiskAnalysis from './pages/riskanalysis';
import BiasAnalysis from './pages/biasanalysis';

import './modern-placement-form.css';
import { PlacementFormProvider } from './context/PlacementFormContext';


function App() {
  return (
    <PlacementFormProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/placement" element={<PlacementPrediction />} />
            <Route path="/feature" element={<FeatureImportance />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/risk" element={<RiskAnalysis />} />
            <Route path="/bias" element={<BiasAnalysis />} />
          </Routes>
        </div>
      </div>
    </PlacementFormProvider>
  );
}

export default App