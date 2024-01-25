import type { ITag } from '@kadena/docs-tools';
import { Box, Card } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { BrowseSection } from '../BrowseSection/BrowseSection';
import { headingClass, itemClass, itemLinkClass } from './styles.css';

export const TagListItem: FC<ITag> = ({ tag, count, links }) => {
  return (
    <li className={itemClass}>
      <Card fullWidth>
        <Link
          className={itemLinkClass}
          href={`/tags/${encodeURIComponent(tag)}`}
        >
          <h2 className={headingClass}>
            {tag} ({count})
          </h2>
        </Link>
        <Box marginBlockStart="md">
          <BrowseSection title="Latest posts">
            {links &&
              links.map((link) => (
                <Link key={link.root} href={link.root}>
                  {link.title}
                </Link>
              ))}
          </BrowseSection>
        </Box>
      </Card>
    </li>
  );
};
