import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getVariants } from '../../storyDecorators/getVariants';

import type { IStepProps } from './Step';
import { Step } from './Step';
import type { IStepperProps } from './Stepper';
import { Stepper } from './Stepper';
import { stepClass } from './Stepper.css';

const { status } = getVariants(stepClass);

const meta: Meta<IStepProps> = {
  title: 'Components/Stepper',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component: 'A component can show the steps through a process',
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: status,
    },
  },
};

export default meta;

type Story = StoryObj<IStepProps>;

export const Primary: Story = {
  name: 'Stepper',
  args: {
    status: 'valid',
  },
  render: (args) => {
    return (
      <Stepper {...args}>
        <Step>Prince Adam</Step>
        <Step active status={args.status}>
          Power Sword
        </Step>
        <Step>He-man</Step>
        <Step>Master of the Universe</Step>
      </Stepper>
    );
  },
};
