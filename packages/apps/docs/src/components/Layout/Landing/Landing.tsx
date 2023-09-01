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

import { NotFound } from '@/components/NotFound';
import { IPageProps } from '@/types/Layout';
import classnames from 'classnames';
import React, { FC } from 'react';

export const Landing: FC<IPageProps> = ({
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
          icon={frontmatter.icon}
        />

        <div
          id="maincontent"
          className={classnames(contentClass, contentClassVariants.code)}
        >
          <article className={articleClass}>
            {children}
            <NotFound />
          </article>
        </div>
      </Template>
    </div>
  );
};

Landing.displayName = 'Landing';
