import React from 'react';
import CustomAccordion from '../CustomAccordion/CustomAccordion';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TreeItem = {
  title: string;
  key: React.Key;
  children: TreeItem[];
};

const data: TreeItem[] = [
  {
    title: 'Explorer',
    children: [
      {
        title: 'mainnet',
        key: 'mainnet',
        children: [
          {
            title: 'arcade',
            key: 'arcade',
            children: [{ title: '0', key: 'arcade-0', children: [] }],
          },
        ],
      },
      {
        title: 'testnet',
        key: 'testnet',
        children: [
          {
            title: 'coin',
            key: 'arcade',
            children: [{ title: '0', key: 'coin-0', children: [] }],
          },
        ],
      },
    ],
    key: 'explorer',
  },
  {
    title: 'Outline',
    children: [
      {
        title: 'Interfaces',
        key: 'coin',
        children: [{ title: 'fungible-v2', key: 'fungible-v2', children: [] }],
      },
      {
        title: 'Capabilities',
        key: 'capabilities',
        children: [
          {
            title: 'GOVERNANCE',
            key: 'GOVERNANCE',
            children: [],
          },
        ],
      },
    ],
    key: 'outline',
  },
];

const CustomTree = () => {
  console.log('rerender CustomTree');
  return (
    <CustomAccordion<TreeItem>
      data={data}
      defaultExpandedKey={'explorer'}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      itemProps={{ fillHeight: true }}
    >
      {(item) => {
        return (
          <>
            <button
              onClick={() => {
                console.log('onClick', item);
                item.onExpandCollapse();
              }}
            >
              {item.data.title}
            </button>
            {item.isExpanded ? <Node data={item.data.children} /> : null}
          </>
        );
      }}
    </CustomAccordion>
  );
};

// eslint-disable-next-line react/function-component-definition
function Node<
  T extends { key: React.Key; children: T[]; title: string } & Record<
    string,
    unknown
  >,
>({ data }: { data: T[] }) {
  console.log('rerender Node');
  return (
    <CustomAccordion data={data}>
      {(child) => {
        return (
          <>
            <button
              onClick={() => {
                console.log('onClick', child);
                if (child.data.children.length) {
                  child.onExpandCollapse();
                } else {
                  console.log('I aint got no kids!');
                }
              }}
            >
              {child.data.title}
            </button>
            {child.isExpanded && child.data.children.length ? (
              <Node data={child.data.children} />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

export default CustomTree;
