import { Button } from '@components/Button';
import type { ITagProps } from '@components/Tag';
import { Tag } from '@components/Tag';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<
  {
    hasClose: boolean;
    text: string;
  } & ITagProps
> = {
  title: 'Components/Tag',
  parameters: {
    docs: {
      description: {
        component:
          'The Tag component renders a tag with a text. This tag can be dismissed by the user by clicking the X icon when the optional `onClose` prop is provided.',
      },
    },
  },
  component: Tag,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
    },
    hasClose: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    text: string;
    hasClose: boolean;
  } & ITagProps
>;

export const Primary: Story = {
  name: 'Tag',
  args: {
    text: 'Chain:1',
    hasClose: true,
  },
  render: ({ text, hasClose }) => {
    const [closed, setClosed] = useState(false);

    if (closed) return <Button onClick={() => setClosed(false)}>Reset</Button>;
    return (
      <Tag onClose={hasClose ? () => setClosed(true) : undefined}>{text}</Tag>
    );
  },
};
