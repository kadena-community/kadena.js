import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-one_dark';

import React, { FC } from 'react';
import AceEditor from 'react-ace';

export interface AceEditorProps {
  code?: string;
}

const AceViewerComponent: FC<AceEditorProps> = ({ code }) => {
  return (
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
      width="95%"
      style={{ margin: '0 auto' }}
      fontSize={14}
      showPrintMargin={false}
      readOnly={true}
      height="40rem"
    />
  );
};

export default AceViewerComponent;
