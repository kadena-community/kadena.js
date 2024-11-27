import { Card, Divider, Stack, Text } from '@kadena/kode-ui';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';
import React, { useEffect, useRef } from 'react';
import { useWalletState } from '../state/wallet';
import {
  sdkDisplayCode,
  sdkDisplayContainer,
} from './sdkFunctionDisplayer.css';

interface SdkFunctionDisplayProps {
  functionName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functionArgs: any;
}

const SdkFunctionDisplay: React.FC<SdkFunctionDisplayProps> = ({
  functionName,
  functionArgs,
}) => {
  const codeString = `${functionName}(${JSON.stringify(
    functionArgs,
    null,
    2,
  )});`;

  const { debugMode } = useWalletState();
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    hljs.registerLanguage('javascript', javascript);
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [codeString, debugMode]);

  if (!debugMode) return null;

  return (
    <div className={sdkDisplayContainer}>
      <Card fullWidth>
        <Stack flexDirection="column" gap="sm">
          <Text>SDK Function Call</Text>
          <Divider />
          <pre className={sdkDisplayCode}>
            <code ref={codeRef} className="language-javascript">
              {codeString}
            </code>
          </pre>
        </Stack>
      </Card>
    </div>
  );
};

export default SdkFunctionDisplay;
