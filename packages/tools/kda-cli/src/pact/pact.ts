import { hash, sign } from '@kadena/cryptography-utils';
import { isFalsy } from '../utils/bool.js';
import type { Decimal, ICapabilities, ITransactionPayload } from './coin.js';
import type * as L2 from './l2.js';

type CapabilityArg = string | number | Decimal;
interface IGenericCapability {
  name: string;
  args: CapabilityArg[];
  signer: string;
}
interface IUnrestrictedCapability {
  name: 'UNRESTRICTED';
  args: [];
  signer: string;
}
type Capability =
  | IUnrestrictedCapability
  | IGenericCapability
  | ICapabilities[keyof ICapabilities]
  | L2.ICapabilities[keyof L2.ICapabilities];
export type Payload = (
  | ITransactionPayload
  | L2.ITransactionPayload
  | L2.IDepositPayload
  | L2.IWithdrawPayload
) & {
  meta: IMeta;
  domain: string;
  networkId: string;
  nonce: string;
  txKeys: string[];
  pactId: string;
  step: number;
  rollback: boolean;
  proof: string;
  sigs: { sig: string }[];
  targetChainId: string | `crossnet:${string}`;
  result: { status: string; data: unknown };
  response: { status: string; data: unknown };
};

export type SignedPayload = Payload & {
  sigs: [
    {
      sig: string;
    },
  ];
};

export const addCapability =
  (capability: Capability): Reducer =>
  async (payload) => {
    const { caps = [] } = await payload;
    return {
      ...payload,
      caps: [...caps, capability],
    };
  };

export const setData =
  (data: unknown): Reducer =>
  async (payload) => {
    return {
      ...(await payload),
      data,
    };
  };

export const setTargetChainId =
  (targetChainId: string): Reducer =>
  async (payload) => {
    return {
      ...(await payload),
      targetChainId,
    };
  };

interface IMeta {
  chainId: string;
  sender: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
  creationTime: number;
}
interface IMetaInput {
  chainId: string;
  sender: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
}
export const setMeta =
  ({ chainId, sender, gasLimit, gasPrice, ttl }: IMetaInput): Reducer =>
  (payload) => {
    return {
      ...payload,
      meta: {
        chainId,
        sender,
        gasLimit,
        gasPrice,
        ttl,
        creationTime: Math.floor(Date.now() / 1000),
      },
    };
  };

export const setNetworkId =
  (networkId: string): Reducer =>
  (payload) => {
    return {
      ...payload,
      networkId,
    };
  };

export const setDomain =
  (domain: string): Reducer =>
  (payload) => {
    return {
      ...payload,
      domain,
    };
  };

export const setCommand =
  (command: string): Reducer =>
  (payload) => {
    return {
      ...payload,
      command,
    };
  };

export type Reducer = <T extends Partial<Payload | SignedPayload>>(
  payload: Promise<T> | T,
) => Promise<T> | T;
export const buildCommand =
  (...reducers: Reducer[]): Reducer =>
  async <T extends Partial<Payload>>(
    initialPayload: Promise<T> | T,
  ): Promise<T> => {
    let payload = await initialPayload;
    for (const reducer of reducers) {
      payload = await reducer(payload);
    }
    return payload;
  };

type PactPayload =
  | {
      exec: {
        code: string;
        data?: unknown;
      };
    }
  | {
      cont: {
        pactId: string;
        step: number;
        rollback: boolean;
        data?: unknown;
        proof?: string;
      };
    };

interface IPactMeta {
  chainId: string;
  sender: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
  creationTime: number;
}

interface ICap {
  name: string;
  args: Array<string | number | { int: number }>;
}
interface ISigner {
  pubKey: string;
  clist: ICap[];
  addr: string;
  scheme: string;
}

export interface IPactRequest {
  payload: PactPayload;
  meta: IPactMeta;
  signers: ISigner[];
  networkId: string;
  nonce: string;
}

const mapCapValue = (
  value?: string,
  // eslint-disable-next-line @rushstack/no-new-null
): null | string | number | { int: number } => {
  if (value === undefined) return null;
  if (value.startsWith('"') && value.endsWith('"'))
    return value.replace(/^"|"$/g, '');
  if (value.includes('.')) return parseFloat(value);
  return { int: parseInt(value, 10) };
};
export const mapCapability = (cap: string, pubKey: string): Capability => {
  const [name, ...args] = cap.split(' ');
  if (!name) throw new Error('Invalid capability');
  const [lastArg, ...rargs] = args.reverse();
  return {
    name: name.replace(/^\(/, ''),
    signer: pubKey,
    args: [...rargs.reverse(), lastArg?.replace(/\)$/, '')]
      .map(mapCapValue)
      .filter((x): x is CapabilityArg => x !== null),
  };
};
export const addCapabilities =
  (caps: string[], pubKey: string): Reducer =>
  async (payload) => {
    let pay = await payload;
    for (const cap of caps) {
      if (cap === '') continue;
      pay = await addCapability(mapCapability(cap, pubKey))(pay);
    }
    return pay;
  };

export const getSigners = (caps: Capability[]): ISigner[] =>
  Object.entries(
    caps.reduce(
      (
        acc: Record<string, Capability[] | undefined>,
        cap: Capability,
      ): Record<string, Capability[]> => {
        if (cap.name === 'UNRESTRICTED')
          return {
            ...acc,
            [cap.signer]: [],
          } as Record<string, Capability[]>;
        return {
          ...acc,
          [cap.signer]: [...(acc[cap.signer] || []), cap],
        } as Record<string, Capability[]>;
      },
      {},
    ),
  ).map(([pubKey, caps]) => ({
    scheme: 'ED25519',
    pubKey,
    addr: pubKey,
    clist: caps.map((cap) => ({
      name: cap.name,
      args: cap.args,
    })),
  }));

export const getContinuationPayload = <T extends Partial<Payload>>(
  payload: T,
): IPactRequest => {
  if (payload.meta === undefined) throw new Error('Meta is required');
  if (payload.networkId === undefined) throw new Error('NetworkId is required');
  if (payload.caps === undefined) throw new Error('Caps is required');
  if (payload.pactId === undefined) throw new Error('PactId is required');
  if (payload.step === undefined) throw new Error('Step is required');

  return {
    payload: {
      cont: {
        pactId: payload.pactId,
        step: payload.step,
        rollback: payload.rollback ?? false,
        data: payload.data ?? null,
        proof: payload.proof,
      },
    },
    meta: payload.meta,
    signers: getSigners(payload.caps),
    networkId: payload.networkId,
    nonce: payload.nonce ?? `k:nonce:${Date.now()}`,
  };
};

export const getPayload = <T extends Partial<Payload>>(
  payload: T,
): IPactRequest => {
  if (payload.meta === undefined) throw new Error('Meta is required');
  if (payload.networkId === undefined) throw new Error('NetworkId is required');
  if (payload.caps === undefined) throw new Error('Caps is required');
  if (payload.txKeys) return getContinuationPayload(payload);
  if (payload.command === undefined) throw new Error('Command is required');
  return {
    payload: {
      exec: {
        code: payload.command,
        data: payload.data ?? null,
      },
    },
    meta: payload.meta,
    signers: getSigners(payload.caps),
    networkId: payload.networkId,
    nonce: payload.nonce ?? `k:nonce:${Date.now()}`,
  };
};

interface IQuicksignPayload {
  sigs: Record<string, string | undefined>;
  cmd: string;
}
interface IQuicksignPayloadRequest {
  reqs: IQuicksignPayload[];
}

export const getQuicksignPayload = (
  ...payloads: IPactRequest[]
): IQuicksignPayloadRequest => {
  return {
    reqs: payloads.map((payload) => ({
      sigs: payload.signers.reduce(
        (sigs, signer) => ({
          ...sigs,
          [signer.pubKey]: null,
        }),
        {},
      ),
      cmd: JSON.stringify(payload),
    })),
  };
};

export const signWithChainweaver: Reducer = async (payload) => {
  const pactPayload = getPayload(await payload);
  const quicksignPayload = getQuicksignPayload(pactPayload);

  const response = await fetch('http://127.0.0.1:9467/v1/quickSign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quicksignPayload),
  });
  if (!response.ok) throw new Error('Failed to sign with chainweaver');
  const data = await response.json();
  const [{ sigs }] = data.results;
  return {
    ...payload,
    nonce: pactPayload.nonce,
    sigs: pactPayload.signers.map((signer) => ({ sig: sigs[signer.pubKey] })),
  };
};

export const signWithKeypair =
  ({
    secretKey,
    publicKey,
  }: {
    secretKey: string;
    publicKey: string;
  }): Reducer =>
  async (payload) => {
    const payloadData = getPayload(await payload);
    const payloadString = JSON.stringify(payloadData);
    const { sig } = sign(payloadString, { secretKey, publicKey });
    return {
      ...payload,
      nonce: payloadData.nonce,
      sigs: [{ sig }],
    };
  };

const getBaseUrl = <T extends Partial<Payload | SignedPayload>>(
  payload: T,
): string => {
  if (typeof payload?.meta?.chainId !== 'string')
    throw new Error('Meta is required');
  if (isFalsy(payload.domain)) throw new Error('Domain is required');
  if (isFalsy(payload.networkId)) throw new Error('NetworkId is required');
  return `${payload.domain}/chainweb/0.0/${payload.networkId}/chain/${payload.meta.chainId}/pact`;
};

export const local =
  ({ preflight = false, signatureValidation = false }): Reducer =>
  async (p) => {
    const payload = await p;
    const pactPayload = JSON.stringify(getPayload(payload));
    if (!payload.caps) throw new Error('Caps is required');

    const response = await fetch(
      `${getBaseUrl(
        payload,
      )}/api/v1/local?preflight=${preflight}&signatureValidation=${signatureValidation}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          cmd: pactPayload,
          sigs: payload.sigs ?? [],
          hash: hash(pactPayload),
        }),
      },
    );

    if (!response.ok) {
      console.error(await response.text());
      throw new Error('Failed to get a preview');
    }
    const data = await response.json();
    return {
      ...payload,
      response: data,
      result: data.result ?? data.preflightResult?.result,
    };
  };

export const send: Reducer = async (payload) => {
  const unpackedPayload = await payload;
  const pactPayload = JSON.stringify(getPayload(unpackedPayload));
  const response = await fetch(`${getBaseUrl(unpackedPayload)}/api/v1/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      cmds: [
        {
          cmd: pactPayload,
          sigs: unpackedPayload.sigs,
          hash: hash(pactPayload),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send:${await response.text()}`);
  }
  const data = await response.json();
  return {
    ...unpackedPayload,
    txKeys: data.requestKeys,
  };
};

export const listen: Reducer = async (p) => {
  const payload = await p;
  if (!payload.txKeys)
    throw new Error('No transactions pending for this paylaod');
  const [res] = await Promise.all(
    payload.txKeys.map(async (key) => {
      const response = await fetch(`${getBaseUrl(payload)}/api/v1/listen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          listen: key,
        }),
      });
      if (!response.ok) throw new Error('Failed to listen');
      const data = await response.json();
      if (data.result.status !== 'success')
        throw new Error(`Failed to listen: ${JSON.stringify(data)}`);
      return data;
    }),
  );

  if (isFalsy(res.continuation)) return payload;
  return {
    ...payload,
    pactId: res.continuation.pactId,
    step: res.continuation.step + 1,
    rollback: false, // no rollback support for now
  };
};

export const getSPVProof: Reducer = async (p) => {
  const payload = await p;
  if (!payload.txKeys)
    throw new Error('No transactions pending for this paylaod');
  const [proof] = await Promise.all(
    payload.txKeys.map(async (key) => {
      const response = await fetch(`${getBaseUrl(payload)}/spv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          requestKey: key,
          targetChainId: payload.targetChainId,
        }),
      });
      if (!response.ok) throw new Error('Failed to listen');
      return await response.json();
    }),
  );
  return { ...payload, proof };
};

export const signSendListen: Reducer = buildCommand(
  signWithChainweaver,
  send,
  listen,
);
export const signLocal = ({
  preflight = true,
  signatureValidation = true,
}): Reducer =>
  buildCommand(signWithChainweaver, local({ preflight, signatureValidation }));
