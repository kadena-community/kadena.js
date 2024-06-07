import React, { ReactNode } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

export const Stepper = ({
  steps,
  initialPath,
}: {
  initialPath?: string;
  steps: { id: string; route: string; title?: string; elements: ReactNode }[];
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCompleted = (index: number) =>
    index > steps.findIndex((step) => step.route === location.pathname);

  if (initialPath) {
    navigate(initialPath);
  }
  return (
    <>
      {/* style this steps, if they have a title it will render bellow otherwise its just a line to show some progress
      we can use the selectors like
      selectors: {
        '&[data-active="true"]': css
      }
      */}
      {steps.map((step, index) => (
        <span
          key={index}
          data-completed={isCompleted(index)}
          data-active={location.pathname === step.route}
        >
          {' '}
          {step.title}
        </span>
      ))}
      <Routes>
        {steps.map((step) => (
          <Route key={step.id} path={step.route} element={step.elements} />
        ))}
      </Routes>
    </>
  );
};
