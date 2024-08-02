import { MonoNote } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Button, Stack } from '../../components';
import type { ICardContentBlockProps } from './CardContentBlock';
import { CardContentBlock } from './CardContentBlock';
import { CardFixedContainer } from './CardFixedContainer';
import { CardFooterGroup } from './CardFooterGroup';

const meta: Meta<ICardContentBlockProps> = {
  title: 'Patterns/Card Layout',
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The Card Layout Pattern is used in most cases when you use the `Card` component. It is comprised of the `CardContentBlock`, `CardFooterGroup`, and `CardFixedContainer`. The `CardFixedContainer` is used when you want to position the card in the center of the page as the primary content for a page. The `CardContentBlock` is used to layout the content of the card in stackable blocks. The `CardFooterGroup` component allows you to group items together in the footer and nest them if you need some items on the left and some on the right. These components are flexible so that you can configure them to fit your needs.',
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
      control: { type: 'text' },
    },
    visual: {
      description: 'An icon for the card',
    },
    extendedContent: {
      description:
        'Accented content that will be extended past the container of the card',
    },
    children: { description: 'The main content for the card' },
  },
};

export default meta;
type Story = StoryObj<ICardContentBlockProps>;

export const Primary: Story = {
  name: 'Card Pattern',
  args: {},
  render: ({}) => {
    return (
      <CardFixedContainer>
        <CardContentBlock
          title="Example Card Layout"
          description="This card layout is a pattern within the design system. The only mandatory properties are title and children, but many optional properties are available so that users can configure what they need."
          visual={<MonoNote width={36} height={36} />}
          extendedContent={
            <Box
              backgroundColor="semantic.warning.subtle"
              width="100%"
              padding="xxxl"
              style={{ aspectRatio: 1 }}
            />
          }
          supportingContent={
            <Box
              backgroundColor="brand.secondary.subtle"
              width="100%"
              paddingBlock="xxxl"
            />
          }
        >
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
        </CardContentBlock>
        <CardFooterGroup separated={true}>
          <Button variant="negative">Action</Button>
          <CardFooterGroup>
            <Button variant="outlined">Cancel</Button>
            <Button variant="primary">Next</Button>
          </CardFooterGroup>
        </CardFooterGroup>
      </CardFixedContainer>
    );
  },
};

export const SupportingContent: Story = {
  name: 'Supporting Content',
  args: {},
  render: ({}) => {
    return (
      <CardFixedContainer>
        <CardContentBlock
          title="Supporting Content"
          description="The blue section shows where the `supportingContent` is positioned. This allows users to provide additional content on the left side to support the main content like a stepper."
          visual={<MonoNote width={36} height={36} />}
          supportingContent={
            <Box
              backgroundColor="brand.secondary.subtle"
              width="100%"
              paddingBlock="xxxl"
            />
          }
        >
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
        </CardContentBlock>
        <CardFooterGroup separated={true}>
          <Button variant="negative">Action</Button>
          <CardFooterGroup>
            <Button variant="outlined">Cancel</Button>
            <Button variant="primary">Next</Button>
          </CardFooterGroup>
        </CardFooterGroup>
      </CardFixedContainer>
    );
  },
};

export const ExtendedContent: Story = {
  name: 'Card with Extended Content',
  args: {},
  render: ({}) => {
    return (
      <CardFixedContainer>
        <CardContentBlock
          title="Extended Content"
          description="This card contains `extendedContent` which is depicted using the yellow box. This is moved -50% vertically, but the main content will always follow with bottom of the `extendedContent` with consistent spacing."
          visual={<MonoNote width={36} height={36} />}
          extendedContent={
            <Box
              backgroundColor="semantic.warning.subtle"
              width="100%"
              padding="xxxl"
              style={{ aspectRatio: 1 }}
            />
          }
        >
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
        </CardContentBlock>
        <CardFooterGroup separated={true}>
          <Button variant="negative">Action</Button>
          <CardFooterGroup>
            <Button variant="outlined">Cancel</Button>
            <Button variant="primary">Next</Button>
          </CardFooterGroup>
        </CardFooterGroup>
      </CardFixedContainer>
    );
  },
};

export const NoVisual: Story = {
  name: 'Card Pattern with no `visual`',
  args: {},
  render: ({}) => {
    return (
      <CardFixedContainer>
        <CardContentBlock
          title="No Visual"
          description="This Card Layout doesn't include a `visual`. When a `visual` is not present, the main content will shift up slightly."
          supportingContent={
            <Box
              backgroundColor="brand.secondary.subtle"
              width="100%"
              paddingBlock="xxxl"
            />
          }
        >
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
        </CardContentBlock>
        <CardFooterGroup separated={true}>
          <Button variant="negative">Action</Button>
          <CardFooterGroup>
            <Button variant="outlined">Cancel</Button>
            <Button variant="primary">Next</Button>
          </CardFooterGroup>
        </CardFooterGroup>
      </CardFixedContainer>
    );
  },
};

export const CardWithStackedContent: Story = {
  name: 'Card Pattern with stacked content blocks',
  args: {},
  render: ({}) => {
    return (
      <CardFixedContainer>
        <CardContentBlock
          title="Leading Content Block"
          visual={<MonoNote width={36} height={36} />}
          description="This card displays two stacked content blocks. When two `CardContentBlocks` are siblings, the second will have additional marginBlockStart to provide more separation."
        >
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
        </CardContentBlock>
        <CardContentBlock
          title="Second Content Block"
          description="This second content block does not have a `visual`. When content blocks are stacked, only the first block will include a `visual`."
        >
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
          <Stack
            backgroundColor="brand.primary.subtle"
            padding="xl"
            marginBlockEnd="md"
          />
        </CardContentBlock>
        <CardFooterGroup separated={true}>
          <Button variant="negative">Action</Button>
          <CardFooterGroup>
            <Button variant="outlined">Cancel</Button>
            <Button variant="primary">Next</Button>
          </CardFooterGroup>
        </CardFooterGroup>
      </CardFixedContainer>
    );
  },
};
