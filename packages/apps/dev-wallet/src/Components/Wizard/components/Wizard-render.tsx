import React, { FC } from 'react';
import { wizardRender } from '../Wizard.css';
import { WizardElementProps } from '../model';

export const WizardRender: FC<WizardElementProps> = ({
  children,
  step = 0,
  next = () => {},
  back = () => {},
  goTo = () => {},
}) => {
  return (
    <div className={wizardRender}>{children({ step, next, back, goTo })}</div>
  );
};
