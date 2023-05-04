import { SystemIcons } from './../../';
import { NotificationColors } from './styles';
import { INotificationProps, Notification } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcons;
    text: string;
  } & INotificationProps
> = {
  title: 'Notification',
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
    description: {
      control: {
        type: 'text',
      },
    },
    color: {
      options: NotificationColors,
      control: {
        type: 'select',
      },
    },
    displayCloseButton: {
      control: {
        type: 'boolean',
      },
    },
    expand: {
      control: {
        type: 'boolean',
      },
    },

    displayActionButton: {
      control: {
        type: 'boolean',
      },
    },

    actionButtonOnClick: { action: 'clicked' },

    actionButtonLabel: {
      control: {
        type: 'text',
      },
    },

    /*
    disabled: {
      control: {
        type: 'boolean',
      },
    },*/
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
    selectIcon: 'Account',
    title: 'Notification title',
    description:
      'Notification text to inform users about the event that occurred!',
    displayCloseButton: true,
    expand: false,
    displayActionButton: true,
    actionButtonLabel: 'Action label',
    color: 'default',
  },
  render: ({
    selectIcon,
    actionButtonLabel,
    displayActionButton,
    title,
    description,
    displayCloseButton,
    expand,
    color,
  }) => {
    const Icon = SystemIcons[selectIcon];

    return (
      <>
        <Notification
          icon={Icon}
          color={color}
          title={title}
          description={description}
          displayCloseButton={displayCloseButton}
          expand={expand}
          displayActionButton={displayActionButton}
          actionButtonLabel={actionButtonLabel}
        />
      </>
    );
  },
};
