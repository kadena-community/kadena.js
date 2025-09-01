import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { INode, IStackNode } from '../types';

export const StackData: FC<{
  node: IStackNode;
  renderer: FC<{
    node: INode;
  }>;
}> = ({
  node,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  renderer: LayoutRenderer,
}) => {
  return (
    <Stack
      {...node.props}
      flexDirection="column"
      style={{ flex: 1 }}
      data-type={node.type}
      data-propname={node.propName}
    >
      {node.label && (
        <Stack>
          <Heading as="h5">{node.label}</Heading>
        </Stack>
      )}
      <Stack {...node.props} style={node.props?.style}>
        {node.children?.map((child, index: number) => (
          <LayoutRenderer key={index} node={child} />
        ))}
      </Stack>
    </Stack>
  );
};
