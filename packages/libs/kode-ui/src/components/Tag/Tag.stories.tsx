import { MonoEditNote } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Stack } from '..';
import type { ITagGroupProps } from '../Tag';
import { Tag, TagGroup, TagItem } from '../Tag';

const meta: Meta<ITagGroupProps> = {
  title: 'Components/TagGroup',
  component: TagGroup,
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component:
          'The `TagGroup` component is an implementation of [useTabGroup from react-aria](https://react-spectrum.adobe.com/react-aria/useTagGroup.html). Currently we have enabled options to close or disable tags, but we have disabled features like selection since there has not yet been a need for them.\n\nThe compound component is composed of the exposed `TagGroup` and `TagItem` components, check the examples below to see how to use them.\n\n*Note: In most cases, you should use the `TagGroup` and `TagItem` component composition to ensure that the tags are accessible, however if you need only the tag component styles, you can use the `Tag` component to compose your own custom component.*',
      },
    },
  },
  argTypes: {
    label: {
      description: 'Label for the group. Accepts a string or a ReactNode.',
      control: {
        type: 'text',
      },
    },
    onRemove: {
      description: 'Callback when a tag is removed',
      control: {
        type: null,
      },
    },
    disabledKeys: {
      description: 'Keys of tags that are disabled',
      control: {
        type: null,
      },
    },
    className: {
      description: "Optional classnames to add to the tag's container",
      control: {
        type: null,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ITagGroupProps>;

const tags = [
  { id: '1', name: 'News' },
  { id: '2', name: 'Travel' },
  { id: '3', name: 'Gaming' },
  { id: '4', name: 'Shopping' },
];

export const Group: Story = {
  name: 'Group of tags',
  args: {
    label: undefined,
  },
  render: ({ label }) => {
    return (
      <TagGroup label={label}>
        {tags.map((item) => (
          <TagItem key={item.id}>{item.name}</TagItem>
        ))}
      </TagGroup>
    );
  },
};

export const Removable: Story = {
  name: 'Removable tags',
  render: () => {
    const [list, setList] = useState(tags);

    return (
      <TagGroup
        label="Filter Categories"
        onRemove={(keys) => {
          setList(list.filter((item) => !keys.has(item.id)));
        }}
      >
        {list.map((item) => (
          <TagItem key={item.id}>{item.name}</TagItem>
        ))}
      </TagGroup>
    );
  },
};

export const Disabled: Story = {
  name: 'Disabled tag',
  render: () => {
    const [list, setList] = useState(tags);

    return (
      <TagGroup
        label="Filter Categories"
        onRemove={(keys) => {
          setList(list.filter((item) => !keys.has(item.id)));
        }}
        disabledKeys={['2']}
      >
        {list.map((item) => (
          <TagItem key={item.id}>{item.name}</TagItem>
        ))}
      </TagGroup>
    );
  },
};

export const AsChild: Story = {
  name: 'Tag styles and props set on their child',
  render: () => {
    return (
      <TagGroup label="Kadena Resources" tagAsChild>
        <TagItem key="docs">
          <a href="https://docs.kadena.io/">Kadena Docs</a>
        </TagItem>
        <TagItem key="tools">
          <a href="https://tools.kadena.io/">Tools Website</a>
        </TagItem>
      </TagGroup>
    );
  },
};

export const TagComponent: Story = {
  name: 'Tag Styles Component',
  render: () => {
    return (
      <Tag>
        <Stack gap="xs" alignItems="center">
          Tag Styles
          <MonoEditNote />
        </Stack>
      </Tag>
    );
  },
};
