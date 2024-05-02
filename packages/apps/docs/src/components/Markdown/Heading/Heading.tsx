import { createSlug } from '@/utils/createSlug';
import { MonoLink } from '@kadena/react-icons';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { headerClassVariants, headerIconLinkClass } from './styles.css';

type TagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface IProp {
  as: TagType;
  variant?: TagType;
  children: ReactNode;
}

export interface IHeader {
  children: string;
}

export const TaggedHeading: FC<IProp> = ({ children, as, variant }) => {
  let slugInputStr = '';

  if (Array.isArray(children)) {
    slugInputStr = [children]
      .flat()
      .map((child) => {
        if (typeof child === 'string') return child.trim();
        if (typeof child.props.children === 'string')
          return child.props.children.trim();
        return '';
      })
      .filter((child) => child !== '') // remove empty strings to avoid join adding extra spaces
      .join(' ');
  } else if (typeof children === 'string') {
    slugInputStr = children;
  }

  const slug = createSlug(slugInputStr);

  const content = (
    <>
      {children}
      <a className={headerIconLinkClass} id={slug} href={`#${slug}`}>
        <MonoLink />
      </a>
    </>
  );

  const headingVariant = headerClassVariants[variant ?? as];
  switch (as) {
    case 'h2':
      return <h2 className={headingVariant}>{content}</h2>;
    case 'h3':
      return <h3 className={headingVariant}>{content}</h3>;
    case 'h4':
      return <h4 className={headingVariant}>{content}</h4>;
    case 'h5':
      return <h5 className={headingVariant}>{content}</h5>;
    case 'h6':
      return <h6 className={headingVariant}>{content}</h6>;
    case 'h1':
    default:
      return <h1 className={headingVariant}>{content}</h1>;
  }
};
