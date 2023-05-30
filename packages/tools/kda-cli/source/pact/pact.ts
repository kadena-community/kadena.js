import {Capabilities, Decimal, TransactionPayload} from './coin.js';
import * as L2 from './l2.js';
import {hash} from '@kadena/cryptography-utils';

type CapabilityArg = string | number | Decimal;
type GenericCapability = {
	name: string;
	args: CapabilityArg[];
	signer: string;
};
type Capability =
	| GenericCapability
	| Capabilities[keyof Capabilities]
	| L2.Capabilities[keyof L2.Capabilities];
export type Payload = (
	| TransactionPayload
	| L2.TransactionPayload
	| L2.DepositPayload
	| L2.WithdrawPayload
) & {
	meta: Meta;
	domain: string;
	networkId: string;
	nonce: string;
	txKeys: string[];
	pactId: string;
	step: number;
	rollback: boolean;
	proof: string;
	targetChainId: string | `crossnet:${string}`;
	result: {status: string; data: any};
};

export type SignedPayload = Payload & {
	sigs: [
		{
			sig: string;
		},
	];
};

export const addCapability =
	(capability: Capability) =>
	<T extends Partial<Payload>>(payload: T): T => {
		const {caps = []} = payload;
		return {
			...payload,
			caps: [...caps, capability],
		};
	};

export const setData =
	(data: any) =>
	<T extends Partial<Payload>>(payload: T): T => {
		return {
			...payload,
			data,
		};
	};

export const setTargetChainId =
	(targetChainId: string) =>
	<T extends Partial<Payload>>(payload: T): T => {
		return {
			...payload,
			targetChainId,
		};
	};

type Meta = {
	chainId: string;
	sender: string;
	gasLimit: number;
	gasPrice: number;
	ttl: number;
	creationTime: number;
};
type MetaInput = {
	chainId: string;
	sender: string;
	gasLimit: number;
	gasPrice: number;
	ttl: number;
};
export const setMeta =
	({chainId, sender, gasLimit, gasPrice, ttl}: MetaInput) =>
	<T extends Partial<Payload>>(payload: T): T => {
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
	(networkId: string) =>
	<T extends Partial<Payload>>(payload: T): T => {
		return {
			...payload,
			networkId,
		};
	};

export const setDomain =
	(domain: string) =>
	<T extends Partial<Payload>>(payload: T): T => {
		return {
			...payload,
			domain,
		};
	};

export const setCommand =
	(command: string) =>
	<T extends Partial<Payload>>(payload: T): T => {
		return {
			...payload,
			command,
		};
	};

export const buildCommand =
	<T extends Partial<Payload>>(...reducers: ((p: T) => Promise<T> | T)[]) =>
	async (initialPayload: Promise<T> | T) => {
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
				data?: any;
			};
	  }
	| {
			cont: {
				pactId: string;
				step: number;
				rollback: boolean;
				data?: any;
				proof?: string;
			};
	  };

type PactMeta = {
	chainId: string;
	sender: string;
	gasLimit: number;
	gasPrice: number;
	ttl: number;
	creationTime: number;
};

type Cap = {
	name: string;
	args: Array<string | number | {int: number}>;
};
type Signer = {
	pubKey: string;
	clist: Cap[];
	addr: string;
	scheme: string;
};

export type PactRequest = {
	payload: PactPayload;
	meta: PactMeta;
	signers: Signer[];
	networkId: string;
	nonce: string;
};

const mapCapValue = (value?: string) => {
	if (!value) return null;
	if (value.startsWith('"') && value.endsWith('"'))
		return value.replace(/^"|"$/g, '');
	if (value.includes('.')) return parseFloat(value);
	return {int: parseInt(value, 10)};
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
	(caps: string[], pubKey: string) =>
	<T extends Partial<Payload>>(payload: T): T => {
		return caps.filter(Boolean).reduce((pay, cap) => {
			return addCapability(mapCapability(cap, pubKey))(pay);
		}, payload);
	};

export const getSigners = (caps: Capability[]): Signer[] =>
	Object.entries(
		caps.reduce((acc: Record<string, Capability[]>, cap: Capability) => {
			return {
				...acc,
				[cap.signer]: [...(acc[cap.signer] || []), cap],
			};
		}, {}),
	).map(([pubKey, caps]) => ({
		scheme: 'ED25519',
		pubKey,
		addr: pubKey,
		clist: caps.map(cap => ({
			name: cap.name,
			args: cap.args,
		})),
	}));

export const getPayload = <T extends Partial<Payload>>(
	payload: T,
): PactRequest => {
	if (!payload.meta) throw new Error('Meta is required');
	if (!payload.networkId) throw new Error('NetworkId is required');
	if (!payload.caps) throw new Error('Caps is required');
	if (payload.txKeys) return getContinuationPayload(payload);
	if (!payload.command) throw new Error('Command is required');
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

export const getContinuationPayload = <T extends Partial<Payload>>(
	payload: T,
): PactRequest => {
	if (!payload.meta) throw new Error('Meta is required');
	if (!payload.networkId) throw new Error('NetworkId is required');
	if (!payload.caps) throw new Error('Caps is required');
	if (!payload.pactId) throw new Error('PactId is required');
	if (!payload.step) throw new Error('Step is required');

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

type QuicksignPayload = {
	sigs: Record<string, string | null>;
	cmd: string;
};
type QuicksignPayloadRequest = {
	reqs: QuicksignPayload[];
};

export const getQuicksignPayload = (
	...payloads: PactRequest[]
): QuicksignPayloadRequest => {
	return {
		reqs: payloads.map(payload => ({
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

export const signWithChainweaver = async <T extends Partial<Payload>>(
	payload: T,
): Promise<T> => {
	const pactPayload = getPayload(payload);
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
	const [{sigs}] = data.results;
	return {
		...payload,
		nonce: pactPayload.nonce,
		sigs: pactPayload.signers.map(signer => ({sig: sigs[signer.pubKey]})),
	};
};

export const local =
	({preflight = false, signatureValidation = false}) =>
	async <T extends Partial<SignedPayload>>(payload: T): Promise<T> => {
		const pactPayload = JSON.stringify(getPayload(payload));
		if (!payload.caps) throw new Error('Caps is required');

		const response = await fetch(
			`${getBaseUrl(
				payload,
			)}/api/v1/local?preflight=${preflight}&signatureValidationt=${signatureValidation}`,
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

const getBaseUrl = <T extends Partial<SignedPayload>>(payload: T): string => {
	if (!payload.meta) throw new Error('Meta is required');
	if (!payload.domain) throw new Error('Domain is required');
	if (!payload.networkId) throw new Error('NetworkId is required');
	return `${payload.domain}/chainweb/0.0/${payload.networkId}/chain/${payload.meta.chainId}/pact`;
};

export const send = async <T extends Partial<SignedPayload>>(
	payload: T,
): Promise<T> => {
	const pactPayload = JSON.stringify(getPayload(payload));
	const response = await fetch(getBaseUrl(payload) + '/api/v1/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			cmds: [
				{
					cmd: pactPayload,
					sigs: payload.sigs,
					hash: hash(pactPayload),
				},
			],
		}),
	});
	if (!response.ok) throw new Error('Failed to send');
	const data = await response.json();
	return {
		...payload,
		txKeys: data.requestKeys,
	};
};

export const listen = async <T extends Partial<SignedPayload>>(
	payload: T,
): Promise<T> => {
	if (!payload.txKeys)
		throw new Error('No transactions pending for this paylaod');
	const [res] = await Promise.all(
		payload.txKeys.map(async key => {
			const response = await fetch(getBaseUrl(payload) + '/api/v1/listen', {
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
			if (data.result.status !== 'success') throw new Error('Failed to listen');
			return data;
		}),
	);

	if (!res.continuation) return payload;
	return {
		...payload,
		pactId: res.continuation.pactId,
		step: res.continuation.step + 1,
		rollback: false, // no rollback support for now
	};
};

export const getSPVProof = async <T extends Partial<SignedPayload>>(
	payload: T,
): Promise<T> => {
	if (!payload.txKeys)
		throw new Error('No transactions pending for this paylaod');
	const [proof] = await Promise.all(
		payload.txKeys.map(async key => {
			const response = await fetch(getBaseUrl(payload) + '/spv', {
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
	return {...payload, proof};
};

export const signSendListen = buildCommand(signWithChainweaver, send, listen);
export const signLocal = ({preflight = true, signatureValidation = true}) =>
	buildCommand(signWithChainweaver, local({preflight, signatureValidation}));
