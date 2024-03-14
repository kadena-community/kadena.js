import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import { sidebarLinks } from '@/constants/side-links';
import React, { useEffect, useRef, useState } from 'react';
import {
  accordionItemContentStyle,
  accordionItemTitleStyle,
  infoAccordionWrapper,
  linksBoxStyle,
} from './styles.css';

import { useIsMatchingMediaQuery } from '@/hooks/use-is-mobile-media-query';
import { Accordion, AccordionItem } from '@kadena/react-ui';
import { breakpoints } from '@kadena/react-ui/styles';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { FC } from 'react';

export interface InfoSections {
  question: string;
  content: string;
}

export interface IRightInfoSidebarProps {
  infoSections: InfoSections[];
  sidebarOpen?: boolean;
}

export const RightInfoSidebar: FC<IRightInfoSidebarProps> = ({
  infoSections,
  sidebarOpen,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isLargeScreen = useIsMatchingMediaQuery(`${breakpoints.lg}`);

  const [initialItem, setInitialItem] = useState<{ item: number } | undefined>(
    undefined,
  );

  const drawerPanelRef = useRef<HTMLElement | null>(null);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
      if (isLargeScreen) {
        setInitialItem({ item: 0 });
      }
      return;
    }

    setInitialItem({ item: 0 });
  }, [sidebarOpen, isLargeScreen]);

  return (
    <DrawerToolbar
      ref={drawerPanelRef}
      initialOpenItem={initialItem}
      sections={[
        {
          icon: 'Information',
          title: t('transfer-sidebar-title'),
          children: (
            <div className={infoAccordionWrapper}>
              <Accordion selectionMode="multiple">
                {infoSections.map((item) => (
                  <AccordionItem
                    title={
                      <div className={accordionItemTitleStyle}>
                        {item.question}
                      </div>
                    }
                    key={item.question}
                  >
                    <div className={accordionItemContentStyle}>
                      {item.content}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ),
        },
        {
          icon: 'Link',
          title: t('Resources & Links'),
          children: (
            <div className={linksBoxStyle}>
              {sidebarLinks.map((item, index) => (
                <MenuLinkButton
                  title={item.title}
                  key={`menu-link-${index}`}
                  href={item.href}
                  active={item.href === router.pathname}
                  target="_blank"
                />
              ))}
            </div>
          ),
        },
      ]}
    />
  );
};
