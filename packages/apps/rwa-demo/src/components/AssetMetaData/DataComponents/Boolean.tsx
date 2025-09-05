import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { IBoolean } from '../types';

export const BooleanData: FC<{ node: IBoolean }> = ({ node }) => {
  return (
    <Stack id={node.id} data-type={node.type} data-propname={node.propName}>
      <Heading as="h6">{node.label}:</Heading>
    </Stack>
  );
};
