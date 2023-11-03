import type { OnMount } from '@monaco-editor/react';
import MNEditor from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';

export const Editor: FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket>();

  const connect = () => {
    const ws = new WebSocket('ws://localhost:3000');

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
    ws.addEventListener('message', (event) => {
      console.log(`msg: ${JSON.stringify(JSON.parse(event.data), null, 2)}`);
    });

    setSocket(ws);
  };

  useEffect(() => {
    connect();
  }, []);

  const handleEditorDidMount: OnMount = (editor): void => {
    editorRef.current = editor;
  };

  const handleEditorChange = (input?: string): void => {
    if (socket && input) {
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
      <div ref={consoleRef}></div>
    </>
  );
};
