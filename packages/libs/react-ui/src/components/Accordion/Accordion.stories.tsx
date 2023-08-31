import type { IAccordionProps, IAccordionSectionProps } from './';
import { Accordion } from './';

import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

const generateSection = (i: number): IAccordionSectionProps => ({
  title: `Section title ${i}`,
  children: (
    <p>
      This is the content for section {i}. The type of this content is not
      restricted: any valid HTML content is allowed.
    </p>
  ),
  onOpen: () => console.log(`open section ${i}`),
  onClose: () => console.log(`close section ${i}`),
});
const generateSections = (n: number): IAccordionSectionProps[] =>
  Array.from({ length: n }, (d, i) => generateSection(i + 1));

const sampleSections: IAccordionSectionProps[] = generateSections(5);

type StoryProps = {
  sectionCount: number;
  linked: boolean;
  useCustomSections: boolean;
  customSections: IAccordionSectionProps[];
} & IAccordionProps;

const meta: Meta<StoryProps> = {
  title: 'Components/Accordion',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Accordion component allows the user to show and hide sections of content on a page.<br />These sections can be expanded and collapsed by clicking the section headers.<br /><br /><strong>initialOpenSection</strong><br />This optional prop can be used on the Root element to set the initially opened section<br /><em>It defaults to `undefined` and has only been explcitly set to - 1 in the story code for demonstration purposes.</em><br /><br /><em>Note: this variant of the Accordion component is meant to be used to display content. For Navigation purposes, please check the other variant within the Navigation subgroup.</em>',
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
    sectionCount: {
      control: { type: 'range', min: 1, max: sampleSections.length, step: 1 },
      description: 'Adjust sample section items count',
      if: { arg: 'useCustomContent', neq: true },
      table: {
        defaultValue: { summary: 3 },
        type: { summary: 'number' },
      },
    },
    useCustomSections: {
      control: { type: 'boolean' },
      description: 'Define your own sections instead of the sample ones?',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    customSections: {
      defaultValue: [],
      description: 'Custom sections',
      control: {
        type: 'array',
      },
      if: { arg: 'useCustomSections', eq: true },
    },
  },
};

type IStory = StoryObj<StoryProps>;

export const Dynamic: IStory = {
  name: 'Accordion',
  args: {
    linked: false,
    sectionCount: 3,
    customSections: sampleSections,
  },
  render: ({ linked, sectionCount, useCustomSections, customSections }) => {
    const sections = useCustomSections ? customSections : sampleSections;
    return (
      <Accordion.Root linked={linked} initialOpenSection={-1}>
        {sections
          .slice(0, sectionCount)
          .map(
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
