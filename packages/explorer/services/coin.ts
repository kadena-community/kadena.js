import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// @ts-ignore
import Pact from 'pact-lang-api';
import { useRouter } from 'next/router';
import Transfer from '../components/common/Coin/components/Transfer/Transfer';
import ChainTransfer, {
  IUnfinishedChains,
} from '../components/common/Coin/components/ChainTransfer/ChainTransfer';
import CheckBalance from '../components/common/Coin/components/CheckBalance/CheckBalance';
import KeyPair from '../components/common/Coin/components/KeyPair/KeyPair';
import { downloadFile } from '../utils/file';
import { NetworkContext } from './app';
import { convertDecimal, getPactHost, isPrivateKey } from '../utils/string';
import { useNodeInfo } from './api';
import { isCrossChainTransaction, NetworkName } from '../utils/api';
import {
  MAIN_TX_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { wait } from '../utils/async';

type ComponentInfo = {
  Component: FC<any>;
  props: Record<string, any>;
};

export enum ActiveTab {
  transfer = 'transfer',
  finish = 'finish',
  balance = 'balance',
  generate = 'generate',
}

export const useCoin = (activeTabProp?: ActiveTab) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    activeTabProp || (router?.query?.tab as ActiveTab) || ActiveTab.transfer,
  );

  useEffect(() => {
    if (router?.query?.tab) {
      setActiveTab(String(router?.query?.tab) as ActiveTab);
    }
  }, [router?.query]);

  const { network } = useContext(NetworkContext);
  const nodeInfo = useNodeInfo(network);

  const onGenerateKey = useCallback(async event => {
    event.preventDefault();
    const kp = Pact.crypto.genKeyPair();
    const id = kp.publicKey.substring(0, 6);
    const privateFileContent = `public: ${kp.publicKey}\nsecret: ${kp.secretKey}`;
    const privateFileName = `private-keypair-${id}.kda`;
    downloadFile(
      privateFileContent,
      privateFileName,
      'text/plain;charset=utf-8',
    );
  }, []);

  const [chainValues, setChainValues] = useState<
    { balance: string; guard: string; chainId: string }[]
  >([]);
  const [accountName, setAccountName] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('coin');
  const [requestKey, setRequestKey] = useState<string>('');
  const [sender, setSender] = useState<string>('');
  const [receiver, setReceiver] = useState<string>('');
  const [sourceChainId, setSourceChainId] = useState<string>('');
  const [targetChainId, setTargetChaind] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [rg, setRg] = useState<string>('');
  const [transferFinishResult, setTransferFinishResult] = useState<any>(null);
  const [transferResult, setTransferResult] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string>('');
  const [predicate, setPredicate] = useState<string>('keys-all');
  const [signature, setSignature] = useState<string>('');
  const [signatureHash, setSignatureHash] = useState<string>('');
  const [cmd, setCmd] = useState<any>(null);

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

  const onGetBalance = useCallback(async () => {
    if (nodeInfo) {
      const chainValuesResponse: {
        balance: string;
        guard: string;
        chainId: string;
      }[] = await Promise.all(
        (nodeInfo?.chainIds || []).map(async (chainId: string) => {
          let balance = '';
          let guard = '';
          try {
            const response = await Pact.fetch.local(
              {
                pactCode: `(${tokenName}.details "${accountName}")`,
                meta: Pact.lang.mkMeta(
                  'not-real',
                  chainId,
                  0.00000001,
                  6000,
                  Math.round(new Date().getTime() / 1000) - 15,
                  600,
                ),
              },
              getPactHost(
                network,
                nodeInfo.version,
                nodeInfo.instance,
                chainId,
              ),
            );
            const result = response.result;
            const bal = result.data
              ? typeof result.data.balance === 'number'
                ? result.data.balance
                : result.data.balance.decimal
                ? result.data.balance.decimal
                : 0
              : 0;

            if (result.status === 'success') {
              balance = bal;
              try {
                const { pred, keys } = result.data.guard;
                guard =
                  pred +
                  '\r\n' +
                  keys.reduce(
                    (accum: any, key: any) =>
                      JSON.stringify(key) + '\r\n' + accum,
                    '',
                  );
              } catch {
                if (result.data.guard.keysetref) {
                  try {
                    const keyResponse = await Pact.fetch.local(
                      {
                        pactCode: `(describe-keyset "${result.data.guard.keysetref}")`,
                        meta: Pact.lang.mkMeta(
                          'not-real',
                          chainId,
                          0.00000001,
                          6000,
                          Math.round(new Date().getTime() / 1000) - 15,
                          600,
                        ),
                      },
                      getPactHost(
                        network,
                        nodeInfo.version,
                        nodeInfo.instance,
                        chainId,
                      ),
                    );
                    const { pred, keys } = keyResponse.result.data;
                    guard =
                      pred +
                      '\r\n' +
                      keys.reduce(
                        (accum: any, key: any) =>
                          JSON.stringify(key) + '\r\n' + accum,
                        '',
                      );
                  } catch {
                    guard = JSON.stringify(result.data.guard);
                  }
                } else {
                  guard = JSON.stringify(result.data.guard);
                }
              }
            } else if (
              result.status === 'failure' &&
              result.error.message.slice(0, 24) === 'with-read: row not found'
            ) {
              balance = 'N/A';
              guard = "Doesn't Exist";
            } else {
              balance = 'N/A';
              guard = 'Request Failed';
            }
          } catch (e) {
            balance = 'N/A';
            guard = 'Request Failed';
          }
          return {
            chainId,
            balance,
            guard,
          };
        }),
      );
      chainValuesResponse.sort(
        (itemA, itemB) => Number(itemA.chainId) - Number(itemB.chainId),
      );
      setChainValues(chainValuesResponse);
    }
  }, [network, nodeInfo, tokenName, accountName]);

  const totalBalance = useMemo(() => {
    const totalBalanceValue: number = chainValues
      .filter(item => !Number.isNaN(item.balance || 0))
      .map(item => Number(item.balance))
      .reduce((sum, a) => sum + a, 0);
    return totalBalanceValue || 0;
  }, [chainValues]);

  const chainBalanceData = useMemo(
    () =>
      [
        accountName
          ? {
              title: 'Total Balance',
              items: [{ name: `Account: ${accountName}`, value: totalBalance }],
            }
          : null,
        ...(chainValues || []).map(chainItem => ({
          title: `Chain ${chainItem.chainId}`,
          items: [
            { name: 'Guard', value: chainItem.guard },
            { name: 'Balance', value: chainItem.balance },
          ],
        })),
      ].filter(item => !!item),
    [chainValues, accountName, totalBalance],
  );

  const onCompleteBalance = useCallback((values: any) => {
    setTokenName(values.token);
    setAccountName(values.account);
  }, []);

  const onCompleteKey = useCallback((values: any) => {
    setRequestKey(values.requestKey);
    setSourceChainId(values.sourceChainId);
    setTargetChaind(values.targetChainId);
  }, []);

  const findSrcChain = useCallback(async () => {
    if (nodeInfo) {
      const pactId =
        requestKey.length === 44 ? requestKey.slice(0, 43) : requestKey;
      const pactArray = await Promise.all(
        (nodeInfo?.chainIds || []).map(async (chainIdProp: string) => {
          const pactInfo = await Pact.fetch.poll(
            { requestKeys: [pactId] },
            getPactHost(
              network,
              nodeInfo.version,
              nodeInfo.instance,
              chainIdProp,
            ),
          );
          if (pactInfo[pactId]) {
            return { chainId: chainIdProp, tx: pactInfo[pactId] };
          }
          return null;
        }),
      );
      return pactArray.filter(item => !!item) as { chainId: string; tx: any }[];
    }
    return [];
  }, [nodeInfo, requestKey]);

  const getPact = useCallback(async () => {
    if (
      nodeInfo?.instance &&
      (requestKey.length === 43 ||
        (requestKey.length === 44 && requestKey[43] === '='))
    ) {
      const requestKeys: { chainId: string; tx: any }[] = await findSrcChain();
      if (requestKeys.length > 0) {
        try {
          const source = requestKeys[0].chainId;
          const tx = requestKeys[0].tx;
          const [senderProp, receiverProp, g, targetProp, amountProp] =
            tx.continuation.continuation.args;
          setSourceChainId(source);
          setTargetChaind(targetProp);
          setSender(senderProp);
          setReceiver(receiverProp);
          setRg(JSON.stringify(g));
          setAccountName(amountProp);
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    }
  }, [nodeInfo, requestKey, findSrcChain]);

  useEffect(() => {
    getPact();
  }, [getPact]);

  const getProof = useCallback(async () => {
    if (sourceChainId && nodeInfo) {
      const pactId =
        requestKey.length === 44 ? requestKey.slice(0, 43) : requestKey;
      const spvCmd = { targetChainId, requestKey: pactId };
      const host = `${getPactHost(
        network,
        nodeInfo.version,
        nodeInfo.instance,
        sourceChainId,
      )}/spv`;
      try {
        const response = await fetch(host, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(spvCmd),
        });
        if (response.ok) {
          return await response.json();
        }
        return await response.text();
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [requestKey, sourceChainId, targetChainId, network, nodeInfo]);

  const sendNonJson = useCallback(async (cmdValue: any, apiHost: string) => {
    if (!apiHost) throw new Error(`Pact.fetch.send(): No apiHost provided`);
    const command = Pact.simple.cont.createCommand(
      cmdValue.keyPairs,
      cmdValue.nonce,
      cmdValue.step,
      cmdValue.pactId,
      cmdValue.rollback,
      cmdValue.envData,
      cmdValue.meta,
      cmdValue.proof,
      cmdValue.networkId,
    );
    return fetch(`${apiHost}/api/v1/send`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(command),
    });
  }, []);

  const onFinishTransfer = useCallback(async () => {
    if (nodeInfo) {
      const proof = await getProof();
      if (proof && (typeof proof === 'string' || proof instanceof String)) {
        setTransferFinishResult({
          status: `Transfer Failed. ${proof}`,
          requestKey,
        });
        removeUnfinishedChain(requestKey);
      } else if (proof) {
        const pactId =
          requestKey.length === 44 ? requestKey.slice(0, 43) : requestKey;
        const host = getPactHost(
          network,
          nodeInfo.version,
          nodeInfo.instance,
          targetChainId,
        );
        const gasStation = 'free-x-chain-gas';
        const gasLimit = 400;
        const gasPrice =
          network === NetworkName.TEST_NETWORK ? 0.000000001 : 0.00000001;
        const meta = Pact.lang.mkMeta(
          gasStation,
          targetChainId,
          gasPrice,
          gasLimit,
          Math.round(new Date().getTime() / 1000) - 50,
          28800,
        );
        const contCmd = {
          type: 'cont',
          keyPairs: [],
          pactId,
          rollback: false,
          step: 1,
          meta,
          proof,
          networkId: nodeInfo.instance,
        };
        try {
          const result = await sendNonJson(contCmd, host);
          if (result.ok) {
            const resultJson = await result.json();
            const reqKey = resultJson.requestKeys[0];
            setTransferFinishResult({
              status: 'Transfer Pending...',
              requestKey: reqKey,
            });
            Pact.fetch
              .listen(
                { listen: reqKey },
                getPactHost(
                  network,
                  nodeInfo.version,
                  nodeInfo.instance,
                  targetChainId,
                ),
              )
              .then((listenResult: any) => {
                if (listenResult.result.status === 'success') {
                  setTransferFinishResult({
                    status: 'Transfer Successful',
                    requestKey: reqKey,
                  });
                } else {
                  setTransferFinishResult({
                    status: `Transfer Failed. ${listenResult.result.error.message}`,
                    requestKey: reqKey,
                  });
                }
                removeUnfinishedChain(reqKey);
              });
          } else {
            const resultText = await result.text();
            setTransferFinishResult({
              status: `Transfer Failed. ${result}`,
              requestKey,
            });
            removeUnfinishedChain(requestKey);
          }
        } catch (e) {
          setTransferFinishResult({
            status: `Transfer Failed.`,
            requestKey,
          });
          removeUnfinishedChain(requestKey);
        }
      } else {
        removeUnfinishedChain(requestKey);
      }
    }
  }, [requestKey, network, nodeInfo, targetChainId]);

  const onCompleteTransferValues = useCallback((values: any) => {
    setSender(values.sender);
    setAmount(values.amount);
    setReceiver(values.receiver);
    setSignature(values.signature);
    setSourceChainId(values.sourceChainId);
    setTargetChaind(values.targetChainId);
    setPublicKey(values.publicKey);
    setPredicate(values.predicate);
  }, []);

  const crossTransfer = useCallback(() => {
    if (nodeInfo) {
      const meta = Pact.lang.mkMeta(
        sender,
        sourceChainId,
        0.00001,
        600,
        Math.round(new Date().getTime() / 1000) - 50,
        28800,
      );
      const privKey =
        signature.length === 128 && isPrivateKey(signature)
          ? signature.slice(0, 64)
          : signature.length === 64
          ? signature
          : null;
      const keyPair = [{ publicKey, secretKey: privKey }];
      const pactCode = `(coin.transfer-crosschain ${JSON.stringify(
        sender,
      )} ${JSON.stringify(receiver)} (read-keyset "ks") ${JSON.stringify(
        targetChainId,
      )} ${convertDecimal(amount)})`;

      return Pact.simple.exec.createCommand(
        keyPair,
        JSON.stringify(new Date().toISOString()),
        pactCode,
        {
          ks: {
            keys: [publicKey],
            pred: predicate,
          },
        },
        meta,
        nodeInfo?.instance,
      );
    }
  }, [
    sender,
    sourceChainId,
    nodeInfo,
    amount,
    receiver,
    publicKey,
    predicate,
    signature,
    targetChainId,
  ]);

  const transferCreate = useCallback(() => {
    if (nodeInfo) {
      const meta = Pact.lang.mkMeta(
        sender,
        sourceChainId,
        0.00001,
        600,
        Math.round(new Date().getTime() / 1000) - 50,
        28800,
      );
      const privKey =
        signature.length === 128 && isPrivateKey(signature)
          ? signature.slice(0, 64)
          : signature.length === 64
          ? signature
          : null;
      const keyPair = [{ publicKey, secretKey: privKey }];
      const pactCode = `(coin.transfer-create ${JSON.stringify(
        sender,
      )} ${JSON.stringify(receiver)} (read-keyset "ks")  ${convertDecimal(
        amount,
      )})`;
      return Pact.simple.exec.createCommand(
        keyPair,
        JSON.stringify(new Date().toISOString()),
        pactCode,
        {
          ks: {
            keys: [publicKey],
            pred: predicate,
          },
        },
        meta,
        nodeInfo?.instance,
      );
    }
  }, [
    sender,
    sourceChainId,
    nodeInfo,
    amount,
    receiver,
    publicKey,
    predicate,
    signature,
  ]);

  const getTransferCmd = useCallback(() => {
    if (isCrossChainTransaction(sourceChainId, targetChainId)) {
      return crossTransfer();
    }
    return transferCreate();
  }, [signature, crossTransfer, transferCreate, sourceChainId, targetChainId]);

  useEffect(() => {
    if (signature) {
      const cmdValue = getTransferCmd();
      if (cmdValue) {
        setCmd(cmdValue);
        setSignatureHash(cmdValue.cmds[0].hash);
      }
    } else {
      setSignatureHash('');
    }
  }, [signature, getTransferCmd]);

  const onDoTransfer = useCallback(async () => {
    if (nodeInfo && sourceChainId) {
      let cmdValue = cmd;
      if (isPrivateKey(signature)) {
        cmdValue = getTransferCmd();
      } else if (!isPrivateKey(signature)) {
        const signed = Object.assign(cmdValue);
        signed.cmds[0].sigs = [{ sig: signature }];
        cmdValue = signed;
      }
      const txRes = await fetch(
        `${getPactHost(
          network,
          nodeInfo.version,
          nodeInfo.instance,
          sourceChainId,
        )}/api/v1/send`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(cmdValue),
        },
      );
      if (txRes.ok) {
        const res = await txRes.json();
        setTransferResult({
          status: 'Transfer Pending...',
          requestKey: res.requestKeys[0],
        });
        fetch(
          `${getPactHost(
            network,
            nodeInfo.version,
            nodeInfo.instance,
            sourceChainId,
          )}/api/v1/listen`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              listen: res.requestKeys[0],
            }),
          },
        )
          .then(listenResult => listenResult.json())
          .then(async listenJsonResult => {
            if (listenJsonResult.reqKey) {
              setUnfinishedChain({
                requestKey: listenJsonResult.reqKey,
                sourceChainId,
                targetChainId,
              });
            }
            if (listenJsonResult.result.status === 'failure') {
              setTransferResult({
                status: 'Transfer Failed',
                requestKey: listenJsonResult.reqKey,
              });
              removeUnfinishedChain(listenJsonResult.reqKey);
            } else if (listenJsonResult.continuation) {
              const pactId = listenJsonResult.continuation.pactId;
              setTransferResult({
                status: `Initiated from the Source Chain: ${JSON.stringify(
                  pactId,
                )}. Waiting for Proof...`,
                requestKey: listenJsonResult.reqKey,
              });
              const targetChainIdParam =
                listenJsonResult.continuation.yield.provenance.targetChainId;
              const spvCmd = {
                targetChainId: targetChainIdParam,
                requestKey: pactId,
              };
              let proof;
              while (!proof) {
                // eslint-disable-next-line no-await-in-loop
                await wait(2500);
                // eslint-disable-next-line no-await-in-loop
                const whileResult = await fetch(
                  `${getPactHost(
                    network,
                    nodeInfo.version,
                    nodeInfo.instance,
                    sourceChainId,
                  )}/spv`,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(spvCmd),
                  },
                );
                if (whileResult.ok) {
                  // eslint-disable-next-line no-await-in-loop
                  proof = await res.json();
                }
              }
              const meta = Pact.lang.mkMeta(
                'kadena-xchain-gas',
                targetChainId,
                0.00000001,
                400,
                Math.round(new Date().getTime() / 1000) - 50,
                28800,
              );
              const contCmd = {
                type: 'cont',
                keyPairs: [],
                pactId,
                rollback: false,
                step: 1,
                meta,
                proof,
                networkId: nodeInfo.instance,
              };
              const newCmdValue = Pact.simple.cont.createCommand(
                contCmd.keyPairs,
                undefined,
                contCmd.step,
                contCmd.pactId,
                contCmd.rollback,
                undefined,
                contCmd.meta,
                contCmd.proof,
                contCmd.networkId,
              );
              fetch(
                `${getPactHost(
                  network,
                  nodeInfo.version,
                  nodeInfo.instance,
                  targetChainId,
                )}/api/v1/send`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  method: 'POST',
                  body: JSON.stringify(newCmdValue),
                },
              ).then(async conTxResult => {
                if (conTxResult.ok) {
                  const conTxResultJson = await conTxResult.json();
                  setTransferResult({
                    status: `Initiated from the Source Chain: ${JSON.stringify(
                      pactId,
                    )}. Receiving from the Target Chain: ${
                      conTxResultJson.requestKeys[0]
                    }`,
                    requestKey: conTxResultJson.requestKeys[0],
                  });
                  fetch(
                    `${getPactHost(
                      network,
                      nodeInfo.version,
                      nodeInfo.instance,
                      targetChainId,
                    )}/api/v1/listen`,
                    {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      method: 'POST',
                      body: JSON.stringify({
                        listen: conTxResultJson.requestKeys[0],
                      }),
                    },
                  )
                    .then(conListenResult => conListenResult.json())
                    .then(async conListenResultJson => {
                      if (conListenResultJson.result.status === 'failure') {
                        setTransferResult({
                          status: `Transfer Failed`,
                          requestKey: conListenResultJson.reqKey,
                        });
                      } else {
                        setTransferResult({
                          status: `Transfer Successful`,
                          requestKey: conListenResultJson.reqKey,
                        });
                      }
                      removeUnfinishedChain(listenJsonResult.reqKey);
                    });
                } else {
                  const resultText = await conTxResult.text();
                  setTransferResult({
                    status: `Transfer Failed: ${resultText}`,
                    requestKey: '',
                  });
                  removeUnfinishedChain(listenJsonResult.reqKey);
                }
              });
            } else {
              setTransferResult({
                status: `Transfer Successful`,
                requestKey: listenJsonResult.reqKey,
              });
              removeUnfinishedChain(listenJsonResult.reqKey);
            }
          });
      } else {
        const resultText = await txRes.text();
        setTransferResult({
          status: `Transfer Failed: ${resultText}`,
          requestKey: '',
        });
      }
    }
  }, [
    sender,
    receiver,
    sourceChainId,
    targetChainId,
    amount,
    rg,
    signature,
    predicate,
    publicKey,
    cmd,
    getTransferCmd,
  ]);

  const checkPublicKey = useCallback(
    async (accountParam: string, chainId: string) => {
      if (nodeInfo && sender.length >= 3) {
        try {
          const m = Pact.lang.mkMeta(
            '',
            '',
            0.00001,
            600,
            Math.round(new Date().getTime() / 1000) - 50,
            28800,
          );
          return Pact.fetch.local(
            {
              pactCode: `(coin.details ${JSON.stringify(accountParam)})`,
              meta: m,
            },
            getPactHost(network, nodeInfo.version, nodeInfo.instance, chainId),
          );
        } catch (e) {
          return null;
        }
      } else {
        return null;
      }
    },
    [network, nodeInfo, sender, sourceChainId],
  );

  const getKeysetRef = useCallback(async (keyset: any, node: string) => {
    const m = Pact.lang.mkMeta(
      '',
      '',
      0.00001,
      600,
      Math.round(new Date().getTime() / 1000) - 50,
      28800,
    );
    return Pact.fetch.local(
      {
        pactCode: `(describe-keyset ${JSON.stringify(keyset)})`,
        meta: m,
      },
      node,
    );
  }, []);

  const fetchReceiverKeyset = useCallback(() => {
    if (nodeInfo) {
      checkPublicKey(receiver, targetChainId).then(res => {
        if (
          res &&
          res.result.status === 'failure' &&
          res.result.error.message.slice(0, 24) === 'with-read: row not found'
        ) {
        } else if (res.result.data.guard.keysetref) {
          getKeysetRef(
            res.result.data.guard.keysetref,
            getPactHost(
              network,
              nodeInfo.version,
              nodeInfo.instance,
              sourceChainId,
            ),
          ).then(resKeyset => {
            setPublicKey(resKeyset.result.data.keys);
          });
        } else if (res.result.data.guard.keys) {
          setPublicKey(res.result.data.keys);
        } else if (
          'fun' in res.result.data.guard &&
          'args' in res.result.data.guard
        ) {
          // Adds support for a very specific format of time locked accounts
          const guardFun = res.result.data.guard.fun;
          const [ksRef, afterDateFun] = res.result.data.guard.args;
          if (
            guardFun === 'util.guards.enforce-and' &&
            'keysetref' in ksRef &&
            afterDateFun.fun === 'util.guards.enforce-after-date'
          ) {
            getKeysetRef(
              ksRef.keysetref,
              getPactHost(
                network,
                nodeInfo.version,
                nodeInfo.instance,
                sourceChainId,
              ),
            ).then(resKeyset => {
              setPublicKey(resKeyset.result.data.keys);
            });
          }
        }
      });
    }
  }, [checkPublicKey, nodeInfo, targetChainId, network, receiver]);

  useEffect(() => {
    if (receiver && targetChainId) {
      fetchReceiverKeyset();
    } else {
      setPublicKey('');
    }
  }, [fetchReceiverKeyset, receiver, targetChainId]);

  const chainIds = useMemo(
    () => [
      { key: '0', value: '0', label: 'Chain 0' },
      { key: '1', value: '1', label: 'Chain 1' },
      { key: '2', value: '2', label: 'Chain 2' },
      { key: '3', value: '3', label: 'Chain 3' },
      { key: '4', value: '4', label: 'Chain 4' },
      { key: '5', value: '5', label: 'Chain 5' },
      { key: '6', value: '6', label: 'Chain 6' },
      { key: '7', value: '7', label: 'Chain 7' },
      { key: '8', value: '8', label: 'Chain 8' },
      { key: '9', value: '9', label: 'Chain 9' },
      { key: '10', value: '10', label: 'Chain 10' },
      { key: '11', value: '11', label: 'Chain 11' },
      { key: '12', value: '12', label: 'Chain 12' },
      { key: '13', value: '13', label: 'Chain 13' },
      { key: '14', value: '14', label: 'Chain 14' },
      { key: '15', value: '15', label: 'Chain 15' },
      { key: '16', value: '16', label: 'Chain 16' },
      { key: '17', value: '17', label: 'Chain 17' },
      { key: '18', value: '18', label: 'Chain 18' },
      { key: '19', value: '19', label: 'Chain 19' },
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

  const coinInfo: Record<string, ComponentInfo> = useMemo(
    () => ({
      transfer: {
        Component: Transfer,
        props: {
          sender,
          receiver,
          publicKey,
          amount,
          signature,
          signatureHash,
          chainData: chainIds,
          predicate,
          predicates,
          instance: nodeInfo?.instance || '',
          targetChainId,
          sourceChainId,
          onCompleteTransferValues,
          onDoTransfer,
        },
      },
      finish: {
        Component: ChainTransfer,
        props: {
          chainData: chainIds,
          sender,
          receiver,
          guard: rg,
          amount,
          targetChainId,
          sourceChainId,
          requestKey,
          server,
          instance: nodeInfo?.instance || '',
          onCompleteKey,
          onFinishTransfer,
          transferResult: transferFinishResult,
        },
      },
      balance: {
        Component: CheckBalance,
        props: {
          server,
          account: accountName,
          token: tokenName,
          onCompleteBalance,
          onCheckBalance: onGetBalance,
          chainBalanceData,
        },
      },
      generate: {
        Component: KeyPair,
        props: { onGenerateKey },
      },
    }),
    [
      nodeInfo,
      onGenerateKey,
      onGetBalance,
      server,
      onCompleteBalance,
      accountName,
      tokenName,
      chainBalanceData,
      requestKey,
      onCompleteKey,
      onFinishTransfer,
      sender,
      receiver,
      rg,
      amount,
      targetChainId,
      sourceChainId,
      publicKey,
      signature,
      transferResult,
      transferFinishResult,
      onCompleteTransferValues,
      onDoTransfer,
      signatureHash,
      chainIds,
      predicates,
      predicate,
    ],
  );

  return { activeTab, setActiveTab, componentInfo: coinInfo[activeTab] };
};

export const setUnfinishedChain = (chain: IUnfinishedChains) => {
  const unfinishedChains: IUnfinishedChains[] = JSON.parse(
    localStorage.getItem('unfinishedChains') || '[]',
  );

  unfinishedChains.push(chain);

  localStorage.setItem('unfinishedChains', JSON.stringify(unfinishedChains));
};

export const removeUnfinishedChain = (key: string) => {
  const unfinishedChains: IUnfinishedChains[] = JSON.parse(
    localStorage.getItem('unfinishedChains') || '[]',
  );

  const chains = unfinishedChains.filter(item => item.requestKey !== key);

  if (chains.length) {
    localStorage.setItem('unfinishedChains', JSON.stringify(chains));
  } else {
    localStorage.removeItem('unfinishedChains');
  }
  return chains;
};
