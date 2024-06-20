import React, { FC } from 'react';
import { wizardStep } from '../Wizard.css';
import { WizardElementProps } from '../model';

export const WizardStep: FC<WizardElementProps> = ({
  children,
  step = 0,
  next = () => {},
  back = () => {},
  goTo = () => {},
}) => {
  return (
    <div className={wizardStep}>{children({ step, next, back, goTo })}</div>
  );
};
