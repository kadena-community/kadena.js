import type { IConversation } from './useConversation';

import type { StreamMetaData } from '@7-docs/edge';
import { getDelta, splitTextIntoSentences } from '@7-docs/edge';
import { useCallback, useEffect, useState } from 'react';

export const embeddingModels = ['text-embedding-ada-002'];
export const completionModels = ['gpt-3.5-turbo', 'text-davinci-003'];

type StartStream = (query: string, conversation: IConversation) => void;

export const useStream = (): [
  StartStream,
  boolean,
  string,
  undefined | StreamMetaData[],
] => {
  const [outputStream, setOutputStream] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [metadata, setMetadata] = useState<undefined | StreamMetaData[]>(
    undefined,
  );

  const startStream = useCallback(
    (query: string, conversation: IConversation): void => {
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

      const done = (): void => {
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
          //@TODO: add error message in UI
          console.error(error);
          done();
        }
      });

      source.addEventListener('metadata', (event) => {
        try {
          const data = JSON.parse(event.data);
          setMetadata(data);
        } catch (error) {
          //@TODO: add error message in UI
          console.error(error);
        }
      });

      source.addEventListener('error', (error) => {
        //@TODO: add error message in UI
        console.log(error);
        done();
      });
    },
    [],
  );

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      setOutputStream('');
    }
  }, [isStreaming, outputStream]);

  return [startStream, isStreaming, outputStream, metadata];
};
