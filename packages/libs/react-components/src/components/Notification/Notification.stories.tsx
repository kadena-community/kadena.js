import { Button, SystemIcons } from './../../';
import { colorVariant, simpleVariant } from './styles';
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
    simple: {
      options: Object.keys(simpleVariant) as (keyof typeof simpleVariant)[],
      control: {
        type: 'select',
      },
    },
    color: {
      options: Object.keys(colorVariant) as (keyof typeof colorVariant)[],
      control: {
        type: 'select',
      },
    },
    expand: {
      options: Object.keys(simpleVariant) as (keyof typeof simpleVariant)[],
      control: {
        type: 'select',
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
    selectIcon: 'Account',
    title: 'Notification title',
    description:
      'Notification text to inform users about the event that occurred!',
    displayCloseButton: true,
    expand: false,
    color: 'default',
    simple: false,
  },
  render: ({
    selectIcon,
    title,
    description,
    displayCloseButton,
    expand,
    color,
    simple,
  }) => {
    const Icon = SystemIcons[selectIcon];
    console.log({ color });
    return (
      <>
        <Notification
          simple={simple}
          icon={Icon}
          color={color}
          title={title}
          description={description}
          displayCloseButton={displayCloseButton}
          expand={expand}
          buttons={
            <Button title="Action label" icon={SystemIcons.TrailingIcon}>
              Action label
            </Button>
          }
        />
      </>
    );
  },
};
