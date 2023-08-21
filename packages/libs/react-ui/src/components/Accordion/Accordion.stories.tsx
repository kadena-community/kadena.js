import type { IAccordionProps, IAccordionSectionProps } from './';
import { Accordion } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const generateSection = (i: number): IAccordionSectionProps => ({
  title: <span>Section {i}</span>,
  children: <p>This is the content for section {i}</p>,
  onOpen: () => console.log(`open section ${i}`),
  onClose: () => console.log(`close section ${i}`),
});
const generateSections = (n: number): IAccordionSectionProps[] =>
  Array.from({ length: n }, (d, i) => generateSection(i + 1));

const sampleSections: IAccordionSectionProps[] = generateSections(5);

type StoryProps = { sectionCount: number; linked: boolean } & IAccordionProps;

const meta: Meta<StoryProps> = {
  title: 'Components/Accordion',
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
    },
    sectionCount: {
      control: { type: 'range', min: 1, max: sampleSections.length, step: 1 },
      description: 'Adjust sample section items count',
    },
  },
};

type IStory = StoryObj<StoryProps>;

export const Dynamic: IStory = {
  name: 'Accordion',
  args: {
    linked: false,
    sectionCount: 3,
  },
  render: ({ linked, sectionCount }) => {
    return (
      <Accordion.Root linked={linked}>
        {sampleSections
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
