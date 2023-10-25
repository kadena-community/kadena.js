import { Tag } from '@components/Tag';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import {
  boldTextClass,
  containerClass,
  imageClass,
  linkContainerClass,
  tagClass,
  tagContainerClass,
} from './ProfileSummary.css';
import type { IProfileSummaryLinkProps } from './ProfileSummaryLink';

export interface IProfileSummaryRootProps {
  name: string;
  title: string;
  imageSrc: string;
  tags?: string[];
  children: FunctionComponentElement<IProfileSummaryLinkProps>[];
}

export const ProfileSummaryRoot: FC<IProfileSummaryRootProps> = ({
  name,
  title,
  imageSrc,
  tags = undefined,
  children,
}) => {
  return (
    <div className={containerClass}>
      <img className={imageClass} src={imageSrc} alt={name} />
      <div>
        <span className={boldTextClass}>{name}</span>
        <span>{title}</span>

        {tags && (
          <ul className={tagContainerClass}>
            {tags.map((tag, i) => (
              <li className={tagClass} key={i}>
                <Tag key={i}>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}

        {children && (
          <>
            <span className={boldTextClass}>Links</span>
            <ul className={linkContainerClass}>{children}</ul>
          </>
        )}
      </div>
    </div>
  );
};
