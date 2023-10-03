import type { INavAccordionProps, INavAccordionSectionProps } from './';
import { NavAccordion } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type StoryProps = {
  linked: boolean;
  customSections: INavAccordionSectionProps[];
} & INavAccordionProps;

const meta: Meta<StoryProps> = {
  title: 'Navigation/NavAccordion',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: '',
      },
    },
  },
  argTypes: {
    linked: {
      control: { type: 'boolean' },
      description:
        'When linked, only one section can be open at a time. If a section is opened, the previously opened section will be closed.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
};

type IStory = StoryObj<StoryProps>;

export const Dynamic: IStory = {
  name: 'NavAccordion',
  args: {
    linked: false,
  },
  render: ({ linked }) => {
    return (
      <NavAccordion.Root linked={linked} initialOpenSection={-1}>
        <NavAccordion.Section title="Developers">
          <NavAccordion.Group title="Guides">
            <NavAccordion.Link href="#pact">
              Pact Smart Contract
            </NavAccordion.Link>
            <NavAccordion.Link href="#marmalade">
              Marmalade Tutorial
            </NavAccordion.Link>
            <NavAccordion.Link href="#dapp-tutorial">
              Voting dApp Tutorial
            </NavAccordion.Link>
          </NavAccordion.Group>
          <NavAccordion.Link href="#get-involved">
            Getting Involved
          </NavAccordion.Link>
        </NavAccordion.Section>
        <NavAccordion.Section title="Support">
          <NavAccordion.Link href="#developer-program">
            Developer Program
          </NavAccordion.Link>
          <NavAccordion.Link href="#technical-grants">
            Technical Grants
          </NavAccordion.Link>
        </NavAccordion.Section>
      </NavAccordion.Root>
    );
  },
};

export default meta;
