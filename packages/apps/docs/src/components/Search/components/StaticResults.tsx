import { Box, Heading, Text, useModal } from '@kadena/react-ui';

import { itemLink, staticResultsList } from '../styles.css';

import { createLinkFromMD } from '@/utils';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  results: ISearchResult[];
  limitResults?: number;
}

interface IResultProps {
  item: ISearchResult;
}
interface IBreadCrumbProps {
  url: string;
}

const ItemBreadCrumb: FC<IBreadCrumbProps> = ({ url }) => {
  const urlArray = url.split('/');

  return (
    <>
      {urlArray.map((str, idx) => {
        return (
          <Text size="sm" bold={idx === 0} key={str + idx}>
            {str} {idx < urlArray.length - 1 ? ' / ' : ''}
          </Text>
        );
      })}
    </>
  );
};

const Item: FC<IResultProps> = ({ item }) => {
  const url = createLinkFromMD(item.filePath);
  const { clearModal } = useModal();

  return (
    <li>
      <Link href={url} passHref legacyBehavior>
        <a className={itemLink} onClick={clearModal}>
          <Heading color="primaryContrast" as="h5">
            {item.title}
          </Heading>
          <ItemBreadCrumb url={url} />

          <Text as="p">{item.description}</Text>
        </a>
      </Link>
    </li>
  );
};

export const StaticResults: FC<IProps> = ({ results, limitResults }) => {
  const limitedResults =
    limitResults !== undefined ? results.slice(0, limitResults) : results;

  return (
    <Box marginY="$10">
      <ul className={staticResultsList}>
        {limitedResults.map((item) => {
          return <Item item={item} key={item.id} />;
        })}
      </ul>
    </Box>
  );
};
