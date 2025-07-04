import { MonoCheck, MonoClose } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getVariants, withContentWidth } from '../../storyDecorators';
import type { INotificationProps } from '../Notification';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
} from '../Notification';
import { contentClassRecipe, notificationRecipe } from './Notification.css';

const notificationVariants = getVariants(notificationRecipe);
const contentVariants = getVariants(contentClassRecipe);

type StoryType = {
  heading: string;
} & INotificationProps;

const meta: Meta<StoryType> = {
  title: 'Components/Notification',
  decorators: [withContentWidth],
  parameters: {
    status: {
      type: ['stable'],
    },
    docs: {
      description: {
        component:
          'The Notification component renders a notification with an icon, heading, body, and action buttons. This component is used to announce dynamic changes in the content of a live region by asserting a discreet alert or notification. The appropriate role should be used to ensure that assistive technologies announce these dynamic changes. In the case where a user wants to use the Notification component purely for visual purposes, the role can be set to `none`.',
      },
    },
  },
  argTypes: {
    intent: {
      options: notificationVariants.intent,
      control: {
        type: 'select',
      },
      description: 'Notification intent color',
      table: {
        type: { summary: notificationVariants.intent.join(' | ') },
        defaultValue: { summary: 'default' },
      },
    },
    type: {
      options: contentVariants.type,
      control: {
        type: 'select',
      },
      description: 'way of presenting the content of the notification',
      table: {
        type: { summary: contentVariants.type.join(' | ') },
        defaultValue: { summary: 'default' },
      },
    },
    isDismissable: {
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
    isDismissable: true,
    intent: undefined,
    children:
      'Notification children to inform users about the event that occurred!',
  },
  render: ({ heading, isDismissable, intent, children, type }) => {
    return (
      <Notification
        intent={intent}
        type={type}
        isDismissable={isDismissable}
        onDismiss={() => {
          alert('Close button clicked');
        }}
        role="none"
      >
        <NotificationHeading>{heading}</NotificationHeading>
        {children}
        <NotificationFooter>
          <NotificationButton
            intent="positive"
            icon={<MonoCheck />}
            onClick={() => alert('Accept clicked')}
          >
            Accept
          </NotificationButton>
          <NotificationButton
            intent="negative"
            icon={<MonoClose />}
            onClick={() => alert('Accept clicked')}
          >
            Reject
          </NotificationButton>
        </NotificationFooter>
      </Notification>
    );
  },
};

export const MaxWidth: Story = {
  name: 'MaxWidth Content',
  args: {
    isDismissable: true,
    intent: undefined,
  },
  render: ({ heading, isDismissable, intent, children, type }) => {
    return (
      <Notification
        intent={intent}
        type="inlineStacked"
        isDismissable={isDismissable}
        onDismiss={() => {
          alert('Close button clicked');
        }}
        role="none"
        contentMaxWidth={300}
      >
        <NotificationHeading>Content is centered</NotificationHeading>
        When you have a fullWidth notification, but you want to have a maxWidth
        of the content
        <NotificationFooter>
          <NotificationButton intent="positive" icon={<MonoCheck />}>
            Accept
          </NotificationButton>
          <NotificationButton intent="negative" icon={<MonoClose />}>
            Reject
          </NotificationButton>
        </NotificationFooter>
      </Notification>
    );
  },
};
