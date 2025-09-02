import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { IKeyValueNode, INode } from '../types';

export const KeyValueData: FC<{
  node: IKeyValueNode;
  renderer: FC<{ nodes: INode[] }>;
}> = ({ node, renderer: Renderer }) => {
  return (
    <Stack data-type={node.type} data-propname={node.propName}>
      <Heading as="h6">{node.label}:</Heading>
      <ul>
        <Renderer nodes={node.value} />
      </ul>
    </Stack>
  );
};
