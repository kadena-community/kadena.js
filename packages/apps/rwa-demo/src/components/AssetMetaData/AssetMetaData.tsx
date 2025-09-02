import type { FC } from 'react';
import { Data } from './DataComponents';
import type { INode } from './types';
import { sortObject } from './utils';

const LayoutRenderer: FC<{ nodes: INode[] }> = ({ nodes }) => {
  if (!nodes) return null;

  return nodes.sort(sortObject).map((value) => {
    if (typeof value === 'string') return null;

    if (value.type === 'text' || value.type === 'number') {
      return <Data.Text node={value} key={value.id} />;
    } else if (value.type === 'boolean') {
      return <Data.Boolean node={value} key={value.id} />;
    } else if (value.type === 'image') {
      return <Data.Image node={value} key={value.id} />;
    } else if (value.type === 'list') {
      return (
        <Data.List node={value} key={value.id} renderer={LayoutRenderer} />
      );
    } else if (value.type === 'key-value') {
      return (
        <Data.KeyValue node={value} key={value.id} renderer={LayoutRenderer} />
      );
    }
  });
};

export const AssetMetaData: FC<{
  data: Record<string, any>;
  layout: INode;
}> = ({ data, layout }) => {
  if (!layout) return null;

  return (
    <div>
      <LayoutRenderer
        nodes={Object.entries(layout).map(([_, value]) => value)}
      />
    </div>
  );
};
