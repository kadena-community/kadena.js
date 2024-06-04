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
  steps: { title: string; id: string }[];
}) {
  const [currentStep, setCurrentStep] = useState(initialStep || steps[0].id);
  let stepIndex = -1;
  const goTo = (step: number) => {
    step >= 0 && step <= stepIndex && setCurrentStep(steps[step].id);
  };

  return (
    <>
      {/* or */}
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
