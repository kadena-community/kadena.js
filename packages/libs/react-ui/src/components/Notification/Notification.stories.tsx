import { SystemIcon } from '@components/Icon';
import type { INotificationRootProps } from '@components/Notification';
import { Notification } from '@components/Notification';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { colorVariants, displayVariants } from './Notification.css';

type StoryType = {
  heading: string;
} & INotificationRootProps;

const meta: Meta<StoryType> = {
  title: 'Components/Notification',
  parameters: {
    status: {
      type: ['inDevelopment'],
    },
    docs: {
      description: {
        component:
          'The Notification component renders a notification with an icon, heading, body, and action buttons. This component is used to announce dynamic changes in the content of a live region by asserting a discreet alert or notification. The appropriate role should be used to ensure that assistive technologies announce these dynamic changes. In the case where a user wants to use the Notification component purely for visual purposes, the role can be set to `none`.',
      },
    },
  },
  argTypes: {
    styleVariant: {
      description:
        'The Notification component has bordered and borderless variants. The borderless variant is used for notifications that located within a card or content body, while the bordered variant can be used in all other cases. ',
      options: Object.keys(displayVariants),
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'bordered' },
      },
    },
    color: {
      options: Object.keys(colorVariants),
      control: {
        type: 'select',
      },
    },
    hasCloseButton: {
      control: {
        type: 'boolean',
      },
    },
    children: {
      control: {
        type: 'text',
      },
    },
    role: {
      description:
        "The Notification component has a role attribute that can be set to 'alert', 'status', or 'none'.",
      options: ['alert', 'status', 'none'],
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'status' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryType>;

export const Primary: Story = {
  name: 'Notification',
  args: {
    heading: 'Notification Heading',
    hasCloseButton: true,
    color: undefined,
    children:
      'Notification children to inform users about the event that occurred!',
    styleVariant: 'bordered',
  },
  render: ({ heading, hasCloseButton, color, children, styleVariant }) => {
    return (
      <Notification.Root
        color={color}
        hasCloseButton={hasCloseButton}
        onClose={() => {
          alert('Close button clicked');
        }}
        styleVariant={styleVariant}
        role="none"
      >
        <Notification.Heading>{heading}</Notification.Heading>
        {children}
        <Notification.Actions>
          <Notification.Button icon="Check" color="positive">
            Accept
          </Notification.Button>
          <Notification.Button icon="Close" color="negative">
            Reject
          </Notification.Button>
        </Notification.Actions>
      </Notification.Root>
    );
  },
};
