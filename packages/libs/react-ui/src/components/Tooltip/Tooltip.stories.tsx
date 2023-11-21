import { Button } from '@components/Button';
import { SystemIcon } from '@components/Icon';
import { Box, Stack } from '@components/Layout';
import type { ITooltipProps } from '@components/Tooltip';
import { Tooltip } from '@components/Tooltip';
import type { Meta, StoryObj } from '@storybook/react';
import { withCenteredStory } from '@utils/withCenteredStory';
import React from 'react';

const meta: Meta<ITooltipProps> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  decorators: [withCenteredStory],
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component:
          'The Tooltip component renders a tooltip with content when the user hovers or focuses the element passed as children.',
      },
    },
  },
  argTypes: {
    content: {
      description:
        'The content that will be rendered inside the tooltip. This can be a string or a ReactNode.',
      control: {
        type: 'text',
      },
    },
    position: {
      description:
        'The position of the tooltip relative to the element that triggers it.',
      table: {
        defaultValue: { summary: 'right' },
      },
    },
    delay: {
      description:
        'The delay in milliseconds before the tooltip is shown when the user hovers or focuses the element.',
      table: {
        defaultValue: { summary: 500 },
      },
    },
    closeDelay: {
      description:
        'The delay in milliseconds before the tooltip is hidden when the user stops hovering or focusing the element.',
      table: {
        defaultValue: { summary: 300 },
      },
    },
    isDisabled: {
      description: 'Disables the tooltip when set to true.',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ITooltipProps>;

export const Dynamic: Story = {
  name: 'Tooltip with Text',
  args: {
    content: "I'm a tooltip, look at me!",
    position: 'right',
    isDisabled: false,
    delay: 500,
    closeDelay: 300,
  },
  render: ({ content, position, isDisabled, delay, closeDelay }) => {
    return (
      <Box margin="$25">
        <Tooltip
          content={content}
          position={position}
          isDisabled={isDisabled}
          delay={delay}
          closeDelay={closeDelay}
        >
          <Button>Trigger</Button>
        </Tooltip>
      </Box>
    );
  },
};

export const TooltipReactNode: Story = {
  name: 'Tooltip with components',
  args: {
    position: 'right',
    isDisabled: false,
    delay: 500,
    closeDelay: 300,
  },
  render: ({ position, isDisabled, delay, closeDelay }) => {
    return (
      <Box margin="$25">
        <Tooltip
          position={position}
          isDisabled={isDisabled}
          delay={delay}
          closeDelay={closeDelay}
          content={
            <Stack direction="row" gap="$xs" alignItems="center">
              <SystemIcon.AlertBox />
              <code>I have an icon!</code>
            </Stack>
          }
        >
          <Button>Trigger</Button>
        </Tooltip>
      </Box>
    );
  },
};
