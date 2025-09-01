import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { Data } from './DataComponents';
import type { INode } from './types';

const LayoutRenderer: FC<{ node: INode }> = ({ node }) => {
  if (!node) return null;

  if (node.type === 'stack') {
    return <Data.Stack node={node} renderer={LayoutRenderer} />;
  } else if (node.type === 'text' || node.type === 'number') {
    return <Data.Text node={node} key={node.id} />;
  } else if (node.type === 'list') {
    return <Data.List node={node} />;
  } else if (node.type === 'key-value') {
    return <Data.KeyValue node={node} />;
  } else if (node.type === 'image') {
    return <Data.Image node={node} />;
  } else if (node.type === 'key-value-list' && Array.isArray(node.value)) {
    return (
      <Stack
        {...node.props}
        style={node.props?.style || {}}
        data-type={node.type}
        data-propname={node.propName}
      >
        <Text bold>{node.label}:</Text>

        <ul>
          {node.value?.map((item, index) => (
            <Stack
              key={index}
              style={{ flexDirection: 'column' }}
              data-type={node.type}
              data-propname={node.propName}
            >
              {Object.entries(item).map(([key, val]) => (
                <Stack key={key}>
                  <Text bold>{key}:</Text>
                  <Text variant="code">{val}</Text>
                </Stack>
              ))}
            </Stack>
          ))}
        </ul>
      </Stack>
    );
  } else {
    <Stack
      {...node.props}
      style={node.props?.style || {}}
      data-type={node.type}
      data-propname={node.propName}
    >
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </Stack>;
  }

  return null; // Fallback for unknown types
};

export const AssetMetaData: FC<{
  data: Record<string, any>;
  layout: INode;
}> = ({ data, layout }) => {
  if (!data || !layout) return null;

  return (
    <div>
      <LayoutRenderer node={layout} />
    </div>
  );
};
