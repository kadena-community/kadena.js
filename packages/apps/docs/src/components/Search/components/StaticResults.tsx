import { filePathToRoute } from '@/pages/api/semanticsearch';
import { Box, Heading, Text, useDialog } from '@kadena/react-ui';
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
          <Text size="smallest" bold={idx === 0} key={str + idx}>
            {removeHashFromString(str)} {idx < urlArray.length - 1 ? ' / ' : ''}
          </Text>
        );
      })}
    </>
  );
};

const Item: FC<IResultProps> = ({ item }) => {
  const { state } = useDialog();

  if (!item.filePath) return;

  const url = filePathToRoute(item.filePath, item.header);
  const content = item.content ?? '';

  return (
    <li>
      <Link href={url} passHref legacyBehavior>
        <a className={itemLinkClass} onClick={state.close}>
          <Heading as="h5" transform="uppercase">
            {item.title}
          </Heading>
          <ItemBreadCrumb url={url} />

          <Text as="p" variant="body">
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
    return <Box marginBlock="xxxl">No results</Box>;
  }

  return (
    <Box marginBlock="xxxl">
      <ul className={staticResultsListClass}>
        {limitedResults?.map((item) => {
          return <Item item={item} key={`${item.filePath} + ${item.header}`} />;
        })}
      </ul>
    </Box>
  );
};
