import { Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { IKeyValueNode } from '../types';

export const KeyValueData: FC<{ node: IKeyValueNode }> = ({ node }) => {
  return (
    <Stack
      {...node.props}
      style={node.props?.style || {}}
      data-type={node.type}
      data-propname={node.propName}
    >
      <Heading as="h6">{node.label}:</Heading>
      <ul>
        {Object.entries(node.value || {}).map(([key, val]) => (
          <li key={key}>
            <Text bold>{key}:</Text>
            <Text variant="code">{val}</Text>
          </li>
        ))}
      </ul>
    </Stack>
  );
};
