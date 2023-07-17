import { Article, CodeBackground, Content } from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';
import { RedocRawOptions } from 'redoc';

export const options: RedocRawOptions = {
  pathInMiddlePanel: true,
  disableSearch: true,
  hideDownloadButton: true,
  hideFab: true,

  theme: {
    breakpoints: {
      small: '1024px',
      medium: '1280px',
      large: '1440px',
    },
    sidebar: {
      backgroundColor: 'transparent',
    },

    rightPanel: {
      backgroundColor: 'transparent',
      width: '400px',
    },
    codeBlock: {
      backgroundColor: 'black',
    },
    colors: {
      primary: {
        main: 'RGB(218,52,140)', // Kadena pink
      },
    },
  },
  expandResponses: '200,201,204',
};

export const Redocly: FC<ILayout> = ({
  children,
  isAsideOpen,
  editLink,
  navigation,
}) => {
  return (
    <>
      <Content id="maincontent" layout="code">
        <Article>
          {children}
          <BottomPageSection
            editLink={editLink}
            navigation={navigation}
            layout="code"
          />
        </Article>
      </Content>
      <CodeBackground isOpen={isAsideOpen} />
    </>
  );
};

Redocly.displayName = 'Redocly';
