import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getVariants } from '../../../../storyDecorators/getVariants';
import { button } from '../../../Button/Button.css';
import { Button, Stack } from './../../..';
import type { ISuccessCircleProps } from './SuccessCircle';
import { SuccessCircle } from './SuccessCircle';

const variants = getVariants(button);

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
  argTypes: {
    variant: {
      options: variants.variant,
      control: {
        type: 'select',
      },
      description: 'button style variant',
    },
  },
};

export default meta;
type Story = StoryObj<ISuccessCircleProps>;

export const Primary: Story = {
  name: 'Success Amimation',
  args: {
    variant: 'primary',
  },

  render: (props) => {
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
          <SuccessCircle {...props} play={play} size={20} />
        </Stack>
        <Button onClick={() => setPlay(!play)} variant="primary">
          Play animation
        </Button>
      </>
    );
  },
};
