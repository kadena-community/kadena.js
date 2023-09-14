import type { ITooltipProps } from './';
import { container } from './stories.css';
import { Tooltip } from './';

import { IconButton } from '@components/IconButton';
import type { Meta, StoryObj } from '@storybook/react';
import { withCenteredStory } from '@utils/withCenteredStory';
import React, { useRef } from 'react';

const meta: Meta<
  {
    text: string;
  } & ITooltipProps
> = {
  title: 'Components/Tooltip',
  component: Tooltip.Root,
  decorators: [withCenteredStory],
  parameters: {
    docs: {
      description: {
        component:
          'The Tooltip component renders a tooltip with text. The placement of the tooltip can be set with the `placement` prop. The tooltip can be triggered by hovering over the `IconButton` component.',
      },
    },
  },
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
