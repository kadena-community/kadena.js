import { useLayoutContext } from '@/context';
import { Accordion, IconButton } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { MenuLinkButton } from './MenuLinkButton';
import { gridItemMenuStyle, subMenuTitleClass } from './styles.css';

export const Menu: FC = () => {
  const router = useRouter();

  const { activeMenu, setActiveMenuIndex } = useLayoutContext();
  if (!activeMenu) return null;

  return (
    <div className={gridItemMenuStyle}>
      <div className={subMenuTitleClass}>
        <span>{activeMenu.title}</span>
        <IconButton
          icon={'Close'}
          onClick={() => setActiveMenuIndex(undefined)}
          title={activeMenu.title}
        />
      </div>
      <Accordion.Root>
        {activeMenu.items?.map((item, index) => (
          <MenuLinkButton
            title={item.title}
            key={index}
            href={item.href}
            active={item.href === router.pathname}
          />
        ))}
      </Accordion.Root>
    </div>
  );
};
