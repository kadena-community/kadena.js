import { Accordion } from './Accordion';

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

// eslint-disable-next-line @kadena-dev/typedef-var
const sections = [
  { title: 'Section 1', children: 'Section 1 content' },
  { title: 'Section 2', children: 'Section 2 content' },
  { title: 'Section 3', children: 'Section 3 content' },
];

describe('Accordion', () => {
  test('renders the correct number of sections', () => {
    const { getAllByTestId } = render(<Accordion sections={sections} />);
    const sectionElements = getAllByTestId('kda-accordion-title');
    expect(sectionElements.length).toBe(sections.length);
  });

  test('opens a linked section when clicked and closes others', () => {
    const { getAllByTestId } = render(
      <Accordion sections={sections} linked={true} />,
    );

    const sectionTitles = Array.from(getAllByTestId('kda-accordion-title'));

    fireEvent.click(sectionTitles[0]); // Open Section 1
    fireEvent.click(sectionTitles[1]); // Close section 1 and Open Section 2

    expect(sectionTitles[0].querySelector('[role="button"]')).not.toHaveClass(
      'isOpen',
    );
    expect(sectionTitles[1].querySelector('[role="button"]')).toHaveClass(
      'isOpen',
    );
    expect(sectionTitles[2].querySelector('[role="button"]')).not.toHaveClass(
      'isOpen',
    );
  });

  test('allows multiple unlinked sections to be open at the same time', () => {
    const { getAllByTestId } = render(
      <Accordion sections={sections} linked={false} />,
    );

    const sectionTitles = Array.from(getAllByTestId('kda-accordion-title'));

    fireEvent.click(sectionTitles[0]); // Open Section 1
    fireEvent.click(sectionTitles[2]); // Open Section 3

    expect(sectionTitles[0].querySelector('[role="button"]')).toHaveClass(
      'isOpen',
    );
    expect(sectionTitles[1].querySelector('[role="button"]')).not.toHaveClass(
      'isOpen',
    );
    expect(sectionTitles[2].querySelector('[role="button"]')).toHaveClass(
      'isOpen',
    );
  });
});
