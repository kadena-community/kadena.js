import { Accordion, IAccordionProps } from './Accordion';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{} & IAccordionProps> = {
  title: 'Components/Accordion',
  argTypes: {
    linked: {
      type: 'boolean',
      defaultValue: true,
      description:
        'Each section will close the other sections if they are linked',
      control: {
        type: 'boolean',
      },
    },
    sections: {
      defaultValue: [],
      description: 'Accordion children',
      control: {
        type: 'array',
      },
    },
  },
};

export default meta;
type Story = StoryObj<{} & IAccordionProps>;

export const Dynamic: Story = {
  name: 'Accordion',
  args: {
    linked: true,
    sections: [
      {
        title: <span>First Section</span>,
        children: <p>This is the content for the first section</p>,
      },
      {
        title: <span>Second Section</span>,
        children: <p>This is the content for the second section</p>,
      },
      {
        title: <span>Third Section</span>,
        children: <p>This is the content for the third section</p>,
      },
    ],
  },
  render: ({ linked, sections }) => {
    return <Accordion linked={Boolean(linked)} sections={sections} />;
  },
};
