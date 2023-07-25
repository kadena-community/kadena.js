import { ProductIcon } from '../Icons';

import { ILabelValue, ITrackerCardProps, TrackerCard } from './TrackerCard';
import { layoutVariant } from './TrackerCard.css';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{ selectIcon: keyof typeof ProductIcon } & ITrackerCardProps> =
  {
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
        },
        options: ['mild', 'severe'],
      },
      selectIcon: {
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

type Story = StoryObj<
  { selectIcon: keyof typeof ProductIcon } & ITrackerCardProps
>;

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
    selectIcon: 'QuickStart',
    variant: 'vertical',
  },
  render: ({ labelValue, helperText, helperTextType, selectIcon, variant }) => {
    const icon = ProductIcon[selectIcon];
    return (
      <TrackerCard
        variant={variant}
        labelValue={labelValue}
        helperText={helperText}
        helperTextType={helperTextType}
        icon={icon}
      />
    );
  },
};
