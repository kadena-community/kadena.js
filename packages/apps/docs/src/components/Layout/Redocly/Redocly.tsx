import { BottomPageSection } from '@/components/BottomPageSection/BottomPageSection';
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs';
import { TopPageSection } from '@/components/TopPageSection/TopPageSection';
import type { IPageProps } from '@kadena/docs-tools';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { RedocRawOptions } from 'redoc';
import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template/Template';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '../components/articleStyles.css';
import { globalClass } from '../global.css';
import { BackgroundGradient } from './BackgroundGradient';
import { pageGridClass } from './styles.css';

export const options: RedocRawOptions = {
  pathInMiddlePanel: true,
  disableSearch: true,
  hideDownloadButton: true,
  hideFab: true,

  theme: {
    breakpoints: {
      small: '1024px',
      medium: '1279px',
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

export const Redocly: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const gridClassNames = classNames(globalClass, baseGridClass, pageGridClass);

  return (
    <div className={gridClassNames}>
      <Template menuItems={leftMenuTree}>
        <div
          className={classNames(contentClass, contentClassVariants.code)}
          id="maincontent"
        >
          <article className={articleClass}>
            <Breadcrumbs menuItems={leftMenuTree} />

            <TopPageSection
              lastModifiedDate={frontmatter.lastModifiedDate}
              editLink={frontmatter.editLink}
            />
            {children}
            <BottomPageSection
              editLink={frontmatter.editLink}
              navigation={frontmatter.navigation}
              layout="code"
            />
          </article>
        </div>
        <BackgroundGradient />
      </Template>
    </div>
  );
};

Redocly.displayName = 'Redocly';
