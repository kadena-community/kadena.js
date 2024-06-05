import React, { ReactNode, useState } from 'react';

export function Stepper({
  children,
  steps,
  initialStep,
}: {
  children: (props: {
    currentStep: string;
    next: () => void;
    back: () => void;
    goTo: (step: number) => void;
  }) => ReactNode;
  initialStep?: string;
  steps: { id: string; route: string; title?: string; elements: ReactNode }[];
}) {
  // on refresh navigate to first step / route
  const [currentStep, setCurrentStep] = useState(initialStep || steps[0].id);
  let stepIndex = -1;
  const goTo = (step: number) => {
    step >= 0 && step <= stepIndex && setCurrentStep(steps[step].id);
  };

  return (
    <>
      {children({
        currentStep,
        next: () => {
          const currentIndex = steps.findIndex(
            (step) => step.id === currentStep,
          );
          stepIndex++;
          goTo(currentIndex + 1);
        },
        back: () => {
          const currentIndex = steps.findIndex(
            (step) => step.id === currentStep,
          );
          stepIndex--;
          goTo(currentIndex - 1);
        },
        goTo,
      })}
    </>
  );
}
