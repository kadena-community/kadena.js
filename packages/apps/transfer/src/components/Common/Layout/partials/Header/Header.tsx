import {
  StyledGridRow,
  StyledContainer,
  StyledHeader,
  StyledLeftPanelWrapper,
  StyledLogoWrapper,
  StyledMenuItem,
  StyledTitle,
  StyledBackgroundGlow,
} from './styles'

import {GridCol} from "@/components/Global";
import Routes from "@/constants/routes";
import {IMenuItem} from "@/types/Layout";
import React, {FC, ReactNode} from 'react'

export interface IHeaderProps {
  logo?: ReactNode,
  appTitle?: string,
  menu?: IMenuItem[],
  rightPanel?: ReactNode
}

const Header: FC<IHeaderProps> = ({
  logo,
  appTitle,
  rightPanel,
  menu
}) => {
  const hasMenu: boolean = Boolean(menu?.length);
  return (
    <StyledHeader>
      <StyledContainer type="fixed">
        <StyledBackgroundGlow />
        <StyledGridRow>
          <GridCol xs={11} lg={2}>
            <StyledLeftPanelWrapper>
              {Boolean(logo) && <StyledLogoWrapper>{logo}</StyledLogoWrapper>}
              {Boolean(appTitle) && <StyledTitle href={Routes.HOME}>{appTitle}</StyledTitle>}
            </StyledLeftPanelWrapper>
          </GridCol>
          {hasMenu && (
            <GridCol xs={{hidden: true}} lg={{size: 7, hidden: false}}>
              <nav>
                {menu?.map(item => <StyledMenuItem href={item.href} key={item.title}>{item.title}</StyledMenuItem>)}
              </nav>
            </GridCol>
          )}
          {Boolean(rightPanel) && (
            <GridCol xs={{hidden: true}} lg={{size: 3, hidden: false, push: hasMenu ? 0 : 7}}>
              {rightPanel}
            </GridCol>
          )}
          <GridCol xs={{size: 1, hidden: false}} lg={{hidden: true}}>
            burger
          </GridCol>
        </StyledGridRow>
      </StyledContainer>
    </StyledHeader>
  )
}

export default Header
