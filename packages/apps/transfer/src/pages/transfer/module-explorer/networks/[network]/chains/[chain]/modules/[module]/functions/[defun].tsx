import { Pact, signWithChainweaver, getClient, isSignedCommand } from '@kadena/client';
import { Button } from '@kadena/react-components';

import { Container, EditorGrid } from './styles';

import Debug from 'debug';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import ScopedEval from 'scoped-eval';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

const FunctionPage = () => {
  Debug('kadena-transfer:pages:transfer:module-explorer:module:function');
  const { t } = useTranslation('common');
  const [snippet, setSnippet] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [log, setLog] = useState('');
  const [timestamp, setTimestamp] = useState(0);
  const router = useRouter();
  const { network, chain, module, defun } = router.query;

  useEffect(() => {
    setOutput(`${output}\n${log}`.trim());
  }, [timestamp]);

  const Logger = {
    log(data: string) {
      setLog(data);
      setTimestamp(new Date().getTime());
    },
  };

  const runSnippet = () => {
    setOutput('');
    const scopedEval = new ScopedEval();
    console.log(code);
    scopedEval.eval(code, { Pact, getClient, signWithChainweaver, isSignedCommand, Logger });
  };

  useEffect(() => {
    if (!network || !chain || !module || !defun) {
      return;
    }

    const fetchSnippet = async (): Promise<void> => {
      const snippetUrl = `https://raw.githubusercontent.com/jessevanmuijden/snippets/main/networks/${network}/chains/${chain}/modules/${module}/functions/${defun}.js`;
      const response = await fetch(snippetUrl);
      if (response.status === 200) {
        const body = await response.text();
        setSnippet(body);
      }
    };

    fetchSnippet().catch(console.error);
  }, [chain, module, network, defun]);

  return (
    <Container>
      <h1>
        {t('Function')}: {defun}
      </h1>
      <h5>
        {t('Module')}: {module}
      </h5>
      <h5>
        {t('Network')}: {network}
      </h5>
      <h5>
        {t('Chain')}: {chain}
      </h5>
      <EditorGrid>
        <div>
          <h3 style={{ float: 'left' }}>{t('JavaScript')}</h3>
          <Button
            style={{ float: 'right' }}
            title={t('Run')}
            onClick={runSnippet}
          >
            {t('Run')}
          </Button>
          <>
            {snippet.length && (
              <Button
                style={{ marginRight: '2rem', float: 'right' }}
                title={t('Load example code')}
                onClick={() => setCode(snippet)}
              >
                {t('Load example code')}
              </Button>
            )}
          </>
          <AceViewer code={code} width={'100%'} readonly={false} onChange={(value: string) => setCode(value)} />
        </div>
        <div>
          <h3>{t('Output')}</h3>
          <AceViewer code={output} width={'100%'} />
        </div>
      </EditorGrid>
    </Container>
  );
};

export default FunctionPage;
