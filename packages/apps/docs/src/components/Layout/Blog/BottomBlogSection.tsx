import { Divider, Stack } from '@kadena/react-components';

//import { EditPage } from '../components/EditPage';
//import { Subscribe } from '../components/Subscribe';
import { BottomWrapper } from './styles';

import { INavigation, IPageMeta } from '@/types/Layout';
import Link from 'next/link';
import React, { FC } from 'react';
import { bottomWrapperClass, bottomWrapperVariants } from './Blog.css';
import { Grid } from '@kadena/react-ui';

interface IProps {
  frontmatter: IPageMeta;
  editLink?: string;
  navigation?: INavigation;
  layout?: 'default' | 'code';
}

export const BottomBlogSection: FC<IProps> = ({
  frontmatter,
  editLink,
  navigation,
  layout = 'default',
}) => {
  return (
    <BottomWrapper layout={layout}>
      <Grid.Root spacing={'xl'} columns={12}>
        <Grid.Item columnSpan={4}>
          <div className={bottomWrapperClass}>Author</div>
        </Grid.Item>

        <Grid.Item columnSpan={8}>
          <div className={bottomWrapperClass}>Articles</div>
        </Grid.Item>
      </Grid.Root>
    </BottomWrapper>
  );
};
