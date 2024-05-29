import React, { Children, FC, useState } from 'react';

export function StepManager({
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
      (child.type !== StepManager.Step && child.type !== StepManager.Render)
    ) {
      // return null if child is not a valid Wizard element
      return null;
    }

    if (child.type === StepManager.Step) {
      stepIndex++;
      if (stepIndex !== child.props.id) {
        throw new Error(
          `Step index is out of order. Expected ${stepIndex} but got ${child.props.id}`,
        );
      }
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

type Step = FC<{
  id: number;
  children: React.ReactNode | WizardRenderProp;
}>;

StepManager.Render = function WizardRender() {
  throw new Error('Wizard.Render should be used inside Wizard');
} as Render;

StepManager.Step = function WizardStep() {
  throw new Error('Wizard.Step should be used inside Wizard');
} as Step;
