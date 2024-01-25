import { DrawerIconButton } from '@/components/Common/DrawerToolbar/DrawerIcon';
import { Button, SystemIcon } from '@kadena/react-ui';
import classNames from 'classnames';
import type { ForwardRefExoticComponent, ReactNode } from 'react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import {
  buttonWrapperClass,
  expandedDrawerContentClass,
  expandedDrawerTitleClass,
  gridItemCollapsedSidebarStyle,
} from './styles.css';

export interface IDrawerToolbarSection {
  icon: keyof typeof SystemIcon;
  title: string;
  children: ReactNode;
}
interface IProps {
  initialOpenItem?: number | undefined;
  sections: IDrawerToolbarSection[];
}

export const DrawerToolbar: ForwardRefExoticComponent<
  Omit<IProps, 'ref'> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, IProps>(function DrawerToolbar(
  { sections, initialOpenItem = undefined },
  ref = null,
) {
  const [visibleSection, setVisibleSection] = useState<number | null>(
    initialOpenItem !== undefined ? initialOpenItem : null,
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
  }, [handleOpenSection, ref]);

  return (
    <aside className={classNames(gridItemCollapsedSidebarStyle, { isOpen })}>
      {!isOpen ? (
        <div>
          {sections.map(({ icon, title }, index) => (
            <div className={buttonWrapperClass} key={title}>
              <DrawerIconButton
                icon={icon}
                onClick={() => handleOpenSection(index)}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className={expandedDrawerTitleClass}>
            {sections[visibleSection].title}
            <Button
              onClick={() => setVisibleSection(null)}
              icon={<SystemIcon.Close />}
              title="close"
              aria-label="close"
              variant="text"
            />
          </div>
          <div className={expandedDrawerContentClass}>
            {sections[visibleSection].children}
          </div>
        </>
      )}
    </aside>
  );
});

export default DrawerToolbar;
