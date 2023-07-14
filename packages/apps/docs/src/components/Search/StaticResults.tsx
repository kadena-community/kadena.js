import { Box, Heading, Text } from '@kadena/react-ui';

import { StaticResultsList, StyledItem, StyledListItem } from './styles';

import { createLinkFromMD } from '@/utils';
import { SearchResult } from 'minisearch';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  results: SearchResult[];
  limitResults?: number;
}

interface IResultProps {
  item: SearchResult;
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
  const url = createLinkFromMD(item.filename);
  return (
    <StyledListItem>
      <Link href={url} passHref legacyBehavior>
        <StyledItem key={item.id}>
          <Heading color="primaryContrast" as="h5">
            {item.title}
          </Heading>
          <ItemBreadCrumb url={url} />

          <Text as="p">{item.description}</Text>
        </StyledItem>
      </Link>
    </StyledListItem>
  );
};

export const StaticResults: FC<IProps> = ({ results, limitResults }) => {
  const limitedResults =
    limitResults !== undefined ? results.slice(0, limitResults) : results;

  return (
    <Box marginY="$10">
      <StaticResultsList>
        {limitedResults.map((item) => {
          return <Item item={item} key={item.id} />;
        })}
      </StaticResultsList>
    </Box>
  );
};
