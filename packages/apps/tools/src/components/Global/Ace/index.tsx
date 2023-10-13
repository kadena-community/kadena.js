// eslint-disable-next-line simple-import-sort/imports
import React from 'react';
import type { FC } from 'react';
import AceEditor from 'react-ace';
import type { IAceEditorProps } from 'react-ace';

import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/ext-language_tools';
import type { KeyboardHandler } from './helper';

export interface IEditorProps
  extends Pick<IAceEditorProps, 'width' | 'height' | 'onChange' | 'readOnly'> {
  code: IAceEditorProps['value'];
  keyboardHandler?: KeyboardHandler;
}

const AceViewerComponent: FC<IEditorProps> = ({
  code,
  width,
  height,
  readOnly,
  onChange,
  keyboardHandler,
}) => (
  <AceEditor
    value={code}
    width={width || '94%'}
    height={height || '40rem'}
    readOnly={readOnly !== false}
    onChange={onChange}
    keyboardHandler={keyboardHandler}
    showPrintMargin={false}
    // mode="clojure"
    theme="monokai"
    name="ace-editor"
    editorProps={{ $blockScrolling: true }}
    setOptions={{
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 2,
    }}
    fontSize={14}
  />
);

export default AceViewerComponent;
