import { IconButton, SystemIcon } from '..';

import { ITooltipProps, Tooltip } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef } from 'react';

const meta: Meta<
  {
    text: string;
  } & ITooltipProps
> = {
  title: 'Components/Tooltip',
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
    const ref = useRef<HTMLDivElement>(null);

    return (
      <>
        <IconButton
          title="hover me"
          icon={SystemIcon.Information}
          onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
            Tooltip.handler(e, ref)
          }
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
            Tooltip.handler(e, ref)
          }
        />

        <Tooltip.Root ref={ref}>{text}</Tooltip.Root>
      </>
    );
  },
};
