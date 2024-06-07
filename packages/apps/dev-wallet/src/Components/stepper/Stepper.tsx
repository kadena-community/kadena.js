import React, { ReactNode } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

export const Stepper = ({
  steps,
  initialPath,
}: {
  initialPath?: string;
  steps: { id: string; route: string; title?: string; elements: ReactNode }[];
}) => {
  const navigate = useNavigate();
  if (initialPath) {
    navigate(initialPath);
  }
  return (
    <>
      {steps.map((step) => (
        <span> {step.title}</span>
      ))}
      <Routes>
        {steps.map((step) => (
          <Route key={step.id} path={step.route} element={step.elements} />
        ))}
      </Routes>
    </>
  );
};
