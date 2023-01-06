import { Block } from '../../__generated__/sdk';
import { keyframes, styled } from '../../styles/stitches.config';
import { Box } from '../box';
import { Text } from '../text';

import { TimeTicker } from './time-ticker';

import { RocketIcon, TimerIcon } from '@radix-ui/react-icons';
import React from 'react';

const Container: any = styled('div', {
  borderRadius: '$md',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  m: '$1',

  // NOTE: Needs to be updated to be responsive
  height: '$blockWidth',
  width: '$blockWidth',
  border: '1px solid $mauve7',
});

const BlockEntrance: any = keyframes({
  '0%': {
    transform: 'scale(0)',
    animationTimingFunction: 'ease-in',
  },
  '70%': {
    transform: 'scale(1.1)',
    animationTimingFunction: 'ease-in',
  },
  '100%': {
    transform: 'scale(1)',
    animationTimingFunction: 'ease-out',
  },
});

const Content: any = styled('div', {
  zIndex: 2,
  animation: `${BlockEntrance} 0.4s`,
  height: '$blockWidth',
  width: '$blockWidth',
  background: '$$color',
  borderRadius: '$md',
  display: 'flex',
  alignItems: 'center',
  px: '$2',
  py: '$1',
});

interface IChainBlockProps {
  color: string;
  block?: Block;
  textColor: string;
}

export function ChainBlock(props: IChainBlockProps): JSX.Element {
  const { color, textColor, block } = props;

  return (
    <Container>
      {block ? (
        <Content css={{ $$color: color, $$textColor: textColor }}>
          <Box
            css={{
              fontSize: '$xs',
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr)',
              gridColumnGap: '$1',
              alignItems: 'center',
              gridRowGap: 0,
              color: '$$textColor',
              svg: {
                width: '0.7rem',
                height: '0.7rem',
              },
            }}
          >
            <TimerIcon />
            <TimeTicker date={new Date(block.creationtime)} />
            {block.transactions.totalCount > 0 && (
              <>
                <RocketIcon />
                <Text as="span">{block.transactions.totalCount} txs</Text>
              </>
            )}
          </Box>
        </Content>
      ) : null}
    </Container>
  );
}
