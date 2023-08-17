import { ProductIcon } from '../Icon';

import type { ILabelValue, ITrackerCardProps } from './TrackerCard';
import { TrackerCard } from './TrackerCard';
import { layoutVariant } from './TrackerCard.css';

import type { Meta, StoryObj } from '@storybook/react';
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
    selectIcon: 'QuickStart',
    variant: 'vertical',
  },
  render: ({
    labelValues,
    helperText,
    helperTextType,
    selectIcon,
    variant,
  }) => {
    const icon = ProductIcon[selectIcon];
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
