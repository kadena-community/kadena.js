// eslint-disable-next-line simple-import-sort/imports
import React from 'react';
import type { FC } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/ext-language_tools';

export interface IOnchange {
  (value: string): void;
}

export interface IAceEditorProps {
  code?: string;
  width?: string;
  height?: string;
  readonly?: boolean;
  onChange?: IOnchange;
}

const AceViewerComponent: FC<IAceEditorProps> = ({
  code,
  width,
  height,
  readonly,
  onChange,
}) => (
  <AceEditor
    mode="clojure"
    theme="one_dark"
    name="ace-editor"
    value={code}
    onChange={onChange}
    editorProps={{ $blockScrolling: true }}
    setOptions={{
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 2,
    }}
    width={width || '94%'}
    height={height || '40rem'}
    style={{ margin: '0 auto' }}
    fontSize={14}
    showPrintMargin={false}
    readOnly={readonly !== false}
  />
);

export default AceViewerComponent;
