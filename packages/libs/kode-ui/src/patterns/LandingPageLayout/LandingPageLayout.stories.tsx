import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LandingPageLayout } from './LandingPageLayout';
import { FooterContent } from './components/Footer/FooterContent';
import { LayoutProvider } from './components/LayoutProvider';

interface IProps {}

const meta: Meta<IProps> = {
  title: 'Patterns/LandingPage Layout',
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The landing page extends the FocussedLayout, but only has 1 card and a footer',
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<IProps>;

export const Primary: Story = {
  name: 'LandingPage Layout',
  args: {
    title: 'Our section',
    description: <>Our section is awesome</>,
    children: 'This is the content for our section',
  },
  render: () => {
    return (
      <LayoutProvider>
        <FooterContent>EXTRA CONTENT</FooterContent>
        <LandingPageLayout
          title="He-man"
          description={<>Masters of the universe</>}
        >
          Main content here
        </LandingPageLayout>
      </LayoutProvider>
    );
  },
};
