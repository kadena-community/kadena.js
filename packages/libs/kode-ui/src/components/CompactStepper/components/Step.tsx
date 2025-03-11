import { motion } from 'framer-motion';
import type { FC } from 'react';
import React from 'react';
import { stepClass, WIDTH } from '../CompactStepper.css';

export interface IStep {
  label: string;
  isActive?: boolean;
}

export const Step: FC<IStep> = ({ isActive = false }) => {
  const transitionValues = {
    duration: 0.4,
    yoyo: Infinity,
    ease: 'easeOut',
  };

  return (
    <motion.li
      key={isActive.toString()}
      initial={{ width: `${WIDTH}px` }}
      exit={{ width: `${WIDTH}px` }}
      animate={{
        width: isActive
          ? [`${WIDTH * 20}px`, `${WIDTH * 4}px`]
          : [`${WIDTH * 10}px`, `${WIDTH}px`],
      }}
      transition={{
        backgroundColor: transitionValues,
        width: transitionValues,
      }}
      className={stepClass({ isActive })}
    />
  );
};
