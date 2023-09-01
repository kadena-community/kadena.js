import { Button, SystemIcons } from './../../';
import { colorVariant } from './styles';
import {
  type INotificationProps,
  Notification,
  NotificationBody,
  NotificationFooter,
} from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcons;
    text: string;
  } & INotificationProps
> = {
  title: 'Layout/Notification',
  argTypes: {
    selectIcon: {
      options: Object.keys(SystemIcons) as (keyof typeof SystemIcons)[],
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
      options: Object.keys(colorVariant) as (keyof typeof colorVariant)[],
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
    selectIcon: keyof typeof SystemIcons;
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
    color: 'default',
    simple: false,
  },
  render: ({
    selectIcon,
    title,
    displayCloseButton,
    expand,
    color,
    simple,
  }) => {
    const Icon = SystemIcons[selectIcon];
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
    );
  },
};
