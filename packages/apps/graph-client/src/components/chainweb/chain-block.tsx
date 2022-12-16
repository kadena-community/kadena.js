import { keyframes, styled } from '../../styles/stitches.config';

import React from 'react';

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
  p: '$2',
  fontSize: '$xs',
});

interface IChainBlockProps {
  color: string;
  numTransactions?: number;
  mined: boolean;
}

export function ChainBlock(props: IChainBlockProps): JSX.Element {
  const { color, mined } = props;
  return (
    <Container>
      {mined && <Content css={{ $$color: color }}>{` `}</Content>}
    </Container>
  );
}
