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

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      dispatch({ type: 'commit', value: outputStream, metadata });
    }
  }, [isStreaming, outputStream]);

  useEffect(() => {
    if (conversation.input.length > 0 && !isStreaming) {
      startStream(conversation.input, conversation);
    }
  }, [conversation.input]);

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  useEffect(() => {
    if (Boolean(q) && query === undefined && !isInitiated) {
      setIsInitiated(true);
      setQuery(q);
    }
  }, [q, setQuery, query, setIsInitiated, isInitiated]);

  const updateQuery = useMemo(() => {
    const update = async (value: string): Promise<void> => {
      setQuery(value);
      await router.push(`${router.route}?q=${value}`);
    };

    return debounce(update, 500);
  }, [router]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { currentTarget } = event;
      const value = currentTarget.value;

      updateQuery(value);
    },
    [updateQuery],
  );

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!query) return;
    dispatch({ type: 'setInput', value: query });
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <TextField
          inputProps={{
            defaultValue: query,
            onChange,
            placeholder: 'Search',
            leftPanel: () => <SystemIcons.Magnify />,
            'aria-label': 'Search',
          }}
        />
      </form>
      <div>{query}</div>

      <h2>input</h2>
      {conversation.input ? <div>{conversation.input}</div> : null}

      <h2>output</h2>
      {conversation?.history.map((interaction, index, conversation) => (
        <>
          {interaction.input}
          <div>{interaction.output}</div>
          <div>
            {interaction.metadata.map((item, index) => {
              return (
                <>
                  <a href={item.url}>{item.title}</a>
                  {index + 1 < interaction.metadata.length ? ' ● ' : null}
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
