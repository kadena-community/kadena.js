import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoMenuOpen,
  MonoVerticalSplit,
} from '@kadena/react-icons/system';
import { Button, Heading, Stack } from '@kadena/react-ui';
import React from 'react';
import CustomAccordion from '../../CustomAccordion/CustomAccordion';
import type { ICustomTreeProps, TreeItem } from '../../CustomTree/CustomTree';
import CustomTree from '../../CustomTree/CustomTree';
import {
  containerStyle,
  headingStyles,
  iconStyles,
  itemStyle,
} from './styles.css';

export interface ISidePanelProps<T> {
  data: ICustomTreeProps<T>['data'];
  isLoading?: boolean;
  onReload: ICustomTreeProps<T>['onReload'];
  onModuleClick: (module: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
}

function SidePanel<T>({
  data,
  onReload,
  onModuleClick,
  onExpandCollapse,
}: ISidePanelProps<T>) {
  return (
    <CustomAccordion
      data={data}
      defaultExpandedKey="explorer"
      className={containerStyle}
      itemProps={{ fillHeight: true }}
    >
      {(item) => (
        <>
          <Stack
            backgroundColor="surface.default"
            justifyContent="space-between"
            alignItems={'center'}
            gap={'xxs'}
            role="button"
            onClick={item.toggleExpandCollapse}
            className={itemStyle}
          >
            {item.data.title === 'Explorer' ? (
              <MonoVerticalSplit className={iconStyles} />
            ) : (
              <MonoMenuOpen className={iconStyles} />
            )}
            <Heading variant="h6" className={headingStyles}>
              {item.data.title}
            </Heading>
            <Button
              isCompact
              variant="transparent"
              onPress={item.toggleExpandCollapse}
            >
              {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
            </Button>
          </Stack>
          {item.isExpanded ? (
            <CustomTree
              data={item.data.children}
              onReload={onReload}
              onItemClick={onModuleClick}
              onExpandCollapse={onExpandCollapse}
              {...item.accessibilityProps}
            />
          ) : null}
        </>
      )}
    </CustomAccordion>
  );
}

export default SidePanel;
