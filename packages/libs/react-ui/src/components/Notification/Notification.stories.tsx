import { colorVariants, displayVariants } from './Notification.css';

import { SystemIcon } from '@components/Icon';
import type { INotificationProps } from '@components/Notification';
import { Notification } from '@components/Notification';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    text: string;
  } & INotificationProps
> = {
  title: 'Components/Notification',
  parameters: {
    docs: {
      description: {
        component:
          'The Notification component renders a notification with an icon, title, and text. The color variant of the notification can be set with the `color` prop.',
      },
    },
  },
  argTypes: {
    variant: {
      options: Object.keys(displayVariants) as (keyof typeof displayVariants)[],
      control: {
        type: 'select',
      },
    },
    icon: {
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
      control: {
        type: 'select',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    color: {
      options: Object.keys(colorVariants),
      control: {
        type: 'select',
      },
    },
    expanded: {
      control: {
        type: 'boolean',
      },
    },
    hasCloseButton: {
      control: {
        type: 'boolean',
      },
    },
    inline: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    text: string;
  } & INotificationProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Notification',
  args: {
    icon: 'Information',
    title: 'Notification title',
    hasCloseButton: true,
    expanded: false,
    color: undefined,
    text: 'Notification text to inform users about the event that occurred!',
    variant: 'standard',
    inline: false,
  },
  render: ({
    icon,
    title,
    hasCloseButton,
    expanded,
    color,
    text,
    variant,
    inline,
  }) => {
    return (
      <Notification.Root
        icon={icon}
        expanded={expanded}
        color={color}
        title={title}
        hasCloseButton={hasCloseButton}
        onClose={() => {
          alert('Close button clicked');
        }}
        variant={variant}
        inline={inline}
      >
        {text}
        <Notification.Actions>
          <Notification.Button icon="Check" color={'positive'}>
            Accept
          </Notification.Button>
          <Notification.Button icon="Close" color={'negative'}>
            Reject
          </Notification.Button>
        </Notification.Actions>
      </Notification.Root>
    );
  },
};
