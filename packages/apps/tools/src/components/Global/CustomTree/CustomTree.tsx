import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoCached,
} from '@kadena/react-icons/system';
import { Badge, Button, Stack, Text } from '@kadena/react-ui';
import { token } from '@kadena/react-ui/styles';
import React, { useCallback } from 'react';
import type { ICustomAccordionProps } from '../CustomAccordion/CustomAccordion';
import CustomAccordion from '../CustomAccordion/CustomAccordion';
import {
  containerStyle,
  itemContainerStyle,
  itemTitleStyle,
  reloadButtonStyles,
} from './CustomTree.css';
import CustomTreeNode from './CustomTreeNode';

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
  extends Omit<ICustomAccordionProps<T>, 'children' | 'items'> {
  items: TreeItem<T>[];
  onReload: (item: TreeItem<T>) => void;
  onItemClick: (item: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
}

function CustomTree<T>({
  items,
  onReload,
  onItemClick,
  onExpandCollapse,
  ...rest
}: ICustomTreeProps<T>) {
  return (
    <CustomAccordion {...rest} items={items} className={containerStyle}>
      {(item) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const toggleHandler = useCallback(() => {
          item.toggleExpandCollapse();

          // We "toggle" the expanded state ourselves since this is still the previous state
          onExpandCollapse(item.data, !item.isExpanded);
        }, [item]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const onReloadCallback = useCallback(() => {
          onReload(item.data);
        }, [item]);

        return (
          <>
            <Stack
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={toggleHandler}
              role="button"
              className={itemContainerStyle}
            >
              <Button variant="transparent" onPress={toggleHandler}>
                {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
              </Button>
              <Text className={itemTitleStyle} bold>
                {item.data.title}
              </Text>
              {item.data.supportsReload && !item.data.isLoading ? (
                <Button
                  variant="transparent"
                  isCompact
                  onPress={onReloadCallback}
                  className={reloadButtonStyles}
                >
                  <MonoCached
                    color={token('color.icon.semantic.positive.default')}
                  />
                </Button>
              ) : null}
              {!item.data.isLoading && item.data.label ? (
                <Badge size="sm" style={'highContrast'}>
                  {item.data.label}
                </Badge>
              ) : null}
              {item.data.isLoading ? (
                <Badge size="sm" style={'highContrast'}>
                  Loading
                </Badge>
              ) : null}
            </Stack>
            {item.isExpanded ? (
              <CustomTreeNode
                items={item.data.children}
                level={1}
                onItemClick={onItemClick}
                onExpandCollapse={onExpandCollapse}
                {...item.accessibilityProps}
              />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

export default CustomTree;
