import type { ISigner, ICap, IPactDecimal, IPactInt, ICommandPayload, } from '@kadena/types';
import { InvalidRequestError } from '@metamask/snaps-sdk';

interface KnownCapMap {
  [capName: string]: KnownCapFn;
}

type KnownCapFn = (clist: ICap, txn: ICommandPayload, accounts:  Record<string, string>) => string;

const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === "object" && obj !== null;
}

const hasField = <T extends string>(obj: Record<string, unknown>, field: T): obj is Record<T, unknown> => {
  return field in obj;
}

const isIPactDecimal = (arg: unknown): arg is IPactDecimal =>
  isObject(arg) && hasField(arg, "decimal") && typeof arg.decimal === "string";
const isIPactInt = (arg: unknown): arg is IPactInt =>
  isObject(arg) && hasField(arg, "int") && typeof arg.int === "string";

const getNumericObjectValue = (x: IPactInt | IPactDecimal): string => {
  if (isIPactDecimal(x)) return x.decimal;
  if (isIPactInt(x)) return x.int;
  return String(x);
}

const parseArg = (arg: unknown): string => {
  if (typeof arg === "string") return arg;

  if (isIPactDecimal(arg) || isIPactInt(arg)) return getNumericObjectValue(arg);

  if (typeof arg === "object")
    return JSON.stringify(arg);

  return String(arg);
}

const knownCapabilities: KnownCapMap = {
  "coin.TRANSFER_XCHAIN": ({ args }, { meta: { chainId }}, accounts) => {
    if (!Array.isArray(args)) throw new InvalidRequestError(`${args} capability args was not an array`);
    const [sender, receiver, amount, destinationChainId] = args;
    const senderName = accounts[sender as string] ?? '';
    const receiverName = accounts[receiver as string] ?? '';
    return `Send cross-chain: ${parseArg(amount)} KDA\nFrom:\n${sender}${senderName ? ` (${senderName})` : ''} (chain ${chainId})\nTo:\n${receiver}${receiverName ? ` (${receiverName})` : ''} (chain ${destinationChainId})`
  },
  "coin.TRANSFER": ({ args }, { meta: { chainId }}, accounts) => {
    if (!Array.isArray(args)) throw new InvalidRequestError(`${args} capability args was not an array`);
    const [sender, receiver, amount] = args;
    const senderName = accounts[sender as string] ?? '';
    const receiverName = accounts[receiver as string] ?? '';
    return `Send: ${parseArg(amount)} KDA\nFrom:\n${sender}${senderName ? ` (${senderName})` : ''} (chain ${chainId})\nTo:\n${receiver}${receiverName ? ` (${receiverName})` : ''} (chain ${chainId})`
  },
  "coin.GAS": (_, { meta: { gasLimit, gasPrice }}) => `Gas spend:\nUp to ${gasLimit * gasPrice} KDA`,
  "_unknown": ({ name, args }, { meta: { chainId }}) => {
    const strs = [`⚠️  **Unidentified capability.** Review carefully:\nCapability: ${name}`];
    if (args.length) {
      strs.push(`Arguments: ${JSON.stringify(args.map(a => parseArg(a)), null, 2)}`);
    }
    strs.push(`Chain: ${chainId}`);
    return strs.join("\n");
  }
}

const parseCapability = (clist: ICap, txn: ICommandPayload, accounts: Record<string, string>): string => {
  const { name } = clist;
  const knownCapFn = knownCapabilities[name];
  if (knownCapFn) {
    return knownCapFn(clist, txn, accounts);
  } else {
    return knownCapabilities._unknown(clist, txn, accounts);
  }
}

export const parseCapabilities = (signer: ISigner, txn: ICommandPayload, accounts: Record<string, string>): string[] => {
  return signer.clist?.map(
    clist => parseCapability(clist, txn, accounts)
  ) ?? [];
}
