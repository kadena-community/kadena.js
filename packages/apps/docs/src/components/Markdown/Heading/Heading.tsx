import { SystemIcon } from '@kadena/react-ui';

import {
  headerClassVariants,
  headerIconLinkClass,
  headerIconLinkHoveredClass,
} from './styles.css';

import { createSlug } from '@/utils';
import React, { FC, ReactNode, useState } from 'react';

type TagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface IProp {
  as: TagType;
  variant?: TagType;
  children: ReactNode;
  index?: number;
  parentTitle?: string;
}

export interface IHeader {
  children: string;
}

export const TaggedHeading: FC<IProp> = ({
  children,
  as,
  variant,
  index,
  parentTitle,
}) => {
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

  const slug = createSlug(slugInputStr, index, parentTitle);

  // vanilla-extract doesn't support styling subcomponents
  // globalStyle doesn't support simple pseudo selectors
  // only way around the hover behavior is via state + variants
  const [linkHoverVariant, setLinkHoverVariant] = useState<boolean>(false);

  const onMouseOver = (): void => {
    setLinkHoverVariant(true);
  };

  const onMouseLeave = (): void => {
    setLinkHoverVariant(false);
  };

  const ArticleLink = (
    <a
      className={
        linkHoverVariant ? headerIconLinkHoveredClass : headerIconLinkClass
      }
      id={slug}
      href={`#${slug}`}
    >
      <SystemIcon.Link />
    </a>
  );
  switch (as) {
    case 'h2':
      return (
        <h2
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerClassVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h2>
      );
    case 'h3':
      return (
        <h3
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerClassVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h3>
      );
    case 'h4':
      return (
        <h4
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerClassVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h4>
      );
    case 'h5':
      return (
        <h5
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerClassVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h5>
      );
    case 'h6':
      return (
        <h6
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerClassVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h6>
      );
    case 'h1':
    default:
      return (
        <h1
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onFocus={() => {}}
          className={headerClassVariants[variant ?? as]}
        >
          {children}
          {ArticleLink}
        </h1>
      );
  }
};
