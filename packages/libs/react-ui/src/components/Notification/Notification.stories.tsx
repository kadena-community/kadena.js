import { Button, SystemIcon } from './../../';
import { colorVariants } from './Notification.css';
import { INotificationProps, Notification } from '.';

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
    color: {
      options: [
        'default',
        ...(Object.keys(colorVariants) as (keyof typeof colorVariants)[]),
      ],
      control: {
        type: 'select',
      },
    },
    expanded: {
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
    expanded: false,
    color: undefined,
  },
  render: ({
    selectIcon,
    title,
    displayCloseButton: displayCloseButton,
    expanded: expand,
    color,
    simplified: simple,
  }) => {
    const icon = SystemIcon[selectIcon];
    return (
      <Notification.Container
        icon={icon}
        simplified={simple}
        expanded={expand}
        color={color}
        title={title}
        displayCloseButton={displayCloseButton}
      >
        Notification text to inform users about the event that occurred!
        <Notification.Footer>
          <Button title="click-me">Click me!</Button>
        </Notification.Footer>
      </Notification.Container>
    );
  },
};

export const Simplified: Story = {
  name: 'Notification - Simplified',
  args: {
    selectIcon: 'Information',
    expanded: false,
    color: undefined,
  },
  render: ({ selectIcon, expanded: expand, color }) => {
    const icon = SystemIcon[selectIcon];
    return (
      <Notification.Container
        icon={icon}
        simplified={true}
        expanded={expand}
        color={color}
      >
        Notification text to inform users about the event that occurred!
      </Notification.Container>
    );
  },
};

export const Header: Story = {
  name: 'Notification - Header',
  args: {
    selectIcon: 'Information',
    title: 'Notification with a header!',
    displayCloseButton: true,
    expanded: false,
    color: undefined,
  },
  render: ({
    selectIcon,
    title,
    displayCloseButton: displayCloseButton,
    expanded: expand,
    color,
    simplified: simple,
  }) => {
    const icon = SystemIcon[selectIcon];

    return (
      <Notification.Container
        icon={icon}
        simplified={simple}
        expanded={expand}
        color={color}
        title={title}
        displayCloseButton={displayCloseButton}
      >
        <Notification.Header>
          <SystemIcon.Link size="md" />
        </Notification.Header>
        Notification text to inform users about the event that occurred!
        <Notification.Footer>
          <Button title="click-me">Click me!</Button>
        </Notification.Footer>
      </Notification.Container>
    );
  },
};
