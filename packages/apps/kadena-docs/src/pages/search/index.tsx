import { SystemIcons, TextField } from '@kadena/react-components';

import { useConversation, useStream } from '@/hooks';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import debounce from 'lodash.debounce';
import { GetStaticProps } from 'next';
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

      <h2>output</h2>
      {conversation?.history.map((interaction, index, conversation) => (
        <>
          {interaction.input}
          <div>{interaction.output}</div>
          <div>
            {interaction?.metadata?.map((item, index) => {
              return (
                <>
                  <a href={item.url}>{item.title}</a>
                </>
              );
            })}
          </div>
        </>
      ))}
      <div>{outputStream}</div>
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
