import BlockActivityChart from '@/components/block-activity-graph/block-activity-graph';
import { headerColumnStyle } from '@/components/block-table/block-header/block-header.css';
import {
  blockGridStyle,
  blockWrapperClass,
} from '@/components/block-table/block-table.css';
import { Grid, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import LoadingPill from '../loading-pill';

const LoadingSkeletonBlockTable: FC = () => {
  const array = Array.from(Array(11), (x, i) => i);
  console.log(array);
  return (
    <>
      <Stack
        display="flex"
        flexDirection={'column'}
        paddingInline={{ xs: 'xs', md: 'lg' }}
        width="100%"
      >
        <Grid className={classNames(blockGridStyle, blockWrapperClass)}>
          <Stack className={headerColumnStyle} style={{ height: '60px' }}>
            <LoadingPill />
          </Stack>
          <Stack className={headerColumnStyle}>
            <LoadingPill />
          </Stack>
          <Stack className={headerColumnStyle}>
            <LoadingPill />
          </Stack>
          <Stack className={headerColumnStyle}>
            <LoadingPill />
          </Stack>
          <Stack className={headerColumnStyle}>
            <LoadingPill />
          </Stack>
          <Stack className={headerColumnStyle}>
            <LoadingPill />
          </Stack>
          <Stack className={headerColumnStyle}>
            <LoadingPill />
          </Stack>
        </Grid>
      </Stack>

      <Stack
        display="flex"
        flexDirection={'column'}
        gap={'sm'}
        paddingInline={{ xs: 'xs', md: 'lg' }}
        width="100%"
      >
        {array.map((i) => (
          <Grid
            key={i}
            className={classNames(blockGridStyle, blockWrapperClass)}
          >
            <Stack className={headerColumnStyle} style={{ height: '52px' }}>
              {i}
            </Stack>
            <Stack className={headerColumnStyle}>
              <LoadingPill />
            </Stack>
            <Stack className={headerColumnStyle}>
              <LoadingPill />
            </Stack>
            <Stack className={headerColumnStyle}>
              <LoadingPill />
            </Stack>
            <Stack className={headerColumnStyle}>
              <LoadingPill />
            </Stack>
            <Stack className={headerColumnStyle}>
              <LoadingPill />
            </Stack>
            <Stack className={headerColumnStyle}>
              <BlockActivityChart
                maxBlockTxCount={50}
                data={[
                  { height: 2, data: 0 },
                  { height: 2, data: 0 },
                  { height: 2, data: 0 },
                  { height: 2, data: 0 },
                ]}
              />
            </Stack>
          </Grid>
        ))}
      </Stack>
    </>
  );
};

export default LoadingSkeletonBlockTable;
