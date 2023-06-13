import { Stack, SystemIcons, TextField } from '@kadena/react-components';

import { ResultSection, SearchCode } from '@/components';
import { useConversation, useStream } from '@/hooks';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import debounce from 'lodash.debounce';
import MiniSearch, { SearchResult } from 'minisearch';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';

interface IQuery {
  q?: string;
}

const Search: FC = () => {
  const router = useRouter();
  const { q } = router.query as IQuery;
  const [query, setQuery] = useState<string | undefined>();
  const [isInitiated, setIsInitiated] = useState<boolean>(false);
  const [conversation, dispatch] = useConversation();
  const [startStream, isStreaming, outputStream, metadata] = useStream();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [staticSearchResults, setStaticSearchResults] = useState<
    SearchResult[]
  >([]);

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      dispatch({ type: 'commit', value: outputStream, metadata });
    }
  }, [isStreaming, outputStream, dispatch, metadata]);

  useEffect(() => {
    if (conversation.input.length > 0 && !isStreaming) {
      startStream(conversation.input, conversation);
    }
  }, [conversation, isStreaming, startStream]);

  useEffect(() => {
    if (Boolean(q) && query === undefined && !isInitiated) {
      setIsInitiated(true);
      setQuery(q);
    }
  }, [q, setQuery, query, setIsInitiated, isInitiated]);

  const updateQuery = useCallback(
    async (value: string): Promise<void> => {
      setQuery(value);
      await router.push(`${router.route}?q=${value}`);
    },
    [router],
  );

  const loadSearchResults = async (value: string): Promise<void> => {
    const results = await import('./../../data/searchIndex.json');

    const index = MiniSearch.loadJSON(JSON.stringify(results.default), {
      fields: ['title', 'content'],
      storeFields: ['title', 'content'],
    });

    const data = index.search(value, { prefix: true, fuzzy: 0.3 });

    setStaticSearchResults(data);
  };

  const updateQueryDebounced = useMemo(() => {
    return debounce(updateQuery, 500);
  }, [updateQuery]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { currentTarget } = event;
      const value = currentTarget.value;

      updateQueryDebounced(value);
    },
    [updateQueryDebounced],
  );

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();
    if (query === null) return;

    const value = inputRef.current?.value ?? '';
    await updateQuery(value);
    dispatch({ type: 'setInput', value });

    await loadSearchResults(value);
  };

  const createLink = (file: string): string => {
    let complete = false;

    return file
      .split('/')
      .reverse()
      .reduce((acc: string[], val: string) => {
        const fileName = val.split('.')[0] as string;
        if (fileName.includes('index') || complete) return acc;
        if (fileName === 'docs') {
          complete = true;
        }
        acc.push(fileName);
        return acc;
      }, [])
      .reverse()
      .join('/');
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <TextField
          inputProps={{
            ref: inputRef,
            defaultValue: query,
            onChange,
            placeholder: 'Search',
            leftPanel: () => <SystemIcons.Magnify />,
            'aria-label': 'Search',
          }}
        />
      </form>

      <Stack>
        <ResultSection>
          <h2>output</h2>
          {conversation?.history.map((interaction, index, conversation) => (
            <>
              {interaction.input}
              <ReactMarkdown components={{ code: SearchCode }}>
                {interaction.output}
              </ReactMarkdown>
              <div>
                {interaction?.metadata?.map((item, index) => {
                  const url = createLink(item.title);
                  return (
                    <>
                      <Link key={url} href={url}>
                        {url}
                      </Link>
                    </>
                  );
                })}
              </div>
            </>
          ))}
          <div>{outputStream}</div>
        </ResultSection>

        <ResultSection>
          <ul>
            {staticSearchResults.map((item) => {
              return (
                <li key={item.id}>
                  <Link href={createLink(item.filename)}>{item.title}</Link>
                </li>
              );
            })}
          </ul>
        </ResultSection>
      </Stack>
    </section>
  );
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Search',
        menu: 'Search',
        label: 'Search',
        order: 0,
        description: 'We will find stuff for u',
        layout: 'landing',
        icon: 'KadenaOverview',
      },
    },
  };
};

export default Search;
