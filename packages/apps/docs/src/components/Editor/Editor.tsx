import type { OnMount } from '@monaco-editor/react';
import MNEditor from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import type { FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorLine } from './ErrorLine';
import { SuccessLine } from './SuccessLine';

interface IConsoleLine {
  type: 'error' | 'success';
  message: string | object;
}

interface IMessage {
  data: string;
}

export const Editor: FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [socket, setSocket] = useState<WebSocket>();
  const [consoleContent, setConsoleContent] = useState<IConsoleLine[]>([]);

  const setMessage = useCallback(
    (event: IMessage) => {
      const msg = JSON.parse(event.data);
      if (msg.error) {
        setConsoleContent((v) => [...v, { type: 'error', message: msg.error }]);
      }
      if (msg.stderr) {
        setConsoleContent((v) => [
          ...v,
          { type: 'error', message: msg.stderr },
        ]);
      }
      if (msg.stdout) {
        setConsoleContent((v) => [
          ...v,
          { type: 'error', message: msg.stdout },
        ]);
      }
    },
    [setConsoleContent],
  );

  const connect = useCallback((): void => {
    if (!process.env.NEXT_PUBLIC_PACTSERVER) {
      console.warn('no ws server defined');
      return;
    }
    const ws = new WebSocket(process.env.NEXT_PUBLIC_PACTSERVER);

    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });
    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      setTimeout(() => {
        console.log('WebSocket connection retrying...');
        connect();
      }, 1000);
    });

    ws.addEventListener('message', setMessage);

    setSocket(ws);
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  const handleEditorDidMount: OnMount = (editor): void => {
    editorRef.current = editor;
  };

  const handleEditorChange = (input?: string): void => {
    if (!input) return;

    const lastChar = input.at(-1);
    if (socket && lastChar === '\n') {
      socket.send(input);
    }
  };

  return (
    <>
      <MNEditor
        theme="vs-dark"
        height="250px"
        width="100%"
        saveViewState={false}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      ></MNEditor>
      <div>
        {consoleContent.map((item, idx) => {
          if (item.type === 'success')
            return (
              <SuccessLine key={idx}>
                {JSON.stringify(item.message, null, 2)}
              </SuccessLine>
            );
          return (
            <ErrorLine key={idx}>
              {JSON.stringify(item.message, null, 2)}
            </ErrorLine>
          );
        })}
      </div>
    </>
  );
};
