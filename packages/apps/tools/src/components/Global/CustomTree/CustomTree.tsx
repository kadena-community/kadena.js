import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoCached,
} from '@kadena/react-icons/system';
import { Badge, Button, Stack, Text } from '@kadena/react-ui';
import React from 'react';
import type { ICustomAccordionProps } from '../CustomAccordion/CustomAccordion';
import CustomAccordion from '../CustomAccordion/CustomAccordion';
import { itemContainerStyle, itemTitleStyle } from './CustomTree.css';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TreeItem = {
  title: string;
  key: React.Key;
  children: TreeItem[];
};

export interface ICustomTreeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'children' | 'data'> {
  data: TreeItem[];
}

// eslint-disable-next-line react/function-component-definition
function CustomTree<T>({ data }: ICustomTreeProps<T>) {
  return (
    <CustomAccordion
      data={data}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      itemProps={{ fillHeight: true }}
    >
      {(item) => {
        return (
          <>
            <Stack
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={item.onExpandCollapse}
              role="button"
              className={itemContainerStyle}
            >
              <Button
                variant="transparent"
                onClick={() => {
                  item.onExpandCollapse();
                }}
              >
                {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
              </Button>
              <Text className={itemTitleStyle}>{item.data.title}</Text>
              <Button variant="transparent" isCompact>
                <MonoCached />
              </Button>
              {item.data.children.length ? (
                <Badge size="sm">{item.data.children.length}</Badge>
              ) : null}
            </Stack>
            {item.isExpanded ? (
              <Node data={item.data.children} level={0} />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

// eslint-disable-next-line react/function-component-definition
function Node<
  T extends { key: React.Key; children: T[]; title: string } & Record<
    string,
    unknown
  >,
>({ data, level }: { data: T[]; level: number }) {
  return (
    <CustomAccordion data={data}>
      {(child) => {
        return (
          <>
            <Stack
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={() => {
                console.log('onClick', child);
                if (child.data.children.length) {
                  child.onExpandCollapse();
                } else {
                  console.log('I aint got no kids!');
                }
              }}
              role="button"
              className={itemContainerStyle}
            >
              {child.data.children.length ? (
                <Button variant="transparent" onClick={child.onExpandCollapse}>
                  {child.isExpanded ? (
                    <MonoArrowDropDown />
                  ) : (
                    <MonoArrowRight />
                  )}
                </Button>
              ) : null}
              <Text className={itemTitleStyle}>{child.data.title}</Text>
              {child.data.children.length ? (
                <Badge size="sm">{child.data.children.length}</Badge>
              ) : null}
            </Stack>
            {child.isExpanded && child.data.children.length ? (
              <Node data={child.data.children} level={level + 1} />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

export default CustomTree;
