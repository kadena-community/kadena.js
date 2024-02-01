import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Item } from 'react-stately';

import type { IAccordionProps } from './Accordion';
import { Accordion } from './Accordion';

const meta: Meta<IAccordionProps> = {
  title: 'Layout/Accordion',
  parameters: {
    status: {
      type: 'inDevelopment',
    },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Accordion component allows the user to show and hide sections of content on a page.<br />These sections can be expanded and collapsed by clicking the section headers.<br /><br /><em>Note: this variant of the Accordion component is meant to be used to display content.<br />For Navigation purposes, please use the <strong>NavAccordion</strong> within the Navigation subgroup.</em>',
      },
    },
  },
  argTypes: {
    selectionMode: {
      description: 'The selection mode for the Accordion component.',
      defaultValue: 'single',
      control: {
        type: 'select',
        options: ['single', 'multiple', 'none'],
      },
    },
  },
};

type Story = StoryObj<IAccordionProps>;
export const Dynamic: Story = {
  name: 'Accordion',
  render: ({ selectionMode = 'single' }) => {
    return (
      <Accordion selectionMode={selectionMode}>
        <Item key="files" title="Your files">
          <p>Files</p>
        </Item>
        <Item key="shared" title="Shared with you">
          <p>Shared</p>
        </Item>
        <Item key="last" title="Last item">
          <p>Last</p>
        </Item>
      </Accordion>
    );
  },
};

export default meta;
