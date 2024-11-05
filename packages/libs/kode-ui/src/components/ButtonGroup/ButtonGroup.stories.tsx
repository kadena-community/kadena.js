import { MonoChevronLeft, MonoChevronRight } from '@kadena/kode-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Avatar, Badge, Button, Link, Stack } from '..';
import { getVariants } from '../../storyDecorators/getVariants';
import { Box } from '../Layout/Box/Box';
import type { IButtonGroupProps } from './ButtonGroup';
import { ButtonGroup } from './ButtonGroup';
import { buttonGroupRecipe } from './ButtonGroup.css';

const variants = getVariants(buttonGroupRecipe);

const meta: Meta<IButtonGroupProps> = {
  title: 'Components/ButtonGroup',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The ButtonGroup is a component that will group a set of buttons (some small style changes on the buttons). ',
      },
    },
  },
  argTypes: {
    onPress: {
      action: 'clicked',
      description: 'callback when button is clicked',
      table: {
        disable: true,
      },
    },
    variant: {
      options: variants.variant,
      control: {
        type: 'select',
      },
      description: 'button style variant',
    },
    isCompact: {
      description: 'compact button style',
      control: {
        type: 'boolean',
      },
    },
  },
};

type ButtonGroupStory = StoryObj<IButtonGroupProps>;

export const Primary: ButtonGroupStory = {
  args: {
    variant: 'primary',
    onPress: () => undefined,
  },
  render: (props: IButtonGroupProps) => {
    return (
      <Stack gap="lg" flexDirection="column">
        <ButtonGroup {...props}>
          <Button>option1</Button>
          <Button>option2</Button>
          <Button endVisual={<MonoChevronLeft />} />
        </ButtonGroup>
        <ButtonGroup {...props}>
          <Link>option1</Link>
          <Link>option2</Link>
          <Link endVisual={<MonoChevronLeft />} />
        </ButtonGroup>
      </Stack>
    );
  },
};

export default meta;
