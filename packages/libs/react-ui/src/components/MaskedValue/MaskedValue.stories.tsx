import { type IMaskedValueProps, MaskedValue } from './MaskedValue';

import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IMaskedValueProps> = {
  title: 'Components/MaskedValue',
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
    },
    value: {
      control: {
        type: 'text',
      },
    },
    defaultVisibility: {
      control: {
        type: 'boolean',
      },
    },
    startUnmaskedValues: {
      control: {
        type: 'number',
      },
    },
    endUnmaskedValues: {
      control: {
        type: 'number',
      },
    },
  },
};

export default meta;

type Story = StoryObj<IMaskedValueProps>;

export const Primary: Story = {
  name: 'MaskedValue',
  args: {
    title: 'Account',
    value: 'k:1234567890abcdef',
    defaultVisibility: false,
    startUnmaskedValues: 6,
    endUnmaskedValues: 4,
  },
  render: ({
    title,
    value,
    defaultVisibility,
    startUnmaskedValues,
    endUnmaskedValues,
  }) => {
    return (
      <>
        <MaskedValue
          title={title}
          value={value}
          defaultVisibility={defaultVisibility}
          startUnmaskedValues={startUnmaskedValues}
          endUnmaskedValues={endUnmaskedValues}
        />
      </>
    );
  },
};
