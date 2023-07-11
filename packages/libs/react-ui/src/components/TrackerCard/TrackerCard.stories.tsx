import { ITrackerCardProps, TrackerCard } from './TrackerCard';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SystemIcon } from '../Icons';

const meta: Meta<ITrackerCardProps> = {
  title: 'Components/TrackerCard',
  argTypes: {
    firstTitle: {
      control: {
        type: 'text',
      },
    },
    firstContent: {
      control: {
        type: 'text',
      },
    },
    secondTitle: {
      control: {
        type: 'text',
      },
    },
    secondContent: {
      control: {
        type: 'text',
      },
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    helperTextType: {
      control: {
        type: 'select',
        options: ['mild', 'severe'],
      },
    },
    isAccount: {
      control: {
        type: 'boolean',
      },
    },
    icon: {
      options: [
        undefined,
        ...(Object.keys(SystemIcon) as (keyof typeof SystemIcon)[]),
      ],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;

type Story = StoryObj<ITrackerCardProps>;

export const Primary: Story = {
  name: 'TrackerCard',
  args: {
    firstTitle: 'Account',
    firstContent: 'k:1234567890abcdef',
    secondTitle: 'Balance',
    secondContent: '1000',
    helperText: 'This is a helper text',
    helperTextType: 'mild',
    isAccount: true,
    icon: undefined,
  },
  render: ({
    firstTitle,
    firstContent,
    secondTitle,
    secondContent,
    helperText,
    helperTextType,
    isAccount,
    icon: Icon,
  }) => {
    return (
      <TrackerCard
        firstTitle={firstTitle}
        firstContent={firstContent}
        secondTitle={secondTitle}
        secondContent={secondContent}
        helperText={helperText}
        helperTextType={helperTextType}
        isAccount={isAccount}
        icon={Icon}
      />
    );
  },
};
