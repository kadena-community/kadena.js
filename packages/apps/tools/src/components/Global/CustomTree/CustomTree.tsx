import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoCached,
} from '@kadena/react-icons/system';
import { Badge, Button, Stack, Text } from '@kadena/react-ui';
import {
  ellipsis,
  monospaceSmallestRegular,
  token,
  tokens,
} from '@kadena/react-ui/styles';
import classnames from 'classnames';
import React from 'react';
import type { ICustomAccordionProps } from '../CustomAccordion/CustomAccordion';
import CustomAccordion from '../CustomAccordion/CustomAccordion';
import {
  itemBadgeStyle,
  itemContainerStyle,
  itemTitleStyle,
} from './CustomTree.css';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TreeItem<T> = {
  title: string;
  key: React.Key;
  children: TreeItem<T>[];
  data: T;
  isLoading?: boolean;
  supportsReload?: boolean;
  label?: string | number;
};

export interface ICustomTreeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'children' | 'data'> {
  data: TreeItem<T>[];
  onReload: (item: TreeItem<T>) => void;
  onItemClick: (item: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
}

// eslint-disable-next-line react/function-component-definition
function CustomTree<T>({
  data,
  onReload,
  onItemClick,
  onExpandCollapse,
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
    >
      {(item) => {
        return (
          <>
            <Stack
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={() => {
                item.toggleExpandCollapse();

                // We "toggle" the expanded state ourselves since this is still the previous state
                onExpandCollapse(item.data, !item.isExpanded);
              }}
              role="button"
              className={itemContainerStyle}
              style={{ borderBlockEnd: '1px solid rgba(0, 0, 0, 0.25)' }}
            >
              <Button
                variant="transparent"
                onClick={() => {
                  item.toggleExpandCollapse();

                  // We "toggle" the expanded state ourselves since this is still the previous state
                  onExpandCollapse(item.data, !item.isExpanded);
                }}
              >
                {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
              </Button>
              <Text className={itemTitleStyle} bold>
                {item.data.title}
              </Text>
              {item.data.supportsReload && !item.data.isLoading ? (
                <Button
                  variant="transparent"
                  isCompact
                  onPress={() => {
                    onReload(item.data);
                  }}
                  style={{ marginInlineEnd: '8px' }}
                >
                  <MonoCached
                    color={token('color.icon.semantic.positive.default')}
                  />
                </Button>
              ) : null}
              {!item.data.isLoading && item.data.label ? (
                <Badge size="sm">{item.data.label}</Badge>
              ) : null}
              {item.data.isLoading ? <Badge size="sm">Loading</Badge> : null}
            </Stack>
            {item.isExpanded ? (
              <Node
                data={item.data.children}
                level={1}
                onItemClick={onItemClick}
                onExpandCollapse={onExpandCollapse}
              />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

interface INodeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'data' | 'children'> {
  data: TreeItem<T>[];
  level: number;
  onItemClick: (item: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
}

// eslint-disable-next-line react/function-component-definition
function Node<T>({
  data,
  level,
  onItemClick,
  onExpandCollapse,
  ...rest
}: INodeProps<T>) {
  return (
    <CustomAccordion
      {...rest}
      data={data}
      itemProps={{
        style: {
          borderBlockEnd:
            level === 1 ? '1px solid rgba(0, 0, 0, 0.25)' : 'initial',
        },
      }}
    >
      {(child) => {
        const hasChildren = !!child.data.children.length;
        return (
          <>
            <Stack
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={() => {
                if (child.data.children.length) {
                  child.toggleExpandCollapse();

                  // We "toggle" the expanded state ourselves since this is still the previous state
                  onExpandCollapse(child.data, !child.isExpanded);
                } else {
                  onItemClick(child.data);
                }
              }}
              role="button"
              className={itemContainerStyle}
              style={{
                paddingInlineStart: `${level * 20 + (!hasChildren ? 20 : 0)}px`,
                cursor: hasChildren ? 'default' : 'pointer',
              }}
            >
              {hasChildren ? (
                <Button
                  variant="transparent"
                  onClick={() => {
                    child.toggleExpandCollapse();

                    // We "toggle" the expanded state ourselves since this is still the previous state
                    onExpandCollapse(child.data, !child.isExpanded);
                  }}
                >
                  {child.isExpanded ? (
                    <MonoArrowDropDown />
                  ) : (
                    <MonoArrowRight />
                  )}
                </Button>
              ) : null}
              <Text className={itemTitleStyle}>{child.data.title}</Text>
              {child.data.label ? (
                <Badge
                  size="sm"
                  className={classnames(
                    monospaceSmallestRegular,
                    ellipsis,
                    itemBadgeStyle,
                  )}
                >
                  {child.data.label}
                </Badge>
              ) : null}
              {hasChildren ? (
                <Badge size="sm">{child.data.children.length}</Badge>
              ) : null}
            </Stack>
            {child.isExpanded && hasChildren ? (
              <Node
                data={child.data.children}
                level={level + 1}
                onItemClick={onItemClick}
                onExpandCollapse={onExpandCollapse}
              />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

export default CustomTree;
