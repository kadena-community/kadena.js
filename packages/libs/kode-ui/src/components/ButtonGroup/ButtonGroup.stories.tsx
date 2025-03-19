import { MonoChevronLeft, MonoMoreVert } from '@kadena/kode-icons';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Button, ContextMenu, ContextMenuItem, Link, Stack } from '..';
import { getVariants } from '../../storyDecorators/getVariants';
import { button } from '../Button/Button.css';
import type { IButtonGroupProps } from './ButtonGroup';
import { ButtonGroup } from './ButtonGroup';

const variants = getVariants(button);

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
    isCompact: true,
  },
  render: (props: IButtonGroupProps) => {
    return (
      <Stack gap="lg" flexDirection="column">
        <ButtonGroup {...props}>
          <Button>option1</Button>
          <Button endVisual={<MonoChevronLeft />}>option2</Button>
          <Button endVisual={<MonoMoreVert />} />
        </ButtonGroup>
        <ButtonGroup {...props}>
          <Link isCompact variant="outlined">
            option1
          </Link>
          <a>
            <Button isCompact variant="outlined">
              option2
            </Button>
          </a>
          <ContextMenu
            trigger={
              <Button
                variant="outlined"
                isCompact
                endVisual={<MonoMoreVert />}
              />
            }
          >
            <ContextMenuItem onClick={() => {}} label="Recover your wallet" />
          </ContextMenu>
        </ButtonGroup>

        <ButtonGroup {...props}>
          <Button
            variant="outlined"
            isCompact
            startVisual={<MonoChevronLeft />}
          >
            option2
          </Button>

          <ContextMenu
            trigger={
              <Button
                variant="outlined"
                isCompact
                endVisual={<MonoMoreVert />}
              />
            }
          >
            <ContextMenuItem onClick={() => {}} label="Recover your wallet" />
          </ContextMenu>
        </ButtonGroup>
      </Stack>
    );
  },
};

export default meta;
