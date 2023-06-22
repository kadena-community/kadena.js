// eslint-disable-next-line simple-import-sort/imports
import React, { FC } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/ext-language_tools';

export interface IAceEditorProps {
  code?: string;
}

const AceViewerComponent: FC<IAceEditorProps> = ({ code }) => (
  <AceEditor
    mode="clojure"
    theme="one_dark"
    name="ace-editor"
    value={code}
    editorProps={{ $blockScrolling: true }}
    setOptions={{
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 2,
    }}
    width="94%"
    style={{ margin: '0 auto' }}
    fontSize={14}
    showPrintMargin={false}
    readOnly={true}
    height="40rem"
  />
);

export default AceViewerComponent;
