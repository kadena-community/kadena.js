import { ITooltipProps, Tooltip } from './Tooltip';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    text: string;
  } & ITooltipProps
> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    text: string;
  } & ITooltipProps
>;

export const Dynamic: Story = {
  name: 'Tooltip',
  args: {
    text: "I'm a tooltip, look at me!",
  },
  render: ({ text }) => {
    return (
      <>
        <Tooltip>{text}</Tooltip>
      </>
    );
  },
};
