import { useConversation } from './useConversation';
import { useStream } from './useStream';
import { loadSearchResults } from './utils';

import debounce from 'lodash.debounce';
import MiniSearch, { SearchResult } from 'minisearch';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
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

interface IProps {}

export const useSearch: IProps = () => {
  const [conversation, dispatch] = useConversation();
  const [startStream, isStreaming, outputStream, metadata] = useStream();
  const router = useRouter();
  const { q } = router.query as IQuery;
  const [query, setQuery] = useState<string | undefined>();
  const [isInitiated, setIsInitiated] = useState<boolean>(false);
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

  const updateQueryDebounced = useMemo(() => {
    return debounce(updateQuery, 500);
  }, [updateQuery]);

  const handleInputChange = (event: Event): void => {
    const { currentTarget } = event as unknown as ChangeEvent<HTMLInputElement>;
    const value = currentTarget.value;

    updateQueryDebounced(value);
  };

  useEffect(() => {
    if (!searchInputRef.current) return;
    searchInputRef.current?.addEventListener('keyup', handleInputChange);

    return () =>
      searchInputRef.current?.removeEventListener('keyup', handleInputChange);
  }, [searchInputRef.current, handleInputChange]);

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      dispatch({ type: 'commit', value: outputStream, metadata });
    }
  }, [isStreaming, outputStream, dispatch, metadata]);

  useEffect(() => {
    console.log(conversation);
    if (
      conversation.input &&
      conversation.history.length === 0 &&
      !isStreaming
    ) {
      startStream(conversation.input, conversation);
    }
  }, [conversation, isStreaming, startStream]);

  useEffect(() => {
    if (Boolean(q) && !isInitiated) {
      setIsInitiated(true);
      setQuery(q);
    }
  }, [q, setQuery, query, setIsInitiated, isInitiated]);

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();
    if (query === null) return;

    const value = searchInputRef.current?.value ?? '';
    await updateQuery(value);
    dispatch({ type: 'setInput', value });

    await loadSearchResults(value, setStaticSearchResults);
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
