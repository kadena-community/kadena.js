import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import { sidebarLinks } from '@/constants/side-links';
import React, { useRef } from 'react';
import { infoAccordionWrapper, linksBoxStyle } from './styles.css';

import { infoBoxStyle } from '@/pages/transactions/cross-chain-transfer-tracker/styles.css';
import { Accordion, AccordionItem } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { FC } from 'react';

export interface InfoSections {
  question: string;
  content: string;
}

export interface IRightInfoSidebarProps {
  infoSections: InfoSections[];
}

export const RightInfoSidebar: FC<IRightInfoSidebarProps> = ({
  infoSections,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const drawerPanelRef = useRef<HTMLElement | null>(null);

  return (
    <DrawerToolbar
      ref={drawerPanelRef}
      sections={[
        {
          icon: 'Information',
          title: t('transfer-sidebar-title'),
          children: (
            <div className={infoAccordionWrapper}>
              <Accordion selectionMode="multiple">
                {infoSections.map((item) => (
                  <AccordionItem title={item.question} key={item.question}>
                    <div className={infoBoxStyle}>{item.content}</div>
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
