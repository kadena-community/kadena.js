import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Pact from 'pact-lang-api';
import yaml from 'yaml';
import CommandPact from '../components/common/Command/components/CommandPact/CommandPact';
import CommandSigning from '../components/common/Command/components/CommandSigning/CommandSigning';
import CommandNetwork from '../components/common/Command/components/CommandNetwork/CommandNetwork';
import CommandMetaData from '../components/common/Command/components/CommandMetaData/CommandMetaData';
import CommandEnvData from '../components/common/Command/components/CommandEnvData/CommandEnvData';
import { NetworkName } from '../utils/api';
import {
  MAIN_TX_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { NetworkContext } from './app';
import { useNodeInfo } from './api';
import { getPactHost, isHexadecimal } from 'utils';

type ComponentInfo = {
  Component: FC<any>;
  props: Record<string, any>;
};

const makeCommandRequestHeader = (cmd: any) => {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(cmd),
  };
};

export const useCommand = () => {
  const [activeTab, setActiveTab] = useState<string>('pact');

  const { network, setNetwork } = useContext(NetworkContext);
  const nodeInfo = useNodeInfo(network);

  const [caps, setCaps] = useState<string[]>(['(coin.GAS)']);
  const [sig, setSig] = useState<'signature' | 'pair'>('signature');
  const [sigText, setSigText] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [pactCode, setPactCode] = useState<string>('');
  const [pubKey, setPubKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [chainId, setChainId] = useState<string>('0');
  const [creationTime, setCreationTime] = useState<number>(
    Math.round(new Date().getTime() / 1000) - 15,
  );
  const [ttl, setTtl] = useState<number>(28800);
  const [gasPrice, setGasPrice] = useState<number>(0.00001);
  const [gasLimit, setGasLimit] = useState<number>(1500);
  const [envKeys, setEnvKeys] = useState<string[]>([]);
  const [pred, setPred] = useState<string>('');
  const [ksName, setKsName] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [gas, setGas] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [cmd, setCmd] = useState<string>('');
  const [reqKey, setReqKey] = useState<string>('');
  const [rkWarn, setRkWarn] = useState<boolean>(false);
  const [txFail, setTxFail] = useState<boolean>(false);
  const [txPending, setTxPending] = useState<boolean>(false);
  const [pollRes, setPollRes] = useState<any>('');
  const [canSend, setCanSend] = useState<boolean>(false);
  const [showSendTab, setShowSendTab] = useState<boolean>(false);

  const formatCaps = useCallback((capsParam: string[]) => {
    return capsParam.map((cap: string) => {
      cap = cap.replace('(', '').replace(')', '');
      const stringSplits = cap.split(' ');
      return {
        name: stringSplits.shift(),
        args: stringSplits.map(str =>
          Number.isNaN(str)
            ? str.replace('"', '').replace('"', '')
            : str.includes('.')
            ? parseFloat(str)
            : { int: str },
        ),
      };
    });
  }, []);

  const showCmd = useCallback(() => {
    if (nodeInfo) {
      try {
        const cmdJSON = Pact.api.prepareExecCmd(
          pubKey && privateKey
            ? [
                {
                  publicKey: pubKey,
                  secretKey: privateKey,
                  clist: formatCaps(caps),
                },
              ]
            : [],
          creationTime.toString(),
          pactCode.replace('\n', ''),
          ksName !== '' ? { [ksName]: { pred, keys: envKeys } } : {},
          Pact.lang.mkMeta(
            account,
            chainId,
            gasPrice,
            gasLimit,
            creationTime,
            ttl,
          ),
          nodeInfo.instance,
        );
        if (sig === 'signature' && cmdJSON.sigs[0]) {
          cmdJSON.sigs[0].sig = sigText;
        }
        return JSON.stringify(cmdJSON);
      } catch (e) {
        return (e as Error).message;
      }
    }
    return 'Enter a valid keypair to preview JSON request (or click generate)';
  }, [
    nodeInfo,
    pactCode,
    formatCaps,
    caps,
    sig,
    sigText,
    network,
    account,
    pubKey,
    privateKey,
    chainId,
    ttl,
    gasPrice,
    gasLimit,
    envKeys,
    pred,
    ksName,
    rkWarn,
    creationTime,
  ]);

  useEffect(() => {
    setCmd(showCmd());
  }, [showCmd]);

  const host = useMemo(() => {
    if (!chainId) {
      return 'Select Chain Id';
    }
    if (nodeInfo && chainId) {
      return getPactHost(network, nodeInfo.version, nodeInfo.instance, chainId);
    }
    return '';
  }, [nodeInfo, network, chainId]);

  const server = useMemo(() => {
    switch (network) {
      case NetworkName.MAIN_NETWORK:
        return `${MAIN_TX_NETWORK_API_URL}`;
      case NetworkName.TEST_NETWORK:
        return `${TEST_NETWORK_API_URL}`;
      default:
        return `${MAIN_TX_NETWORK_API_URL}`;
    }
  }, [network]);

  const checkKey = useCallback(key => {
    if (key.length !== 64) {
      return false;
    }
    return isHexadecimal(key);
  }, []);

  const generateAccount = useCallback(() => {
    const kp = Pact.crypto.genKeyPair();
    setAccount('fake-account');
    setPubKey(kp.publicKey);
    setPrivateKey(kp.secretKey);
  }, []);

  const curlCmd = useMemo(() => {
    return `curl -sk -H "Content-Type: application/json" -d '${cmd}' -X POST ${
      !host ? 'Select Chain Id' : host + '/api/v1/local'
    }`;
  }, [cmd, host]);

  const yamlCmd = useMemo(() => {
    try {
      const doc = new yaml.Document();
      doc.contents = JSON.parse(cmd);
      return doc.toString();
    } catch (e) {
      return '';
    }
  }, [cmd]);

  const chainIds = useMemo(
    () => [
      { key: '0', value: '0', label: '0' },
      { key: '1', value: '1', label: '1' },
      { key: '2', value: '2', label: '2' },
      { key: '3', value: '3', label: '3' },
      { key: '4', value: '4', label: '4' },
      { key: '5', value: '5', label: '5' },
      { key: '6', value: '6', label: '6' },
      { key: '7', value: '7', label: '7' },
      { key: '8', value: '8', label: '8' },
      { key: '9', value: '9', label: '9' },
      { key: '10', value: '10', label: '10' },
      { key: '11', value: '11', label: '11' },
      { key: '12', value: '12', label: '12' },
      { key: '13', value: '13', label: '13' },
      { key: '14', value: '14', label: '14' },
      { key: '15', value: '15', label: '15' },
      { key: '16', value: '16', label: '16' },
      { key: '17', value: '17', label: '17' },
      { key: '18', value: '18', label: '18' },
      { key: '19', value: '19', label: '19' },
    ],
    [],
  );

  const predicates = useMemo(
    () => [
      { key: '0', value: 'keys-all', label: 'keys-all' },
      { key: '1', value: 'keys-any', label: 'keys-any' },
    ],
    [],
  );

  const publicKeyUpload = useCallback((keyFile: File) => {
    try {
      if (keyFile.name.substring(keyFile.name.length - 4) !== '.kda') {
        alert('file must be a .kda key file');
      } else {
        const fileReader = new FileReader();
        fileReader.onload = fileLoadedEvent => {
          const textFromFileLoaded: string | undefined = fileLoadedEvent?.target
            ?.result as string | undefined;
          if (textFromFileLoaded) {
            const keys = textFromFileLoaded.split('\n');
            if (keys.length > 0) {
              setPubKey(keys[0].replace('public: ', ''));
            }
            if (keys.length > 1) {
              setPrivateKey(keys[1].replace('secret: ', ''));
            }
          }
        };
        fileReader.readAsText(keyFile, 'UTF-8');
      }
    } catch (err) {
      alert(`file must be a .kda key file`);
    }
  }, []);

  const pollCall = useCallback(
    async rk => {
      try {
        const pactResult = await Pact.fetch.listen({ listen: rk }, host);
        setTxPending(false);
        setTxFail(pactResult.result.status === 'failure');
        setPollRes(pactResult);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    [host],
  );

  const localCall = useCallback(async () => {
    try {
      setReqKey('');
      setRkWarn(false);
      setTxFail(false);
      setTxPending(false);
      setPollRes('');
      setLoading(true);
      setResult('');
      setMessage('');
      setShowSendTab(false);
      const parsedCmd = JSON.parse(cmd);
      const txRes = await fetch(
        `${host}/api/v1/local`,
        makeCommandRequestHeader(parsedCmd),
      );
      const tsResult = await txRes.json();
      setLoading(false);
      if (tsResult.result.status === 'failure') {
        setResult('TX preview failed');
        setMessage(tsResult.result.error.message);
        setGas('');
      } else {
        setResult('TX preview successful');
        setMessage('Result: ' + JSON.stringify(tsResult.result.data));
        setGas((tsResult.gas * gasPrice).toString());
        setCanSend(true);
      }
    } catch (e) {
      setLoading(false);
      setResult('Check your inputs');
      if (pactCode === '') {
        setMessage('Enter some Pact code');
        setGas('');
      } else if (chainId === '') {
        setMessage('Set Chain ID');
        setGas('');
      } else if (
        (e as Error).message === 'Unexpected token V in JSON at position 0'
      ) {
        setMessage(
          'Make sure you signed after you filled in the rest of the txdetail details',
        );
        setGas('');
      } else {
        setMessage((e as Error).message);
        setGas('');
      }
    }
  }, [chainId, gasPrice, pactCode, host, cmd]);

  const sendCall = useCallback(async () => {
    setCanSend(false);
    try {
      setRkWarn(false);
      setSendLoading(true);
      setShowSendTab(true);
      const parsedCmd = JSON.parse(cmd);
      const sendCmd = {
        cmds: [parsedCmd],
      };
      const txRes = await fetch(
        `${host}/api/v1/send`,
        makeCommandRequestHeader(sendCmd),
      );
      const text = await txRes.text();
      if (text.substring(0, 10).toLowerCase() === 'validation') {
        setSendLoading(false);
        setReqKey(text);
        setRkWarn(true);
      } else {
        const requestKey = JSON.parse(text);
        setReqKey(requestKey.requestKeys[0]);
        setSendLoading(false);
        setTxPending(true);
        pollCall(requestKey.requestKeys[0]);
      }
    } catch (e) {
      setSendLoading(false);
      setReqKey(
        "Your requested txdetail's inputs failed to validate. If your preview is succeeding and you are seeing this message it is because SEND TRANSACTIONS MUST BE SIGNED",
      );
      setRkWarn(true);
    }
  }, [cmd, host, pollCall]);

  const onPactCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPactCode(e.target.value);
    },
    [],
  );

  const onSigningComplete = useCallback((values: any) => {
    setAccount(values.account);
    setPubKey(values.publicKey);
    setPrivateKey(values.privateKey);
    setSigText(values.signatureKey);
    setCaps(values.capabilities);
    setSig(values.keyType);
  }, []);

  const onCompleteNetwork = useCallback((values: any) => {
    setChainId(values.chainId);
  }, []);

  const onCompleteMeta = useCallback((values: any) => {
    setGasPrice(values.gasPrice);
    setGasLimit(values.gasLimit);
    setCreationTime(values.creationTime);
    setTtl(values.ttl);
  }, []);

  const onCompleteEnv = useCallback((values: any) => {
    setKsName(values.keyName);
    setPred(values.predicate);
    setEnvKeys(values.envKeys);
  }, []);

  const commandInfo: Record<string, ComponentInfo> = useMemo(
    () => ({
      pact: {
        Component: CommandPact,
        props: { pactCode, onPactCodeChange },
      },
      signing: {
        Component: CommandSigning,
        props: {
          account,
          publicKey: pubKey,
          privateKey,
          signatureKey: sigText,
          capabilities: caps,
          onSelectKeyFile: publicKeyUpload,
          onGenerateKeys: generateAccount,
          onSigningComplete,
        },
      },
      network: {
        Component: CommandNetwork,
        props: {
          chainId,
          chainIds,
          server,
          instance: nodeInfo?.instance,
          onCompleteNetwork,
        },
      },
      metaData: {
        Component: CommandMetaData,
        props: {
          chainId,
          account,
          ttl,
          creationTime,
          gasPrice,
          gasLimit,
          onCompleteMeta,
        },
      },
      envData: {
        Component: CommandEnvData,
        props: {
          keyName: ksName,
          predicates,
          predicate: pred,
          envKeys,
          onCompleteEnv,
        },
      },
    }),
    [
      pactCode,
      onPactCodeChange,
      account,
      pubKey,
      privateKey,
      sigText,
      chainId,
      chainIds,
      server,
      host,
      nodeInfo,
      caps,
      gasLimit,
      gasPrice,
      creationTime,
      ttl,
      ksName,
      pred,
      envKeys,
      predicates,
      publicKeyUpload,
      onSigningComplete,
      generateAccount,
      onCompleteNetwork,
      onCompleteMeta,
      onCompleteEnv,
    ],
  );

  const isPreviewDisabled = useMemo(
    () => chainId === '' || pactCode === '',
    [chainId, pactCode],
  );

  const canSendTransaction = useMemo(
    () => canSend && checkKey(pubKey),
    [canSend, pubKey, checkKey],
  );

  const isSendDisabled = useMemo(
    () =>
      !canSendTransaction ||
      chainId === '' ||
      pactCode === '' ||
      account === '' ||
      pactCode === '' ||
      txPending,
    [chainId, pactCode, account, pactCode, canSendTransaction, txPending],
  );

  const isPreviewMode = useMemo(
    () => !canSendTransaction,
    [canSendTransaction],
  );

  return {
    activeTab,
    setActiveTab,
    isPreviewDisabled,
    isPreviewMode,
    isSendDisabled,
    previewTransaction: localCall,
    isSendMode: result === 'TX preview successful',
    sendTransaction: sendCall,
    componentInfo: commandInfo[activeTab],
    commandResult: {
      host,
      text: cmd,
      curl: curlCmd,
      yaml: yamlCmd,
    },
    transactionResult: {
      loading,
      result: pollRes
        ? JSON.stringify(pollRes.result.data)
        : result && message
        ? `${result}: ${message}`
        : '',
      pending: txPending,
      response: pollRes ? JSON.stringify(pollRes, null, '\t') : '',
      status: pollRes
        ? JSON.stringify(pollRes.result.status.replace('"', ''))
        : '',
      blockHeight: pollRes ? JSON.stringify(pollRes.metaData.blockHeight) : '',
      blockHash: pollRes ? JSON.stringify(pollRes.metaData.blockHash) : '',
      requestKey: rkWarn ? `Send Failure: ${reqKey}` : reqKey,
      pollCurlCmd: rkWarn
        ? 'TX must make it to the mempool to see Poll Curl Command'
        : `curl -sk -H "Content-Type: application/json" -d '{"requestKeys": ["${reqKey}"]}' -X POST ${
            host ===
            `https://${server}/chainweb/0.0/${nodeInfo?.instance}/chain//pact`
              ? 'Select Chain Id'
              : nodeInfo?.instance === 'not a chainweb node'
              ? 'Select a valid Chainweb node'
              : host + '/api/v1/poll'
          }`,
      listenCurlCmd: rkWarn
        ? 'TX must make it to the mempool to see Listen Curl Command'
        : `curl -sk -H "Content-Type: application/json" -d '{"requestKeys": ["${reqKey}"]}' -X POST ${
            host ===
            `https://${server}/chainweb/0.0/${nodeInfo?.instance}/chain//pact`
              ? 'Select Chain Id'
              : nodeInfo?.instance === 'not a chainweb node'
              ? 'Select a valid Chainweb node'
              : host + '/api/v1/listen'
          }`,
    },
  };
};
