import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { IListNode, INode } from '../types';
import { isStringArray, sortObject } from '../utils';

export const ListData: FC<{
  node: IListNode;
  renderer: FC<{ nodes: INode[] }>;
}> = ({ node, renderer: Renderer }) => {
  return (
    <Stack
      flexDirection="column"
      data-type={node.type}
      data-propname={node.propName}
    >
      <Heading as="h6">{node.label}</Heading>
      <ul>
        {isStringArray(node.value) ? (
          node.value
            .sort(sortObject)
            .map((val, idx) => <li key={idx}>{val}</li>)
        ) : (
          <Renderer nodes={node.value} />
        )}
      </ul>
    </Stack>
  );
};
