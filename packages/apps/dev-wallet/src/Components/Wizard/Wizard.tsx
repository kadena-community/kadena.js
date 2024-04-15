import React, { Children, FC, useState } from 'react';

export function Wizard({
  children,
  initialStep = 0,
}: {
  children: React.ReactNode;
  initialStep?: number;
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  let stepIndex = -1;
  const goTo = (step: number) => {
    step >= 0 && step <= stepIndex && setCurrentStep(step);
  };
  children = Children.map(children, (child) => {
    if (
      !React.isValidElement(child) ||
      (child.type !== Wizard.Step && child.type !== Wizard.Render)
    ) {
      // return null if child is not a valid Wizard element
      return null;
    }

    if (child.type === Wizard.Step) {
      stepIndex++;
      // do not render the step if it is not the current step
      if (stepIndex !== currentStep) return null;
    }
    if (typeof child.props.children === 'function') {
      return child.props.children({
        step: currentStep,
        next: () => goTo(currentStep + 1),
        back: () => goTo(currentStep - 1),
        goTo,
      });
    }
    return child;
  });
  return <>{children}</>;
}

type WizardRenderProp = (actions: {
  step: number;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
}) => React.ReactNode;

type Render = FC<{
  children: React.ReactNode | WizardRenderProp;
}>;

Wizard.Render = function WizardRender() {
  throw new Error('Wizard.Render should be used inside Wizard');
} as Render;

Wizard.Step = function WizardStep() {
  throw new Error('Wizard.Step should be used inside Wizard');
} as Render;
