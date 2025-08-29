import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { Data } from './DataComponents';
import type { INode } from './types';

const LayoutRenderer = ({ node }: { node: INode }) => {
  if (!node) return null;

  if (node.type === 'stack') {
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
            <strong style={{ color: 'blue' }}>{node.label}</strong>
          </Stack>
        )}
        <Stack {...node.props} style={node.props?.style}>
          {node.children?.map((child, index: number) => (
            <LayoutRenderer key={index} node={child} />
          ))}
        </Stack>
      </Stack>
    );
  } else if (node.type === 'text' || node.type === 'number') {
    return <Data.Text node={node} key={node.id} />;
  } else if (node.type === 'list') {
    return (
      <Stack
        {...node.props}
        style={node.props?.style || {}}
        data-type={node.type}
        data-propname={node.propName}
      >
        <Text bold>{node.label}</Text>
        <ul>
          {node.value?.map((item, index: number) => (
            <li key={index}>
              <Text bold>{item}:</Text>
            </li>
          ))}
        </ul>
      </Stack>
    );
  } else if (node.type === 'key-value') {
    return (
      <Stack
        {...node.props}
        style={node.props?.style || {}}
        data-type={node.type}
        data-propname={node.propName}
      >
        <Text bold>{node.label}:</Text>
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
