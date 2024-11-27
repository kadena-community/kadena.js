import { MonoAdd } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, Stack } from './../../components';
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
          'The card can have multiple sections, a title and content section',
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
    variant: {
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
    <Button variant="outlined" endVisual={<MonoAdd />}>
      add
    </Button>
  );
};

export const Primary: Story = {
  name: 'SectionCard default',
  args: {
    title: 'Our section',
    description: <>Our section is awesome</>,
    actions: <Actions />,
    children: 'This is the content for our section',
  },
  render: ({ variant, title, description, children, actions }) => {
    return (
      <Stack width="100%" padding="lg">
        <SectionCard variant={variant}>
          <SectionCardContentBlock>
            <SectionCardBody>{children}</SectionCardBody>
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
