import { Stack } from '@kadena/react-ui';

import {
  Article,
  BaseTemplate,
  Content,
  Footer,
  Header,
  TitleHeader,
} from '../components';

import { BottomPageSection } from '@/components/BottomPageSection';
import { IPageProps } from '@/types/Layout';
import { formatISODate } from '@/utils/dates';
import React, { FC, useState } from 'react';

export const Blog: FC<IPageProps> = ({
  children,
  frontmatter,
  leftMenuTree,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((v) => !v);
    setIsAsideOpen(false);
  };

  const toggleAside = (): void => {
    setIsAsideOpen((v) => !v);
    setIsMenuOpen(false);
  };

  return (
    <BaseTemplate>
      <Header
        toggleMenu={toggleMenu}
        toggleAside={toggleAside}
        isMenuOpen={isMenuOpen}
        isAsideOpen={isAsideOpen}
        menuItems={leftMenuTree}
      />

      <TitleHeader
        title={frontmatter.title}
        subTitle={frontmatter.subTitle}
        icon={frontmatter.icon}
      />

      <Content id="maincontent">
        <Article>
          <Stack justifyContent="space-between">
            {frontmatter.publishDate && (
              <time dateTime={frontmatter.publishDate}>
                {formatISODate(new Date(frontmatter.publishDate))}
              </time>
            )}
            <div>author: {frontmatter.author}</div>
          </Stack>
          {children}

          <BottomPageSection
            editLink={frontmatter.editLink}
            navigation={frontmatter.navigation}
          />
        </Article>
      </Content>
      <Footer />
    </BaseTemplate>
  );
};

Blog.displayName = 'Blog';
