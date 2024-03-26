import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { onLayer2 } from '../../storyDecorators';
import { StepList, StepListItem } from './StepList';

const options = [
  {
    key: 'details',
    value: 'Details',
  },
  {
    key: 'select-offers',
    value: 'Select offers',
  },
  {
    key: 'fallback-offer',
    value: 'Fallback offer',
  },
  {
    key: 'summary',
    value: 'Summary',
  },
];

const meta: Meta<typeof StepList> = {
  title: 'Components/StepList',
  component: StepList,
  decorators: [onLayer2],
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StepList>;

export const Primary: Story = {
  name: 'Default StepList',
  args: {
    isDisabled: false,
    orientation: 'horizontal',
  },
  render: ({ isDisabled, orientation }) => {
    return (
      <StepList
        isDisabled={isDisabled}
        orientation={orientation}
        selectedKey="select-offers"
      >
        {options.map((option) => (
          <StepListItem key={option.key}>{option.value}</StepListItem>
        ))}
      </StepList>
    );
  },
};
