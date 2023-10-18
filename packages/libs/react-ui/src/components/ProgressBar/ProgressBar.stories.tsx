import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { ICheckpoint, IProgressBarProps } from './ProgressBar';
import { ProgressBar } from './ProgressBar';

const meta: Meta<IProgressBarProps> = {
  title: 'Components/ProgressBar',
  parameters: {
    docs: {
      description: {
        component:
          'A component that shows the completion status of a task or process.',
      },
    },
  },
  argTypes: {
    checkpoints: {
      control: {
        type: 'object',
        description: 'Each checkpoint has a <i>title</i> and a <i>status</i>.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<IProgressBarProps>;

const testCheckpoints: ICheckpoint[] = [
  {
    title: 'Checkpoint 1',
    status: 'complete',
  },
  {
    title: 'Checkpoint 2',
    status: 'complete',
  },
  {
    title: 'Checkpoint 3',
    status: 'pending',
  },
  {
    title: 'Checkpoint 4',
    status: 'incomplete',
  },
];

export const Primary: Story = {
  name: 'ProgressBar',
  args: {
    checkpoints: testCheckpoints,
  },
  render: ({ checkpoints }) => {
    return <ProgressBar checkpoints={checkpoints} />;
  },
};
