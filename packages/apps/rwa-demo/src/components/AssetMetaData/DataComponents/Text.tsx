import { Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { ITextNode } from '../types';

export const TextData: FC<{ node: ITextNode }> = ({ node }) => {
  return (
    <Stack id={node.id} data-type={node.type} data-propname={node.propName}>
      <Heading as="h6">{node.label}:</Heading>
      <Text variant="code">
        {node.shouldLocalizeFormat ? node.value.toLocaleString() : node.value}
      </Text>
    </Stack>
  );
};
