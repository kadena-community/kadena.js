import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-one_dark';

import { token } from '@kadena/react-ui/styles';
import type { FC } from 'react';
import React from 'react';
import type { IAceEditorProps } from 'react-ace';
import type { KeyboardHandler, Mode, Theme } from './helper';
import { containerStyle } from './styles.css';

export interface IEditorProps
  extends Pick<IAceEditorProps, 'width' | 'height' | 'onChange' | 'readOnly'> {
  code: IAceEditorProps['value'];
  keyboardHandler?: KeyboardHandler;
  theme?: Theme;
  mode: Mode;
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
      width={width || '100%'}
      height={height || '100%'}
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
        fontFamily: token('typography.family.monospaceFont'),
      }}
      fontSize={14}
    />
  </div>
);

export default AceViewerComponent;
