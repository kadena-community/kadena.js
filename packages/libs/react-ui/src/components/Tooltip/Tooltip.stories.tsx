import { IconButton, SystemIcon } from '..';

import { container } from './stories.css';
import { ITooltipProps, Tooltip } from './Tooltip';
import { tooltipHandler } from './tooltipHandler';

import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef } from 'react';

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
    placement: {
      options: ['top', 'bottom', 'left', 'right'],
      control: {
        type: 'select',
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
    placement: 'right',
  },
  render: ({ text, placement }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
      <div className={container}>
        <IconButton
          title="hover me"
          icon={SystemIcon.Information}
          onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
            tooltipHandler(e, ref)
          }
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
            tooltipHandler(e, ref)
          }
        />

        <Tooltip placement={placement} ref={ref}>
          {text}
        </Tooltip>
      </div>
    );
  },
};
