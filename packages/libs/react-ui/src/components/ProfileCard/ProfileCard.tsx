import {
  boldTextClass,
  imageClass,
  imageContainerClass,
  linkClass,
  linkContainerClass,
  profileCardClass,
  tagClass,
  tagContainerClass,
} from './ProfileCard.css';

import { Grid } from '@components/Grid';
import { Tag } from '@components/Tag';
import React, { type FC } from 'react';

export default {};
export interface IProfileCardProps {
  name: string;
  title: string;
  imageSrc: string;
  tags?: string[];
  links?: Record<string, string>;
}

export const ProfileCard: FC<IProfileCardProps> = ({
  name,
  title,
  imageSrc,
  tags = undefined,
  links = undefined,
}) => {
  return (
    <div className={profileCardClass}>
      <Grid.Root columns={12}>
        <Grid.Item columnSpan={2}>
          <div className={imageContainerClass}>
            <img className={imageClass} src={imageSrc} alt={name} />
          </div>
        </Grid.Item>
        <Grid.Item columnSpan={10}>
          <p className={boldTextClass}>{name}</p>
          <p>{title}</p>

          {tags && (
            <ul className={tagContainerClass}>
              {tags.map((tag, i) => (
                <li className={tagClass} key={i}>
                  <Tag key={i}>{tag}</Tag>
                </li>
              ))}
            </ul>
          )}

          {links && (
            <>
              <p className={boldTextClass}>Links</p>
              <ul className={linkContainerClass}>
                {Object.entries(links).map(([text, href]) => (
                  <li key={text}>
                    <a className={linkClass} href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Grid.Item>
      </Grid.Root>
    </div>
  );
};
