import React, {
  Children,
  FC,
  ReactElement,
  cloneElement,
  useState,
} from 'react';
import { wizardContainer } from './Wizard.css';
import { WizardStep } from './components/Wizard-step';
import { WizardRenderProp, WizardStepProps } from './model';

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

  const modifiedChildren = Children.map(children, (child) => {
    if (
      !React.isValidElement(child) ||
      (child.type !== WizardStep && child.type !== Wizard.Render)
    ) {
      // return null if child is not a valid Wizard element
      return null;
    }

    if (child.type === WizardStep) {
      stepIndex++;
      // do not render the step if it is not the current step
      if (stepIndex !== currentStep) return null;

      return cloneElement(child as ReactElement<WizardStepProps>, {
        step: currentStep,
        next: () => goTo(currentStep + 1),
        back: () => goTo(currentStep - 1),
        goTo,
      });
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

  return <div className={wizardContainer}>{modifiedChildren}</div>;
}

type Render = FC<{
  children: React.ReactNode | WizardRenderProp;
}>;

Wizard.Render = function WizardRender() {
  throw new Error('Wizard.Render should be used inside Wizard');
} as Render;
