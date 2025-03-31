import { AnimatePresence, motion } from 'framer-motion';
import type { FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { Stack } from '../';
import {
  iconWrapperClass,
  textClass,
  textWrapperClass,
} from './CompactStepper.css';
import type { IStep } from './components/Step';
import { Step } from './components/Step';

export interface ICompactStepperProps {
  steps: IStep[];
  stepIdx: number;
  showLabel?: boolean;
  endVisual?: ReactElement;
}

export const CompactStepper: FC<ICompactStepperProps> = ({
  steps,
  stepIdx,
  showLabel = true,
  endVisual,
}) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    setLabel(steps[stepIdx].label);
  }, [stepIdx]);

  return (
    <Stack alignItems="center" gap="xs">
      <Stack
        as="ul"
        alignItems="center"
        gap="xs"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {steps.map((step, idx) => (
          <Step key={step.label} {...step} isActive={idx === stepIdx} />
        ))}
      </Stack>
      <Stack className={iconWrapperClass}>{endVisual && endVisual}</Stack>
      <Stack alignItems="center" className={textWrapperClass}>
        {showLabel && (
          <AnimatePresence>
            <motion.div
              key={label}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute' }}
            >
              <Stack marginInlineStart="sm" className={textClass}>
                {label}
              </Stack>
            </motion.div>
          </AnimatePresence>
        )}
      </Stack>
    </Stack>
  );
};
