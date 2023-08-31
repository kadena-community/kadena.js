import { ProductIcon } from '../Icon';

import {
  type ILabelValue,
  type ITrackerCardProps,
  TrackerCard,
} from './TrackerCard';
import { layoutVariant } from './TrackerCard.css';

import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{ icon: keyof typeof ProductIcon } & ITrackerCardProps> = {
  title: 'Components/TrackerCard',
  argTypes: {
    variant: {
      options: Object.keys(layoutVariant) as (keyof typeof layoutVariant)[],
      control: {
        type: 'select',
      },
    },
    labelValues: {
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
      },
      options: ['mild', 'severe'],
    },
    icon: {
      options: [
        undefined,
        ...(Object.keys(ProductIcon) as (keyof typeof ProductIcon)[]),
      ],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;

type Story = StoryObj<{ icon: keyof typeof ProductIcon } & ITrackerCardProps>;

const labelValues: ILabelValue[] = [
  {
    label: 'Account Label',
    value: 'k:1234567890abcdef',
    isAccount: true,
  },
  {
    label: 'Balance',
    value: '1000',
  },
  {
    label: 'Transfer',
    value: '25',
  },
];

export const Primary: Story = {
  name: 'TrackerCard',
  args: {
    labelValues: labelValues,
    helperText: 'This is a helper text',
    helperTextType: 'mild',
    icon: 'QuickStart',
    variant: 'vertical',
  },
  render: ({ labelValues, helperText, helperTextType, icon, variant }) => {
    return (
      <TrackerCard
        variant={variant}
        labelValues={labelValues}
        helperText={helperText}
        helperTextType={helperTextType}
        icon={icon}
      />
    );
  },
};
