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
export type TreeItem<T> = {
  title: string;
  key: React.Key;
  children: TreeItem<T>[];
  data: T;
  isLoading?: boolean;
  label?: string | number;
};

export interface ICustomTreeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'children' | 'data'> {
  data: TreeItem<T>[];
  onReload: (data: T) => void;
}

// eslint-disable-next-line react/function-component-definition
function CustomTree<T>({
  data,
  onReload,
  style,
  ...rest
}: ICustomTreeProps<T>) {
  return (
    <CustomAccordion
      {...rest}
      data={data}
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
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
              <Text className={itemTitleStyle} bold>
                {item.data.title}
              </Text>
              {!item.data.isLoading ? (
                <Button
                  variant="transparent"
                  isCompact
                  onPress={() => {
                    onReload(item.data.data);
                  }}
                >
                  <MonoCached />
                </Button>
              ) : null}
              {!item.data.isLoading && item.data.label ? (
                <Badge size="sm">{item.data.label}</Badge>
              ) : null}
              {item.data.isLoading ? <Badge size="sm">Loading</Badge> : null}
            </Stack>
            {item.isExpanded ? (
              <Node data={item.data.children} level={1} />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

interface INodeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'data' | 'children'> {
  data: T[];
  level: number;
}

// eslint-disable-next-line react/function-component-definition
function Node<
  T extends { key: React.Key; children: T[]; title: string } & Record<
    string,
    unknown
  >,
>({ data, level, ...rest }: INodeProps<T>) {
  return (
    <CustomAccordion {...rest} data={data}>
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
              style={{ paddingInlineStart: `${level * 20}px` }}
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
