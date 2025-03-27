import { MonoAccountTree } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useNotifications } from '../LayoutUtils';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '../SectionCard';
import { Button, Notification, NotificationHeading } from './../../components';
import { FocussedLayout } from './FocussedLayout';
import { Footer } from './components/Footer/Footer';
import { FooterContent } from './components/Footer/FooterContent';
import { HeaderAside } from './components/Header/HeaderAside';
import { HeaderContent } from './components/Header/HeaderContent';
import { LayoutProvider } from './components/LayoutProvider';
import { TopBanner } from './components/TopBanner/TopBanner';

interface IProps {}

const meta: Meta<IProps> = {
  title: 'Patterns/Focussed Layout',
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'This is a centered layout. The main purpose is to have a stack of Card components',
      },
    },
  },
  argTypes: {},
};

const AddNotificationButton = () => {
  const { addNotification } = useNotifications();

  return (
    <Button
      onPress={() => {
        addNotification({
          icon: <MonoAccountTree />,
          label: 'This is an error Notification',
          message: 'And this is the message',
          intent: 'negative',
        });
      }}
    >
      add notification
    </Button>
  );
};
export default meta;
type Story = StoryObj<IProps>;

export const Primary: Story = {
  name: 'Foccused Layout with multiple card',
  args: {
    title: 'Our section',
    description: <>Our section is awesome</>,
    children: 'This is the content for our section',
  },
  render: () => {
    return (
      <LayoutProvider>
        <HeaderContent>LEFT CONTENT</HeaderContent>
        <HeaderAside>RIGHT ASIDE</HeaderAside>
        <FocussedLayout>
          <SectionCard stack="horizontal" intent="info">
            <SectionCardContentBlock>
              <SectionCardBody>
                <>He-man!</>
              </SectionCardBody>
              <SectionCardHeader
                title="Masters of the Universe"
                description={<>I have the Power</>}
              />
            </SectionCardContentBlock>
          </SectionCard>

          <SectionCard stack="vertical" intent="negative">
            <SectionCardContentBlock>
              <SectionCardBody>
                <AddNotificationButton />
              </SectionCardBody>
              <SectionCardHeader title="Greyskull" />
            </SectionCardContentBlock>
          </SectionCard>
        </FocussedLayout>
      </LayoutProvider>
    );
  },
};

export const WithFooter: Story = {
  name: 'Foccused Layout with a footer',
  args: {
    title: 'Our section',
    description: <>Our section is awesome</>,
    children: 'This is the content for our section',
  },
  render: () => {
    return (
      <LayoutProvider>
        <HeaderContent>LEFT CONTENT</HeaderContent>
        <HeaderAside>RIGHT ASIDE</HeaderAside>
        <FocussedLayout>
          <SectionCard stack="horizontal" intent="info">
            <SectionCardContentBlock>
              <SectionCardBody>
                <>He-man!</>
              </SectionCardBody>
              <SectionCardHeader
                title="Masters of the Universe"
                description={<>I have the Power</>}
              />
            </SectionCardContentBlock>
          </SectionCard>
          <Footer>
            <FooterContent>FOOTERCONTENT</FooterContent>
          </Footer>
        </FocussedLayout>
      </LayoutProvider>
    );
  },
};
