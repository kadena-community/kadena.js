import { Button } from '@components/Button';
import { SystemIcon } from '@components/Icon';
import { Stack } from '@components/Layout';
import type { ITooltipProps } from '@components/Tooltip';
import { Tooltip } from '@components/Tooltip';
import { onLayer1 } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import { atoms } from '@theme/atoms.css';
import React from 'react';

const meta: Meta<ITooltipProps> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  decorators: [onLayer1],
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
    isOpen: {
      description: 'Allows the user to control the open state of the tooltip.',
      table: {
        defaultValue: { summary: false },
      },
    },
    defaultOpen: {
      description: 'Sets the initial open state of the tooltip.',
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
      <Tooltip
        content={content}
        position={position}
        isDisabled={isDisabled}
        delay={delay}
        closeDelay={closeDelay}
      >
        <Button>Trigger</Button>
      </Tooltip>
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
      <Tooltip
        position={position}
        isDisabled={isDisabled}
        delay={delay}
        closeDelay={closeDelay}
        content={
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <SystemIcon.AlertBox />
            <code>I have an icon!</code>
          </Stack>
        }
      >
        <Button>Trigger</Button>
      </Tooltip>
    );
  },
};

export const DefaultOpen: Story = {
  name: 'Tooltip that is set to defaultOpen',
  args: {
    content: "I'm a tooltip, look at me!",
    position: 'right',
    isDisabled: false,
    delay: 500,
    closeDelay: 300,
  },
  render: ({ content, position, isDisabled, delay, closeDelay }) => {
    return (
      <Tooltip
        content={content}
        position={position}
        isDisabled={isDisabled}
        delay={delay}
        closeDelay={closeDelay}
        defaultOpen={true}
      >
        <Button>Trigger</Button>
      </Tooltip>
    );
  },
};

export const Controlled: Story = {
  name: 'Tooltip that is controlled by a button',
  args: {
    content: "I'm a tooltip, look at me!",
    position: 'right',
    isDisabled: false,
    delay: 500,
    closeDelay: 300,
  },
  render: ({ content, position, isDisabled, delay, closeDelay }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <>
        <div className={atoms({ marginBlockEnd: 'xxxl' })}>
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Hide Tooltip' : 'Show Tooltip'}
          </Button>
        </div>
        <Tooltip
          content={content}
          position={position}
          isDisabled={isDisabled}
          delay={delay}
          closeDelay={closeDelay}
          isOpen={isOpen}
        >
          <SystemIcon.AlertBox />
        </Tooltip>
      </>
    );
  },
};
