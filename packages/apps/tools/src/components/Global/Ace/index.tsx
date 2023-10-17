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
import 'ace-builds/src-noconflict/ext-searchbox';

import type { KeyboardHandler, Mode, Theme } from './helper';
import { containerStyle } from './styles.css';

export interface IEditorProps
  extends Pick<IAceEditorProps, 'width' | 'height' | 'onChange' | 'readOnly'> {
  code: IAceEditorProps['value'];
  keyboardHandler?: KeyboardHandler;
  theme?: Theme;
  mode?: Mode;
}

const AceViewerComponent: FC<IEditorProps> = ({
  code,
  width,
  height,
  readOnly,
  onChange,
  keyboardHandler,
  theme,
  mode,
}) => (
  <div className={containerStyle}>
    <AceEditor
      value={code}
      width={width || '94%'}
      height={height || '40rem'}
      readOnly={readOnly !== false}
      onChange={onChange}
      keyboardHandler={keyboardHandler}
      showPrintMargin={false}
      theme={theme}
      mode={mode}
      name="ace-editor"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
      fontSize={14}
    />
  </div>
);

export default AceViewerComponent;
