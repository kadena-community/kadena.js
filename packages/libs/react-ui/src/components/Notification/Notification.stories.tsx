import { Button, SystemIcon } from './../../';
import { INotificationProps, Notification } from './Notification';
import { colorVariants } from './Notification.css';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    //selectIcon: string;
    text: string;
  } & INotificationProps
> = {
  title: 'Layout/Notification',
  argTypes: {
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
    //selectIcon: keyof typeof SystemIcons;
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
    icon: SystemIcon.Information,
    title: 'Notification title',
    displayCloseButton: true,
    expand: false,
    color: undefined,
    //simple: false,
  },
  render: ({
    icon,
    title,
    displayCloseButton: displayCloseButton,
    expand,
    color,
    simple,
  }) => {
    //const Icon = SystemIcons[selectIcon];
    /*
    return (
      <>
        <Notification
          simple={simple}
          icon={Icon}
          color={color}
          title={title}
          displayCloseButton={displayCloseButton}
          expand={expand}
        >
          <NotificationBody>
            Notification text to inform users about the event that occurred!
          </NotificationBody>
          <NotificationFooter>
            <Button title="Action label" icon={SystemIcons.TrailingIcon}>
              Action label
            </Button>
          </NotificationFooter>
        </Notification>
      </>
    );*/
    return (
      <Notification
        icon={icon}
        simple={simple}
        expand={expand}
        color={color}
        title={title}
        displayCloseButton={displayCloseButton}
        footer={<Button title="click-me">Click me!</Button>}
      >
        Notification text to inform users about the event that occurred!
      </Notification>
    );
  },
};

export const Header: Story = {
  name: 'Notification - Header',
  args: {
    icon: SystemIcon.Information,
    title: 'Notification with a header!',
    displayCloseButton: true,
    expand: false,
    color: undefined,
    //simple: false,
  },
  render: ({
    icon,
    title,
    displayCloseButton: displayCloseButton,
    expand,
    color,
    simple,
  }) => {
    //const Icon = SystemIcons[selectIcon];
    /*
    return (
      <>
        <Notification
          simple={simple}
          icon={Icon}
          color={color}
          title={title}
          displayCloseButton={displayCloseButton}
          expand={expand}
        >
          <NotificationBody>
            Notification text to inform users about the event that occurred!
          </NotificationBody>
          <NotificationFooter>
            <Button title="Action label" icon={SystemIcons.TrailingIcon}>
              Action label
            </Button>
          </NotificationFooter>
        </Notification>
      </>
    );*/
    return (
      <Notification
        icon={icon}
        simple={simple}
        expand={expand}
        color={color}
        title={title}
        displayCloseButton={displayCloseButton}
        footer={<Button title="click-me">Click me!</Button>}
        headerIcons={
          <>
            <SystemIcon.Link size="md" />
            <SystemIcon.Bell size="md" />
            <SystemIcon.EmailOutline size="md" />
            <SystemIcon.QrcodeScan size="md" />
          </>
        }
      >
        Notification text to inform users about the event that occurred!
      </Notification>
    );
  },
};
