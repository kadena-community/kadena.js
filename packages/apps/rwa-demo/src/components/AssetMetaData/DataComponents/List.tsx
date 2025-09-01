import { Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { IListNode } from '../types';

export const ListData: FC<{ node: IListNode }> = ({ node }) => {
  return (
    <Stack
      {...node.props}
      flexDirection="column"
      style={node.props?.style || {}}
      data-type={node.type}
      data-propname={node.propName}
    >
      <Heading as="h6">{node.label}</Heading>
      <ul>
        {node.value?.map((item, index: number) => (
          <li key={index}>
            <Text bold>{item}</Text>
          </li>
        ))}
      </ul>
    </Stack>
  );
};
