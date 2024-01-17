import type { IMenuData } from '@kadena/docs-tools';
import { Link } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { StripItem } from './StripItem';
import { stripClass, stripWrapper } from './styles.css';

interface IProps {
  data: IMenuData[];
  link?: string;
  linkLabel?: string;
}

export const BlogPostsStrip: FC<IProps> = ({ data, link, linkLabel }) => {
  return (
    <section className={stripWrapper}>
      <ul className={stripClass}>
        {data.map((post) => (
          <StripItem key={post.root} post={post} />
        ))}
      </ul>

      {link && <Link href={link}>{linkLabel}</Link>}
    </section>
  );
};
