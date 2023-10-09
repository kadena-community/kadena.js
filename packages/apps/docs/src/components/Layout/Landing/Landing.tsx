import { baseGridClass } from '../basestyles.css';
import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '../components';
import { Template } from '../components/Template';
import { globalClass } from '../global.css';

import { pageGridClass } from './styles.css';

import type { IBasePageProps } from '@/types/Layout';
import classnames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export const Landing: FC<IBasePageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const gridClassNames = classnames(globalClass, baseGridClass, pageGridClass);

  return (
    <div className={gridClassNames}>
      <Template menuItems={leftMenuTree} layout="landing">
        <TitleHeader
          title={frontmatter.title}
          subTitle={frontmatter.subTitle}
        />

        <div
          id="maincontent"
          className={classnames(contentClass, contentClassVariants.code)}
        >
          <article className={articleClass}>{children}</article>
        </div>
      </Template>
    </div>
  );
};

Landing.displayName = 'Landing';
