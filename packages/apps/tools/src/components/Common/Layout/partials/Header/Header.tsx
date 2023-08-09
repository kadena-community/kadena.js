import { SystemIcon } from '@kadena/react-ui';

import {
  StyledBurgerMenuButton,
  StyledContainer,
  StyledGridRow,
  StyledLeftPanelWrapper,
  StyledLogoWrapper,
  StyledMenuItem,
  StyledMobileMenu,
  StyledNav,
  StyledTitle,
} from './styles';
import { headerClass } from './styles.css';

import { GridCol } from '@/components/Global';
import Routes from '@/constants/routes';
import { IMenuItem } from '@/types/Layout';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, ReactNode, useState } from 'react';

export interface IHeaderProps {
  logo?: ReactNode;
  appTitle?: string;
  menu?: IMenuItem[];
  rightPanel?: ReactNode;
}

const Header: FC<IHeaderProps> = ({ logo, appTitle, rightPanel, menu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t } = useTranslation('common');
  const hasMenu: boolean = Boolean(menu?.length);

  const renderMenu = (type: 'desktop' | 'mobile' = 'desktop'): ReactNode => (
    <StyledNav type={type}>
      {menu?.map((item) => (
        <StyledMenuItem href={item.href} key={item.title}>
          {item.title}
        </StyledMenuItem>
      ))}
    </StyledNav>
  );

  return (
    <div className={headerClass}>
      <StyledContainer type="fixed">
        <StyledGridRow>
          <GridCol xs={11} lg={2}>
            <StyledLeftPanelWrapper>
              {Boolean(logo) && <StyledLogoWrapper>{logo}</StyledLogoWrapper>}
              {Boolean(appTitle) && (
                <StyledTitle href={Routes.HOME}>{appTitle}</StyledTitle>
              )}
            </StyledLeftPanelWrapper>
          </GridCol>
          {hasMenu && (
            <GridCol xs={{ hidden: true }} lg={{ size: 4, hidden: false }}>
              {renderMenu()}
            </GridCol>
          )}
          {Boolean(rightPanel) && (
            <GridCol
              xs={{ hidden: true }}
              lg={{ size: 6, hidden: false, push: hasMenu ? 0 : 7 }}
            >
              {rightPanel}
            </GridCol>
          )}
          <GridCol xs={{ size: 1, hidden: false }} lg={{ hidden: true }}>
            <StyledBurgerMenuButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title={t('Menu')}
              icon={isMenuOpen ? SystemIcon.Close : SystemIcon.MenuOpen}
            />
          </GridCol>
        </StyledGridRow>
      </StyledContainer>
      <StyledMobileMenu status={isMenuOpen ? 'open' : 'close'}>
        {renderMenu('mobile')}
        {rightPanel}
      </StyledMobileMenu>
    </div>
  );
};

export default Header;
