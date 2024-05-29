import React, {
  Children,
  FC,
  ReactElement,
  cloneElement,
  useState,
} from 'react';
import { wizardContainer, wizardStep } from './Wizard.css';
import { WizardRender } from './components/Wizard-render';
import { WizardStep } from './components/Wizard-step';

interface WizardProps {
  children: React.ReactNode;
  initialStep?: number;
  steps: { title: string }[];
}

export const Wizard: FC<WizardProps> = ({
  children,
  steps,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  let stepIndex = -1;

  const goTo = (step: number) => {
    if (step >= 0) {
      setCurrentStep(step);
    }
  };

  const modifiedChildren = Children.map(children, (child, index) => {
    if (
      !React.isValidElement(child) ||
      (child.type !== WizardStep && child.type !== WizardRender)
    ) {
      return null;
    }

    if (child.type === WizardStep) {
      stepIndex++;
      // do not render the step if it is not the current step
      if (stepIndex !== currentStep) return null;
    }

    if (typeof child.props.children === 'function') {
      return cloneElement(child as ReactElement, {
        key: `step-${index}`,
        step: currentStep,
        next: () => {
          console.log('goinh', currentStep + 1);
          goTo(currentStep + 1);
        },
        back: () => {
          console.log(currentStep);

          console.log('goinh', currentStep - 1);
          goTo(currentStep - 1);
        },
        goTo,
      });
    }

    return cloneElement(child, { key: index });
  });
  // compare the steps to the current step and add the styles
  return (
    <>
      {steps.map((step, index) => (
        <div key={index} className={wizardStep}>
          {step.title}
        </div>
      ))}
      <div className={wizardContainer}>{modifiedChildren}</div>
    </>
  );
};
