import { Card, Divider, Stack, TabItem, Tabs, Text } from '@kadena/kode-ui';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import jsonHighlight from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';
import React, { useEffect, useRef } from 'react';
import { TrackedFunction } from '../hooks/functionTracker';
import { useWalletState } from '../state/wallet';
import {
  sdkDisplayCode,
  sdkDisplayContainer,
} from './sdkFunctionDisplayer.css';

interface SdkFunctionDisplayProps {
  data: TrackedFunction;
}

const HighlightBlock: React.FC<{ data: string; language: string }> = ({
  data,
  language,
}) => {
  const elRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (elRef.current) hljs.highlightElement(elRef.current);
  }, []);
  return (
    <pre className={sdkDisplayCode}>
      <code ref={elRef} className={`language-${language}`}>
        {data}
      </code>
    </pre>
  );
};

const SdkFunctionDisplay: React.FC<SdkFunctionDisplayProps> = (props) => {
  const { name, args, response } = props.data ?? { args: null };
  const codeString = `${name}(${JSON.stringify(args, null, 2).slice(1, -1)});`;

  const { debugMode } = useWalletState();

  useEffect(() => {
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('json', jsonHighlight);
  }, []);

  if (!debugMode) return null;
  if (args === null) return null;

  return (
    <div className={sdkDisplayContainer}>
      <Card fullWidth>
        <Stack flexDirection="column" gap="sm">
          <Text>SDK Function Call</Text>
          <Divider />
          {response ? (
            <Tabs defaultSelectedKey="request" isContained>
              <TabItem title="Request" key="request">
                <HighlightBlock data={codeString} language="javascript" />
              </TabItem>
              <TabItem title="Response" key="response">
                <HighlightBlock
                  data={JSON.stringify(response.data, null, 2)}
                  language="json"
                />
              </TabItem>
            </Tabs>
          ) : (
            <HighlightBlock data={codeString} language="javascript" />
          )}
        </Stack>
      </Card>
    </div>
  );
};

export default SdkFunctionDisplay;
