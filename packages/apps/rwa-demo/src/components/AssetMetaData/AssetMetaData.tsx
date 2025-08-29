import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';

const renderLayout = (layout: any, count = 0) => {
  // if(layout.children && layout.children.length > 0) {
  //     return layout.children.map((child: any, index: number) => return renderLayout(child) )
  // }

  count++;
  console.log(layout);

  const { label, value } = layout ?? {};
  const { style: styleprop, ...props } = layout.props ?? {};

  const style = layout.style ?? styleprop ?? {};

  return layout.children?.length ? (
    <Stack
      key={layout.propName + layout.type + count}
      {...props}
      style={{ ...(style ?? {}) }}
      data-type={layout.type}
      data-propname={layout.propName}
    >
      {label && <strong>{label}: </strong>}
      {layout.children?.map((child: any) => renderLayout(child, count))}
    </Stack>
  ) : (
    <Stack
      key={layout.propName + layout.type + count}
      {...props}
      style={{ ...(style ?? {}) }}
      data-type={layout.type}
      data-propname={layout.propName}
    >
      {label && <strong>{label}: </strong>}

      {typeof value === 'string' || typeof value === 'number'
        ? value
        : undefined}

      {layout.type === 'list' && (
        <ul>
          {value.map((v, idx) => (
            <li key={idx}>{JSON.stringify(v)}</li>
          ))}
        </ul>
      )}

      {layout.type === 'key-value' && (
        <ul>
          {Object.entries(value).map(([key, keyValue]) => (
            <li key={key}>
              <strong>{key}</strong>: {JSON.stringify(keyValue)}
            </li>
          ))}
        </ul>
      )}

      {layout.type === 'key-value-list' && (
        <ul>
          {value.map((v, idx) => (
            <li key={idx}>
              <ul>
                {Object.entries(v).map(([key, keyValue]) => (
                  <li key={key}>
                    <strong>{key}</strong>: {JSON.stringify(keyValue)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </Stack>
  );
};

const LayoutRenderer = ({ node }: { node: any }) => {
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
        <Stack {...node.props} style={node.props?.style || {}}>
          {node.children?.map((child: any, index: number) => (
            <LayoutRenderer key={index} node={child} />
          ))}
        </Stack>
      </Stack>
    );
  } else if (node.type === 'text') {
    return (
      <Stack
        {...node.props}
        style={node.props?.style || {}}
        data-type={node.type}
        data-propname={node.propName}
      >
        <Text bold>{node.label}:</Text> <Text variant="code">{node.value}</Text>
      </Stack>
    );
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
          {node.value?.map((item: any, index: number) => (
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

export const AssetMetaData: FC<{ data: any; layout: any }> = ({
  data,
  layout,
}) => {
  if (!data || !layout) return null;

  return (
    <div>
      <LayoutRenderer node={layout} />
    </div>
  );
};
