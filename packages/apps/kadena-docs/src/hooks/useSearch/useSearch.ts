import { IConversation, useConversation } from './useConversation';
import { useStream } from './useStream';
import { loadSearchResults } from './utils';

import { SearchResult } from 'minisearch';
import { useRouter } from 'next/router';
import {
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface IQuery {
  q?: string;
}

interface IProps {
  //eslint-disable-next-line @rushstack/no-new-null
  searchInputRef: MutableRefObject<HTMLInputElement | null>;
  handleSubmit: (evt: FormEvent<HTMLFormElement>) => Promise<void>;
  outputStream: string;
  query: string | undefined;
  staticSearchResults: SearchResult[];
  conversation: IConversation;
}

export const useSearch = (): IProps => {
  const [conversation, dispatch] = useConversation();
  const [startStream, isStreaming, outputStream, metadata] = useStream();
  const router = useRouter();
  const { q } = router.query as IQuery;
  const [query, setQuery] = useState<string | undefined>(q);

  const [staticSearchResults, setStaticSearchResults] = useState<
    SearchResult[]
  >([]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const updateQuery = useCallback(
    async (value: string): Promise<void> => {
      setQuery(value);
      await router.push(`${router.route}?q=${value}`);
    },
    [router],
  );

  const startSearch = useCallback(
    async (value: string): Promise<void> => {
      if (value === null) return;
      dispatch({ type: 'setInput', value });
      await loadSearchResults(value, setStaticSearchResults);
    },
    [dispatch, setStaticSearchResults],
  );

  // const updateQueryDebounced = useMemo(() => {
  //   return debounce(updateQuery, 500);
  // }, [updateQuery]);

  // const handleInputChange = (event: Event): void => {
  //   const { currentTarget } = event as unknown as ChangeEvent<HTMLInputElement>;
  //   const value = currentTarget.value;

  //   updateQueryDebounced(value);
  // };

  useEffect(() => {
    if (q !== undefined) {
      setQuery(q);
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      startSearch(q);
    }
  }, [q, startSearch]);

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      dispatch({ type: 'commit', value: outputStream, metadata });
    }
  }, [isStreaming, outputStream, dispatch, metadata]);

  useEffect(() => {
    if (conversation.input.length > 0) {
      startStream(conversation.input, conversation);

      //setQuery('');
    }
  }, [conversation.input, conversation, startStream]);

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();
    if (query === null) return;

    const value = searchInputRef.current?.value ?? '';
    await updateQuery(value);

    await startSearch(value);
  };

  return {
    searchInputRef,
    handleSubmit,
    outputStream,
    query,
    staticSearchResults,
    conversation,
  };
};
