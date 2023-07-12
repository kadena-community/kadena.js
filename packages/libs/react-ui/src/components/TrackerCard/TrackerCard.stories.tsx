import { ILabelValue, ITrackerCardProps, TrackerCard } from './TrackerCard';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SystemIcon } from '../Icons';
import { layoutVariant } from './TrackerCard.css';

const meta: Meta<ITrackerCardProps> = {
  title: 'Components/TrackerCard',
  argTypes: {
    variant: {
      options: Object.keys(layoutVariant) as (keyof typeof layoutVariant)[],
      control: {
        type: 'select',
      },
    },
    labelValue: {
      control: {
        type: 'object',
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

const labelValues: ILabelValue[] = [
  {
    label: 'Account',
    value: 'k:1234567890abcdef',
    isAccount: true,
  },
  {
    label: 'Balance',
    value: '1000',
  },
  {
    label: 'Debt',
    value: '6000',
  },
];

export const Primary: Story = {
  name: 'TrackerCard',
  args: {
    labelValue: labelValues,
    helperText: 'This is a helper text',
    helperTextType: 'mild',
    icon: undefined,
    variant: 'vertical',
  },
  render: ({ labelValue, helperText, helperTextType, icon: Icon, variant }) => {
    return (
      <TrackerCard
        variant={variant}
        labelValue={labelValue}
        helperText={helperText}
        helperTextType={helperTextType}
        icon={Icon}
      />
    );
  },
};
