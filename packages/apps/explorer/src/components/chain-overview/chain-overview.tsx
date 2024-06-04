import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import Chain from './chain';
import { chainOverviewClass } from './styles.css';

const CHAINSCOUNT = 20;

const ChainOverview: FC = () => {
  return (
    <section>
      <Stack width="100%" as="ul" className={chainOverviewClass}>
        {Array.from(Array(CHAINSCOUNT).keys()).map((label, idx) => (
          <Chain key={idx} label={`${label}`} />
        ))}
      </Stack>
    </section>
  );
};

export default ChainOverview;
