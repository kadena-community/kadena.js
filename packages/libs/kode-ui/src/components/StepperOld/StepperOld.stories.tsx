import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { StepperProps } from './Stepper';
import { Step, Stepper } from './Stepper';

const meta: Meta<StepperProps> = {
  title: 'Components/StepperOld',
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
  argTypes: {},
};

export default meta;

type Story = StoryObj<StepperProps>;

export const Primary: Story = {
  name: 'Stepper',
  args: {},
  render: (args) => {
    return (
      <Stepper {...args}>
        <Step>Prince Adam</Step>
        <Step active>Power Sword</Step>
        <Step>He-man</Step>
        <Step>Master of the Universe</Step>
      </Stepper>
    );
  },
};
