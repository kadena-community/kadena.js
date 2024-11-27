import { MonoAdd } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, Stack, Text } from './../../components';
import type { ISectionCardProps } from './SectionCard';
import { SectionCard } from './SectionCard';
import type { ISectionCardBodyProps } from './SectionCardBody';
import { SectionCardBody } from './SectionCardBody';
import { SectionCardContentBlock } from './SectionCardContentBlock';
import type { ISectionCardHeaderProps } from './SectionCardHeader';
import { SectionCardHeader } from './SectionCardHeader';

interface IProps
  extends ISectionCardHeaderProps,
    ISectionCardProps,
    ISectionCardBodyProps {}

const meta: Meta<IProps> = {
  title: 'Patterns/SectionCard',
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The card can have multiple sections, a title and content section. `Buttons` in the actions prop have to be compact variants',
      },
    },
  },
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      description: 'Card Title',
    },
    description: {
      description: 'Card description',
      control: {
        type: 'text',
      },
    },
    position: {
      options: ['horizontal', 'vertical'],
      control: {
        type: 'select',
      },
    },
    children: {
      control: {
        type: 'text',
      },
      description: 'The main content for the card',
    },
  },
};

export default meta;
type Story = StoryObj<IProps>;

const Actions = () => {
  return (
    <Button variant="outlined" isCompact endVisual={<MonoAdd />}>
      add
    </Button>
  );
};

export const Primary: Story = {
  name: 'SectionCard basecard',
  args: {
    title: 'Our section',
    description: <>Our section is awesome</>,
    actions: <Actions />,
    children: 'This is the content for our section',
  },
  render: ({ position, title, description, children, actions }) => {
    return (
      <Stack width="100%" padding="lg">
        <SectionCard position={position}>
          <SectionCardContentBlock>
            <SectionCardBody
              title="Content title"
              description="small description"
            >
              {children}
            </SectionCardBody>
            <SectionCardHeader
              title={title}
              description={description}
              actions={actions}
            />
            <div>sdfsdf</div>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    );
  },
};

export const main: Story = {
  name: 'SectionCard mainCard',
  args: {
    title: 'Our section',
    description: <>Our section is awesome</>,
    actions: <Actions />,
    children: 'This is the content for our section',
  },
  render: ({ position, title, description, children, actions }) => {
    return (
      <Stack width="100%" padding="lg">
        <SectionCard position={position} variant="main">
          <SectionCardContentBlock>
            <SectionCardBody
              title="Content title"
              description="small description"
            >
              {children}
              <Text>this is content</Text>
              <Text>this is content</Text>
              <Text>this is content</Text>
              <Text>this is content</Text>
              <Text>this is content</Text>
            </SectionCardBody>
            <SectionCardHeader
              title={title}
              description={description}
              actions={actions}
            />
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    );
  },
};
