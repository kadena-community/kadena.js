import { MonoCheck, MonoClear } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getVariants } from '../../storyDecorators/getVariants';
import type { IStepProps } from './Step';
import { Step } from './Step';

import { Button } from '../Button';
import { Stack } from '../Layout';
import { Stepper } from './Stepper';
import { stepClass } from './Stepper.css';

const { status } = getVariants(stepClass);

const meta: Meta<IStepProps> = {
  title: 'Components/Stepper',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component: 'A component can show the steps through a process',
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: status,
    },
  },
};

export default meta;

type Story = StoryObj<IStepProps>;

export const Primary: Story = {
  name: 'Stepper',
  args: {
    status: 'valid',
  },
  render: (args) => {
    const [step, setStep] = React.useState(1);

    const handlePrevious = () => {
      if (step > 0) {
        setStep((prev) => prev - 1);
      }
    };

    const handleNext = () => {
      if (step < 3) {
        setStep((prev) => prev + 1);
      }
    };

    return (
      <Stack gap="md" flexDirection="column" marginBlockStart="n40">
        <Stepper {...args} showSuccess>
          <Step
            active={step === 0}
            icon={<MonoCheck />}
            onClick={() => alert('1')}
          >
            Prince Adam
          </Step>
          <Step
            active={step === 1}
            status={args.status}
            icon={args.status === 'error' ? <MonoClear /> : <MonoCheck />}
          >
            Power Sword
          </Step>
          <Step active={step === 2}>He-man</Step>
          <Step active={step === 3}>Master of the Universe</Step>
        </Stepper>
        <Stack justifyContent="space-between" width="100%">
          <Button onPress={handlePrevious}>previous</Button>
          <Button onPress={handleNext}>next</Button>
        </Stack>
      </Stack>
    );
  },
};

export const Horizontal: Story = {
  name: 'Stepper Horizontal',
  args: {
    status: 'valid',
  },
  render: (args) => {
    const [step, setStep] = React.useState(1);

    const handlePrevious = () => {
      if (step > 0) {
        setStep((prev) => prev - 1);
      }
    };

    const handleNext = () => {
      if (step < 3) {
        setStep((prev) => prev + 1);
      }
    };

    return (
      <Stack gap="md" flexDirection="column" marginBlockStart="n40">
        <Stepper {...args} direction="horizontal" showSuccess>
          <Step active={step === 0} icon={<MonoCheck />}>
            Prince Adam
          </Step>
          <Step
            active={step === 1}
            status={args.status}
            icon={args.status === 'error' ? <MonoClear /> : <MonoCheck />}
          >
            Power Sword
          </Step>
          <Step active={step === 2}>He-man</Step>
          <Step active={step === 3}>Master of the Universe</Step>
        </Stepper>
        <Stack justifyContent="space-between" width="100%">
          <Button onPress={handlePrevious}>previous</Button>
          <Button onPress={handleNext}>next</Button>
        </Stack>
      </Stack>
    );
  },
};

export const Error: Story = {
  name: 'Stepper ends in error',
  args: {},
  render: (args) => {
    const [step, setStep] = React.useState(1);

    const handlePrevious = () => {
      if (step > 0) {
        setStep((prev) => prev - 1);
      }
    };

    const handleNext = () => {
      if (step < 3) {
        setStep((prev) => prev + 1);
      }
    };

    return (
      <Stack gap="md" flexDirection="column" marginBlockStart="n40">
        <Stepper {...args} direction="horizontal" showSuccess>
          <Step active={step === 0} icon={<MonoCheck />}>
            Prince Adam
          </Step>
          <Step active={step === 1}>Power Sword</Step>
          <Step active={step === 2}>He-man</Step>
          <Step status="error" active={step === 3}>
            Master of the Universe
          </Step>
        </Stepper>
        <Stack justifyContent="space-between" width="100%">
          <Button onPress={handlePrevious}>previous</Button>
          <Button onPress={handleNext}>next</Button>
        </Stack>
      </Stack>
    );
  },
};

export const NoActive: Story = {
  name: 'Stepper no active',
  args: {
    status: 'valid',
  },
  render: (args) => {
    return (
      <Stepper {...args} direction="vertical">
        <Step active icon={<MonoCheck />}>
          Prince Adam
        </Step>
        <Step
          status="inactive"
          icon={args.status === 'error' ? <MonoClear /> : <MonoCheck />}
        >
          Power Sword
        </Step>
        <Step status="inactive">He-man</Step>
        <Step status="inactive">Master of the Universe</Step>
      </Stepper>
    );
  },
};
