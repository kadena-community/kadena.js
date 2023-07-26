import { Accordion, IconButton, SystemIcon, Tree } from '@kadena/react-ui';

import { gridItemMenuStyle, subMenuTitleClass } from './styles.css';

import { useLayoutContext } from '@/context';
import React, { FC } from 'react';

export const Menu: FC = () => {
  const { activeMenu, setActiveMenuIndex } = useLayoutContext();
  if (!activeMenu) return null;

  return (
    <div className={gridItemMenuStyle}>
      <div className={subMenuTitleClass}>
        <span>{activeMenu.title}</span>
        <IconButton
          icon={SystemIcon.Close}
          onClick={() => setActiveMenuIndex(undefined)}
          title={activeMenu.title}
        />
      </div>
      <Accordion
        sections={
          activeMenu.items?.map((item) => ({
            title: item.title,
            children: <Tree isOpen={true} items={item.items} />,
          })) ?? []
        }
      />
    </div>
  );
};
