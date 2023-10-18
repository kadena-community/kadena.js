import { filePathToRoute } from '@/pages/api/semanticsearch';
import { Box, Heading, Text, useModal } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { IQueryResult } from '../../../types';
import { itemLinkClass, staticResultsListClass } from '../styles.css';

interface IProps {
  results: IQueryResult[] | undefined;
  limitResults?: number;
}

interface IResultProps {
  item: IQueryResult;
}

interface IBreadCrumbProps {
  url: string;
}

const removeHashFromString = (str: string): string => {
  return str.split('#')[0];
};

const ItemBreadCrumb: FC<IBreadCrumbProps> = ({ url }) => {
  const urlArray = url.split('/');

  return (
    <>
      {urlArray.map((str, idx) => {
        return (
          <Text size="sm" bold={idx === 0} key={str + idx}>
            {removeHashFromString(str)} {idx < urlArray.length - 1 ? ' / ' : ''}
          </Text>
        );
      })}
    </>
  );
};

const Item: FC<IResultProps> = ({ item }) => {
  const { clearModal } = useModal();

  if (!item.filePath) return;

  const url = filePathToRoute(item.filePath, item.header);
  const content = item.content ?? '';

  return (
    <li>
      <Link href={url} passHref legacyBehavior>
        <a className={itemLinkClass} onClick={clearModal}>
          <Heading color="primaryContrastInverted" as="h5">
            {item.title}
          </Heading>
          <ItemBreadCrumb url={url} />

          <Text as="p">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ReactMarkdown rehypePlugins={[rehypeRaw] as any}>
              {content}
            </ReactMarkdown>
          </Text>
        </a>
      </Link>
    </li>
  );
};

export const StaticResults: FC<IProps> = ({ results, limitResults }) => {
  const limitedResults =
    results && limitResults !== undefined
      ? results.slice(0, limitResults)
      : results;

  if (results?.length === 0) {
    return <Box marginY="$10">No results</Box>;
  }

  return (
    <Box marginY="$10">
      <ul className={staticResultsListClass}>
        {limitedResults?.map((item) => {
          return <Item item={item} key={`${item.filePath} + ${item.header}`} />;
        })}
      </ul>
    </Box>
  );
};
