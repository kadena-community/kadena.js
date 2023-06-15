import { SystemIcon } from './../../';
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
      options: Object.keys(colorVariants) as (keyof typeof colorVariants)[],
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
    hasCloseButton: true,
    expanded: false,
    color: undefined,
  },
  render: ({ selectIcon, title, hasCloseButton, expanded, color }) => {
    const icon = SystemIcon[selectIcon];
    return (
      <Notification.Container
        icon={icon}
        expanded={expanded}
        color={color}
        title={title}
        hasCloseButton={hasCloseButton}
        onClose={() => {
          alert('Close button clicked');
        }}
      >
        Notification text to inform users about the event that occurred!
        <Notification.Actions>
          <Notification.Button icon={SystemIcon.Check} color={'positive'}>
            Accept
          </Notification.Button>
          <Notification.Button icon={SystemIcon.Close} color={'negative'}>
            Reject
          </Notification.Button>
        </Notification.Actions>
      </Notification.Container>
    );
  },
};
