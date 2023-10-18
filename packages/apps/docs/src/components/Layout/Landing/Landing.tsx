import type { IBasePageProps } from '@/Layout';
import classnames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template/Template';
import { TitleHeader } from '../components/TitleHeader/TitleHeader';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '../components/articleStyles.css';
import { globalClass } from '../global.css';
import { pageGridClass } from './styles.css';

export const Landing: FC<IBasePageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const gridClassNames = classnames(globalClass, baseGridClass, pageGridClass);

  return (
    <>
      <TitleHeader title={frontmatter.title} subTitle={frontmatter.subTitle} />
      <div className={gridClassNames}>
        <Template menuItems={leftMenuTree} layout="landing">
          <div
            id="maincontent"
            className={classnames(contentClass, contentClassVariants.code)}
          >
            <article className={articleClass}>{children}</article>
          </div>
        </Template>
      </div>
    </>
  );
};

Landing.displayName = 'Landing';
