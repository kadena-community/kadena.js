import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { colorAtoms } from '../../styles/atoms.css';
import type { IProgressCircleProps } from './ProgressCircle';
import { ProgressCircle } from './ProgressCircle';

const meta: Meta<IProgressCircleProps> = {
  title: 'Components/ProgressCircle',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component:
          'A component that shows the completion status of a task or process.',
      },
    },
  },
  argTypes: {
    isIndeterminate: {
      control: {
        type: 'boolean',
      },
    },
    value: {
      control: {
        type: 'number',
      },
    },
    minValue: {
      control: {
        type: 'number',
      },
    },
    maxValue: {
      control: {
        type: 'number',
      },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select',
      },
    },
    color: {
      options: Object.keys(colorAtoms),
      control: {
        type: 'select',
      },
    },
    label: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;

type Story = StoryObj<IProgressCircleProps>;

export const Primary: Story = {
  name: 'ProgressCircle',
  args: {
    isIndeterminate: true,
    value: 25,
    minValue: 0,
    maxValue: 100,
    size: 'md',
    color: 'icon.brand.primary.default',
    label: 'Progress',
  },
  render: (args) => {
    return <ProgressCircle {...args} />;
  },
};
