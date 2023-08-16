import type { IAccordionRootProps, IAccordionSectionProps } from './';
import { Accordion } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const generateSection = (index: number): IAccordionSectionProps => ({
  title: <span>Section {index + 1}</span>,
  children: <p>This is the content for section {index + 1}</p>,
  onOpen: () => console.log(`open section ${index + 1}`),
  onClose: () => console.log(`close section ${index + 1}`),
});
const generateSections = (n: number): IAccordionSectionProps[] =>
  Array.from({ length: n }, (d, i) => generateSection(i));

const sampleSections: IAccordionSectionProps[] = generateSections(5);

type StoryProps = { sectionCount: number } & IAccordionRootProps;

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
        'Each section will close the other sections if they are linked',
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
