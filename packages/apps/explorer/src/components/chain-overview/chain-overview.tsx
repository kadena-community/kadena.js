import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import Chain from './chain';
import { chainOverviewClass } from './styles.css';

const CHAINSCOUNT = 20;

interface IProps {
  onHover: (chainId: number) => void;
}

const ChainOverview: FC<IProps> = ({ onHover }) => {
  return (
    <section>
      <Stack width="100%" as="ul" className={chainOverviewClass}>
        {Array.from(Array(CHAINSCOUNT).keys()).map((chainId, idx) => (
          <Chain key={idx} chainId={chainId} onHover={onHover} />
        ))}
      </Stack>
    </section>
  );
};

export default ChainOverview;
