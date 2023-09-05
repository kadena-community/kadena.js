import type { ICheckpoint, IProgressBarProps } from './ProgressBar';
import { ProgressBar } from './ProgressBar';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IProgressBarProps> = {
  title: 'Components/ProgressBar',
  argTypes: {
    checkpoints: {
      control: {
        type: 'object',
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
