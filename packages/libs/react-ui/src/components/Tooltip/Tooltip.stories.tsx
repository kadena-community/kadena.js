import { container } from './stories.css';
import { type ITooltipProps, Tooltip } from './';

import { IconButton } from '@components/IconButton';
import { type Meta, type StoryObj } from '@storybook/react';
import React, { useRef } from 'react';

const meta: Meta<
  {
    text: string;
  } & ITooltipProps
> = {
  title: 'Components/Tooltip',
  component: Tooltip.Root,
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
          icon="Information"
          onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
            Tooltip.handler(e, ref)
          }
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
            Tooltip.handler(e, ref)
          }
        />

        <Tooltip.Root placement={placement} ref={ref}>
          {text}
        </Tooltip.Root>
      </div>
    );
  },
};
