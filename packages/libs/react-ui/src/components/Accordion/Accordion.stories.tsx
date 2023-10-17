import type { IAccordionProps, IAccordionSectionProps } from './';
import { Accordion } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const generateSection = (i: number): IAccordionSectionProps => ({
  title: `Section title ${i}`,
  children: (
    <p>
      This is the content for section {i}.<br />
      The type of this content is not restricted: any valid HTML content is
      allowed.
    </p>
  ),
  onOpen: () => console.log(`open section ${i}`),
  onClose: () => console.log(`close section ${i}`),
});
const generateSections = (n: number): IAccordionSectionProps[] =>
  Array.from({ length: n }, (d, i) => generateSection(i + 1));

const sampleCount: number = 3;
const sampleSections: IAccordionSectionProps[] = generateSections(sampleCount);

type StoryProps = {
  linked: boolean;
  customSections: IAccordionSectionProps[];
} & IAccordionProps;

const meta: Meta<StoryProps> = {
  title: 'Layout/Accordion',
  parameters: {
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
  name: 'Accordion',
  args: {
    linked: false,
  },
  render: ({ linked }) => {
    const sections = sampleSections;
    return (
      <Accordion.Root linked={linked}>
        {sections.map(
          (
            { title, children, onOpen, onClose }: IAccordionSectionProps,
            index,
          ) => (
            <Accordion.Section
              onOpen={onOpen}
              onClose={onClose}
              title={title}
              key={index}
            >
              {children}
            </Accordion.Section>
          ),
        )}
      </Accordion.Root>
    );
  },
};

export default meta;
