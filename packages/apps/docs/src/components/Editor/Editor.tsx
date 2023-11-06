import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/theme-github_dark';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import AceEditor from 'react-ace';
import { isArray } from 'redoc';
import { ErrorLine } from './ErrorLine';
import { SuccessLine } from './SuccessLine';
import { consoleClass, editorClass } from './styles.css';
import { cleanOutput } from './utils';

interface IConsoleLine {
  type: 'error' | 'success';
  message: string | object;
}

interface IMessage {
  data: string;
}

export const Editor: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket>();
  const [consoleContent, setConsoleContent] = useState<IConsoleLine[]>([]);
  const [value, setValue] = useState<string>();
  const editorRef = useRef<AceEditor>(null);
  const [isMounted, setIsMounted] = useState(false);

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
    if (editorRef.current && value && !isMounted) {
      const editor = editorRef.current.editor;
      console.log(1111);
      const row = editor.session.getLength() - 1;
      const column = editor.session.getLine(row).length; // or simply Infinity

      editor.gotoLine(row + 1, column, true);
      setIsMounted(true);
    }
  }, [editorRef, value]);

  const getContent = (child: any): ReactNode => {
    if (!child) return;
    if (
      typeof child === 'string' ||
      typeof child === 'number' ||
      typeof child === 'boolean'
    ) {
      if (child === '# interactive') return '';

      return child;
    }

    if (isArray(child.props?.children)) {
      return child.props?.children.map((item: any) => getContent(item));
    }
    return getContent(child.props?.children);
  };

  useEffect(() => {
    console.log(children);
    if (React.isValidElement(children)) return;
    const content = React.Children.map(children, (child) => getContent(child));

    setValue(content?.join(''));
  }, [children]);

  const onChange = (v: string): void => {
    setValue(v);
    socket?.send(v);
  };

  return (
    <>
      <AceEditor
        ref={editorRef}
        mode="lisp"
        focus
        fontSize={14}
        theme="github_dark"
        showGutter={false}
        onChange={onChange}
        debounceChangePeriod={300}
        name="UNIQUE_ID_OF_DIV"
        keyboardHandler="normal"
        className={editorClass}
        maxLines={Infinity}
        value={value}
      />
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
