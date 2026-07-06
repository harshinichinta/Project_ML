import React, { createContext, useContext, useState } from 'react';

const PlacementFormContext = createContext();


export function PlacementFormProvider({ children }) {
  const [formData, setFormData] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  return (
    <PlacementFormContext.Provider value={{ formData, setFormData, skillGapData, setSkillGapData }}>
      {children}
    </PlacementFormContext.Provider>
  );
}

export function usePlacementForm() {
  return useContext(PlacementFormContext);
}