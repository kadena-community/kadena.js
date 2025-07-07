import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, Stack } from './../../..';
import type { ISuccessCircleProps } from './SuccessCircle';
import { SuccessCircle } from './SuccessCircle';

const meta: Meta<ISuccessCircleProps> = {
  title: 'Icons/AnimatedIcons/SuccessCircle',
  parameters: {
    status: { type: 'experimental' },
    docs: {
      description: {
        component:
          'SuccessCircle is a component that displays a success icon with animation.',
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<ISuccessCircleProps>;

export const Primary: Story = {
  name: 'Success Amimation',
  args: {},

  render: () => {
    const [play, setPlay] = React.useState(false);
    return (
      <>
        <Stack
          flexDirection="column"
          gap="md"
          width="100%"
          justifyContent="center"
          alignItems="center"
          style={{
            height: '300px',
          }}
        >
          <Stack
            position="relative"
            justifyContent="center"
            alignItems="center"
            style={{ width: '20px', height: '20px', backgroundColor: 'black' }}
          >
            <SuccessCircle play={play} size={20} />
          </Stack>
        </Stack>
        <Button onClick={() => setPlay(!play)} variant="primary">
          Play animation
        </Button>
      </>
    );
  },
};
