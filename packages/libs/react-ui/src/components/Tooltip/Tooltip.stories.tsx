import { Button } from '@components/Button';
import { Box } from '@components/Layout';
import type { Meta, StoryObj } from '@storybook/react';
import { withCenteredStory } from '@utils/withCenteredStory';
import React from 'react';
import type { ITooltipProps } from './Tooltip';
import { Tooltip } from './Tooltip';

const meta: Meta<ITooltipProps> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  decorators: [withCenteredStory],
  parameters: {
    status: {
      type: ['inDevelopment'],
    },
    docs: {
      description: {
        component:
          'The Tooltip component renders a tooltip with content when the user hovers or focuses the element passed as children. The placement of the tooltip can be set with the `position` prop.',
      },
    },
  },
  argTypes: {
    content: {
      control: {
        type: 'text',
      },
    },
    position: {
      table: {
        defaultValue: { summary: 'right' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ITooltipProps>;

export const Dynamic: Story = {
  name: 'Tooltip',
  args: {
    content: "I'm a tooltip, look at me!",
    position: 'right',
  },
  render: ({ content, position }) => {
    return (
      <Box margin="$40">
        <Tooltip content={content} position={position}>
          <Button>Trigger</Button>
        </Tooltip>
      </Box>
    );
  },
};
