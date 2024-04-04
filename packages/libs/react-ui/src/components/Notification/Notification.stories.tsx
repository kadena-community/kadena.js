import { MonoCheck, MonoClose } from '@kadena/react-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { withContentWidth } from '../../storyDecorators';
import type { INotificationProps } from '../Notification';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
} from '../Notification';
import { notificationRecipe } from './Notification.css';

// eslint-disable-next-line @kadena-dev/typedef-var
const intentVariants = Object.keys(
  (notificationRecipe as any).classNames?.variants?.intent,
) as INotificationProps['intent'][];

// eslint-disable-next-line @kadena-dev/typedef-var
const displayStyleVariant = Object.keys(
  (notificationRecipe as any).classNames?.variants?.displayStyle,
) as INotificationProps['displayStyle'][];

type StoryType = {
  heading: string;
} & INotificationProps;

const meta: Meta<StoryType> = {
  title: 'Components/Notification',
  decorators: [withContentWidth],
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component:
          'The Notification component renders a notification with an icon, heading, body, and action buttons. This component is used to announce dynamic changes in the content of a live region by asserting a discreet alert or notification. The appropriate role should be used to ensure that assistive technologies announce these dynamic changes. In the case where a user wants to use the Notification component purely for visual purposes, the role can be set to `none`.',
      },
    },
  },
  argTypes: {
    displayStyle: {
      options: displayStyleVariant,
      control: {
        type: 'select',
      },
      description:
        'The Notification component has bordered and borderless variants. The borderless variant is used for notifications that located within a card or content body, while the bordered variant can be used in all other cases. ',
      table: {
        type: { summary: displayStyleVariant.join(' | ') },
        defaultValue: { summary: 'default' },
      },
    },
    intent: {
      options: intentVariants,
      control: {
        type: 'select',
      },
      description: 'Notification intent color',
      table: {
        type: { summary: intentVariants.join(' | ') },
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
    displayStyle: 'bordered',
  },
  render: ({ heading, isDismissable, intent, children, displayStyle }) => {
    return (
      <Notification
        intent={intent}
        isDismissable={isDismissable}
        onDismiss={() => {
          alert('Close button clicked');
        }}
        displayStyle={displayStyle}
        role="none"
      >
        <NotificationHeading>{heading}</NotificationHeading>
        {children}
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
