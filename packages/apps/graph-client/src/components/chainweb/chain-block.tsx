import { Block } from '../../__generated__/sdk';
import { keyframes, styled } from '../../styles/stitches.config';
import { Box } from '../box';
import { Text } from '../text';

import { Link2Icon, RocketIcon, TimerIcon } from '@radix-ui/react-icons';
import React from 'react';

const TEMP_NUM = 2;

const Container: any = styled('div', {
  borderRadius: '$md',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  m: '$1',

  // Update to be responsive
  height: '$blockWidth',
  width: '$blockWidth',
  border: '1px solid $mauve7',

  // '&::before': {
  //   content: '',
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: '0.75rem',
  //   height: '0.75rem',
  //   borderRadius: '$md',
  //   background: '$mauve3',
  // },
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
  numTransactions?: number;
  block?: Block;
  textColor: string;
}

export function ChainBlock(props: IChainBlockProps): JSX.Element {
  const { color, textColor, block } = props;

  return (
    <Container>
      {block && (
        <Content css={{ $$color: color, $$textColor: textColor }}>
          <Box
            css={{
              fontSize: '$xs',
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr)',
              gridColumnGap: '$1',
              alignItems: 'center',
              // justifyItems: 'center',
              gridRowGap: 0,
              color: '$$textColor',
              svg: {
                width: '0.7rem',
                height: '0.7rem',
              },
            }}
          >
            <TimerIcon />
            <Text
              as="span"
              css={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {new Date() - new Date(block.creationtime)} s
            </Text>
            <RocketIcon />
            <Text as="span">{TEMP_NUM} txs</Text>
          </Box>
        </Content>
      )}
    </Container>
  );
}
