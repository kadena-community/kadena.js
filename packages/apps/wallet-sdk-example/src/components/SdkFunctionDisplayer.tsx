import { Card, Divider, Stack, Text } from '@kadena/kode-ui';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';
import React, { useEffect, useRef } from 'react';
import { useWalletState } from '../state/wallet';

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
  }, [codeString]);

  if (!debugMode) return null;

  return (
    <div style={{ marginTop: '20px', width: '100%' }}>
      <Card fullWidth>
        <Stack flexDirection="column" gap="sm">
          <Text>SDK Function Call</Text>
          <Divider />
          <pre style={{ margin: 0 }}>
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
