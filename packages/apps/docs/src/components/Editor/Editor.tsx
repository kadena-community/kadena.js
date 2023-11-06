import type { OnMount } from '@monaco-editor/react';
import MNEditor, { useMonaco } from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorLine } from './ErrorLine';
import { SuccessLine } from './SuccessLine';
import { consoleClass } from './styles.css';
import { cleanOutput } from './utils';

interface IConsoleLine {
  type: 'error' | 'success';
  message: string | object;
}

interface IMessage {
  data: string;
}

export const Editor: FC<PropsWithChildren> = ({ children }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [socket, setSocket] = useState<WebSocket>();
  const [consoleContent, setConsoleContent] = useState<IConsoleLine[]>([]);

  const setMessage = useCallback(
    (event: IMessage) => {
      const msg = JSON.parse(event.data);
      if (msg.error) {
        console.log(msg.error);
        setConsoleContent((v) => [...v, { type: 'error', message: msg.error }]);
      }
      if (msg.stderr) {
        console.log(msg.stderr);
        setConsoleContent((v) => [
          { type: 'error', message: msg.stderr },
          ...v,
        ]);
      }
      if (msg.stdout) {
        console.log(msg.stdout);
        setConsoleContent((v) => [
          { type: 'success', message: msg.stdout },
          ...v,
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

  useEffect(() => {
    console.log(1, editor);
    editor?.onKeyUp((event) => {
      if (event.keyCode === 3 && editorRef.current?.getValue()) {
        socket?.send(editorRef.current?.getValue());
      }
    });
  }, [socket, editor]);

  const handleEditorDidMount: OnMount = (editor): void => {
    console.log(111, editor);
    editorRef.current = editor;
    setEditor(editor);
  };

  return (
    <>
      <MNEditor
        theme="vs-dark"
        height="250px"
        width="100%"
        saveViewState={false}
        onMount={handleEditorDidMount}
        defaultValue={`(+ 1 1)\n(* 2 2)`}
      ></MNEditor>
      <div className={consoleClass}>
        {consoleContent.map((item, idx) => {
          if (item.type === 'success')
            return (
              <SuccessLine key={idx}>{cleanOutput(item.message)}</SuccessLine>
            );
          return <ErrorLine key={idx}>{cleanOutput(item.message)}</ErrorLine>;
        })}
      </div>
    </>
  );
};
