import { DrawerIconButton } from '@/components/Common/DrawerToolbar/DrawerIcon';
import { MonoClose } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { ForwardRefExoticComponent, ReactElement, ReactNode } from 'react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import {
  buttonWrapperClass,
  expandedDrawerContentClass,
  expandedDrawerContentStyle,
  expandedDrawerTitleClass,
  gridItemCollapsedSidebarStyle,
  gridItemMiniMenuStyle,
} from './styles.css';

export interface IDrawerToolbarSection {
  icon: ReactElement;
  title: string;
  children: ReactNode;
}
interface IProps {
  initialOpenItem?: { item: number } | undefined;
  sections: IDrawerToolbarSection[];
}

export const DrawerToolbar: ForwardRefExoticComponent<
  Omit<IProps, 'ref'> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, IProps>(function DrawerToolbar(
  { sections, initialOpenItem = undefined },
  ref = null,
) {
  const [visibleSection, setVisibleSection] = useState<number | null>(
    initialOpenItem !== undefined ? initialOpenItem.item : null,
  );
  const isOpen = visibleSection !== null;

  const handleOpenSection = useCallback(
    (index: number): void => {
      if (sections?.[index]) {
        setVisibleSection(index);
      }
    },
    [sections],
  );

  useEffect(() => {
    if (ref) {
      // @ts-ignore
      ref.openSection = handleOpenSection;
    }

    setVisibleSection(
      initialOpenItem !== undefined ? initialOpenItem.item : null,
    );
  }, [handleOpenSection, ref, initialOpenItem]);

  return (
    <aside className={expandedDrawerContentStyle}>
      {isOpen ? (
        <div className={classNames(gridItemCollapsedSidebarStyle, { isOpen })}>
          <div className={expandedDrawerTitleClass}>
            {sections[visibleSection].title}
            <DrawerIconButton
              onClick={() => setVisibleSection(null)}
              icon={<MonoClose />}
              title="close"
            />
          </div>
          <div className={expandedDrawerContentClass}>
            {sections[visibleSection].children}
          </div>
        </div>
      ) : null}

      <div className={gridItemMiniMenuStyle}>
        {sections.map(({ icon, title }, index) => (
          <div className={buttonWrapperClass} key={title}>
            <DrawerIconButton
              icon={icon}
              onClick={() => handleOpenSection(index)}
              active={index === visibleSection}
            />
          </div>
        ))}
      </div>
    </aside>
  );
});

export default DrawerToolbar;
