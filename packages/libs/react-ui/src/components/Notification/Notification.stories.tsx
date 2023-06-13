import { Button, SystemIcon } from './../../';
import {
  INotificationProps,
  Notification,
  NotificationFooter,
  NotificationHeader,
} from './Notification';
import { colorVariants } from './Notification.css';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcon;
    text: string;
  } & INotificationProps
> = {
  title: 'Layout/Notification',
  argTypes: {
    selectIcon: {
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
    simple: {
      control: {
        type: 'boolean',
      },
    },
    color: {
      options: [
        'default',
        ...(Object.keys(colorVariants) as (keyof typeof colorVariants)[]),
      ],
      control: {
        type: 'select',
      },
    },
    expand: {
      control: {
        type: 'boolean',
      },
    },
    displayCloseButton: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    selectIcon: keyof typeof SystemIcon;
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
    selectIcon: 'Information',
    title: 'Notification title',
    displayCloseButton: true,
    expand: false,
    color: undefined,
  },
  render: ({
    selectIcon,
    title,
    displayCloseButton: displayCloseButton,
    expand,
    color,
    simple,
  }) => {
    const icon = SystemIcon[selectIcon];
    return (
      <Notification
        icon={icon}
        simple={simple}
        expand={expand}
        color={color}
        title={title}
        displayCloseButton={displayCloseButton}
      >
        Notification text to inform users about the event that occurred!
        <NotificationFooter>
          <Button title="click-me">Click me!</Button>
        </NotificationFooter>
      </Notification>
    );
  },
};

export const Header: Story = {
  name: 'Notification - Header',
  args: {
    selectIcon: 'Information',
    title: 'Notification with a header!',
    displayCloseButton: true,
    expand: false,
    color: undefined,
  },
  render: ({
    selectIcon,
    title,
    displayCloseButton: displayCloseButton,
    expand,
    color,
    simple,
  }) => {
    const icon = SystemIcon[selectIcon];

    return (
      <Notification
        icon={icon}
        simple={simple}
        expand={expand}
        color={color}
        title={title}
        displayCloseButton={displayCloseButton}
      >
        <NotificationHeader>
          <SystemIcon.Link size="md" />
        </NotificationHeader>
        Notification text to inform users about the event that occurred!
        <NotificationFooter>
          <Button title="click-me">Click me!</Button>
        </NotificationFooter>
      </Notification>
    );
  },
};
