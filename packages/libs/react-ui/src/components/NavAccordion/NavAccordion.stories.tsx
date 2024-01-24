import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { atoms } from '../../styles/atoms.css';
import type { INavAccordionProps, INavAccordionSectionProps } from './';
import { NavAccordion } from './';

type StoryProps = {
  customSections: INavAccordionSectionProps[];
  darkMode: boolean;
  linked: boolean;
} & INavAccordionProps;

const meta: Meta<StoryProps> = {
  title: 'Navigation/NavAccordion',
  parameters: {
    status: {
      type: ['deprecated'],
    },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The NavAccordion component allows the user to show and hide sections of navigational lists on a page that are grouped together.<br /><br />These sections can be expanded and collapsed by clicking the section headers.<br /><br />The component consists of four sub components:<br /><strong><NavAccordion.Root></strong> as the parent container<br /><strong><NavAccordion.Section></strong> for each navigational section (collapsable)<br /><strong><NavAccordion.Group></strong> to create sub sections (lists) that group related navigational links (collapsable)<br /><strong><NavAccordion.Link></strong> to create links that can be used to navigate<br /><br /><em>Note: in times when you need to use a different `Link` component (like next/link in Next.js), you can pass the `asChild` prop to the NavAccordion.Link component to pass on styles, icons, and additional props.</em><br /><br /><em>Note: this variant of the Accordion component is meant to be used to display content.<br />For content purposes, please use the <strong>Accordion</strong> within the Layout subgroup.</em>',
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
    darkMode: {
      control: { type: 'boolean' },
      description:
        'By default, the component switches colors in dark/light mode. This prop allows you to override that behavior and always show dark mode.',
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
    darkMode: false,
  },
  render: ({ linked, darkMode }) => {
    return (
      <div className={atoms({ width: '100%' })}>
        <NavAccordion.Root linked={linked} darkMode={darkMode}>
          <NavAccordion.Section
            title="Developers"
            onClose={() =>
              console.log('optional section onClose handler example')
            }
            onOpen={() =>
              console.log('optional section onOpen handler example')
            }
          >
            <NavAccordion.Group
              title="Guides"
              onClose={() =>
                console.log('optional group onClose handler example')
              }
              onOpen={() =>
                console.log('optional group onOpen handler example')
              }
            >
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
            <NavAccordion.Link asChild>
              <a href="https://kadena.io/" rel="noreferrer" target="_blank">
                Kadena.io (asChild)
              </a>
            </NavAccordion.Link>
          </NavAccordion.Section>
          <NavAccordion.Link href="https://docs.kadena.io/">
            Documentation
          </NavAccordion.Link>
        </NavAccordion.Root>
      </div>
    );
  },
};

export default meta;
