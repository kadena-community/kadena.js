import type { Conversation } from './useConversation';

import type { StreamMetaData } from '@7-docs/edge';
import { getDelta, splitTextIntoSentences } from '@7-docs/edge';
import { useCallback, useEffect, useState } from 'react';

type StartStream = (query: string, conversation: Conversation) => void;

export const useStream = (): [
  StartStream,
  boolean,
  string,
  null | StreamMetaData[],
] => {
  const [outputStream, setOutputStream] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [metadata, setMetadata] = useState<null | StreamMetaData[]>(null);

  const embeddingModels = ['text-embedding-ada-002'];
  const completionModels = ['gpt-3.5-turbo', 'text-davinci-003'];

  const startStream = useCallback(
    function (query: string, conversation: Conversation) {
      const searchParams = new URLSearchParams();

      searchParams.set('query', encodeURIComponent(query));
      conversation.history.forEach((interaction) => {
        searchParams.append(
          'previousQueries',
          encodeURIComponent(interaction.input),
        );
        const sentences = splitTextIntoSentences(interaction.output);
        searchParams.append(
          'previousResponses',
          encodeURIComponent(sentences.slice(0, 2).join(' ')),
        );
      });

      searchParams.set('embedding_model', embeddingModels[0]);
      searchParams.set('completion_model', completionModels[0]);

      const url = '/api/search?' + searchParams.toString();

      const source = new EventSource(url);

      setIsStreaming(true);

      const done = () => {
        setIsStreaming(false);
        source.close();
      };

      source.addEventListener('message', (event) => {
        try {
          if (event.data.trim() === '[DONE]') {
            done();
          } else {
            const data = JSON.parse(event.data);
            const text = getDelta(data);
            if (text) setOutputStream((v) => v + text);
          }
        } catch (error) {
          console.log(event);
          console.error(error);
          done();
        }
      });

      source.addEventListener('metadata', (event) => {
        console.log('meta', event);
        try {
          const data = JSON.parse(event.data);
          setMetadata(data);
        } catch (error) {
          console.log(event);
          console.error(error);
        }
      });

      source.addEventListener('error', (error) => {
        console.log(error);
        done();
      });
    },
    [setIsStreaming, setOutputStream],
  );

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      setOutputStream('');
    }
  }, [isStreaming, outputStream]);

  return [startStream, isStreaming, outputStream, metadata];
};
