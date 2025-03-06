import type { FC } from 'react';
import React from 'react';
import { stepClass } from '../CompactStepper.css';
import { Stack } from './../../';

export interface IStep {
  label: string;
  isActive?: boolean;
}

export const Step: FC<IStep> = ({ isActive = false }) => {
  return <Stack as="li" className={stepClass({ isActive })} />;
};
