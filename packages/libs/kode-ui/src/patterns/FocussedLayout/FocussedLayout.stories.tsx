import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '../SectionCard';
import { FocussedLayout } from './FocussedLayout';
import { HeaderAside } from './components/Header/HeaderAside';
import { HeaderContent } from './components/Header/HeaderContent';
import { LayoutProvider } from './components/LayoutProvider';

interface IProps {}

const meta: Meta<IProps> = {
  title: 'Patterns/Focussed Layout',
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The card can have multiple sections, a title and content section. `Buttons` in the actions prop have to be compact variants',
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<IProps>;

export const Primary: Story = {
  name: 'Foccused Layout with 1 card',
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
                <>Skeletor</>
              </SectionCardBody>
              <SectionCardHeader title="Greyskull" />
            </SectionCardContentBlock>
          </SectionCard>
        </FocussedLayout>
      </LayoutProvider>
    );
  },
};
