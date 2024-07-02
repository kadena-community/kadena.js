import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Stack } from '../Layout';
import type { ITextLinkProps } from './TextLink';
import { TextLink } from './TextLink';

const meta: Meta<ITextLinkProps> = {
  title: 'Components/TextLink',
  parameters: {
    status: { type: 'releaseCandidate' },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'The Link component renders an anchor which will be styled according to the variant prop.',
      },
    },
  },
  argTypes: {
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    isCompact: {
      description: 'compact button link style',
      control: {
        type: 'boolean',
      },
    },
    href: {
      description: 'url to be redirected',
      control: {
        type: 'text',
      },
    },
    withIcon: {
      description: 'optionally show a link icon',
      control: {
        type: 'boolean',
      },
    },
  },
};

type TextLinkStory = StoryObj<ITextLinkProps>;

export const _Base: TextLinkStory = {
  args: {
    children: 'Hello world',
  },
  render: (props: ITextLinkProps) => {
    return <TextLink {...props}>{props.children}</TextLink>;
  },
};

export const AllOptions: TextLinkStory = {
  args: {
    children: 'Hello world',
  },
  render: (props: ITextLinkProps) => {
    return (
      <Stack flexDirection={'column'}>
        <TextLink {...props}>{props.children}</TextLink>{' '}
        <TextLink {...props} isCompact={true}>
          {props.children}
        </TextLink>
        <TextLink {...props} withIcon>
          {props.children}
        </TextLink>
      </Stack>
    );
  },
};

export default meta;
