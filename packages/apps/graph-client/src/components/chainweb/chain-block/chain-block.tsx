import { IBlock } from '../../../utils/hooks/use-parsed-blocks';
import { Box } from '../../box';
import { Text } from '../../text';

import { TimeTicker } from './../time-ticker';
import { Container, Content } from './styles';

import { RocketIcon, TimerIcon } from '@radix-ui/react-icons';
import React from 'react';

interface IChainBlockProps {
  color: string;
  block?: IBlock;
  textColor: string;
}

export const ChainBlock = (props: IChainBlockProps): JSX.Element => {
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
            {/* {block.transactions.totalCount > 0 && (
              <>
                <RocketIcon />
                <Text as="span">{block.transactions.totalCount} txs</Text>
              </>
            )} */}
          </Box>
        </Content>
      ) : null}
    </Container>
  );
};
