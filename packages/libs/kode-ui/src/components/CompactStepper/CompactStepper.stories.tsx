import {
  MonoArrowBack,
  MonoArrowForward,
  MonoCheck,
} from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { withContentWidth } from '../../storyDecorators';
import { iconControl } from '../../storyDecorators/iconControl';
import { Button } from '../Button';
import { Stack } from '../Layout';
import type { ICompactStepperProps } from './CompactStepper';
import { CompactStepper } from './CompactStepper';

const meta: Meta<ICompactStepperProps> = {
  title: 'Components/CompactStepper',
  decorators: [withContentWidth],
  parameters: {
    status: { type: 'experimental' },
    docs: {
      description: {
        component:
          'The CompactStepper is a component that can show the steps in a process. Like the StepperComponent, just smaller',
      },
    },
  },
  argTypes: {
    endVisual: iconControl,
    showLabel: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ICompactStepperProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Compact Stepper',
  args: {
    endVisual: <MonoCheck color="green" />,
    showLabel: true,
  },

  render: ({ endVisual, showLabel }) => {
    const [idx, setIdx] = useState(0);
    const steps = [
      {
        label: 'Orko',
        id: 'orko',
      },
      {
        label: 'Skeletor',
        id: 'skeletor',
      },
      {
        label: 'He-man',
        id: 'heman',
      },
      {
        label: 'Master of the Universe',
        id: 'masteroftheuniverse',
      },
    ];

    const handlePrev = () => {
      setIdx((val) => {
        return val - 1 < 0 ? 0 : val - 1;
      });
    };
    const handleNext = () => {
      setIdx((val) => {
        return val + 1 > steps.length - 1 ? steps.length : val + 1;
      });
    };

    return (
      <Stack flexDirection="column" gap="xl">
        <CompactStepper
          endVisual={idx === 1 ? endVisual : undefined}
          showLabel={showLabel}
          steps={steps}
          stepIdx={idx}
        />

        <Stack width="100%" justifyContent="space-between">
          <Button
            isDisabled={idx - 1 < 0}
            onPress={handlePrev}
            startVisual={<MonoArrowBack />}
          />
          <Button
            isDisabled={idx >= steps.length - 1}
            onPress={handleNext}
            startVisual={<MonoArrowForward />}
          />
        </Stack>
      </Stack>
    );
  },
};
