import {
  IContinuationPayloadObject,
  IExecPayloadObject,
  IPactCommand,
} from '../../interfaces/IPactCommand';

export const mergePayload = (
  payload: IPactCommand['payload'] | undefined,
  newPayload: IPactCommand['payload'] | undefined,
): IExecPayloadObject | IContinuationPayloadObject | undefined => {
  if (payload === undefined || newPayload === undefined)
    return newPayload ?? payload;

  if ('exec' in payload && 'exec' in newPayload) {
    return {
      exec: {
        code: (payload.exec.code ?? '') + (newPayload.exec.code ?? ''),
        ...(payload.exec.data || newPayload.exec.data
          ? {
              data: {
                ...payload.exec.data,
                ...newPayload.exec.data,
              },
            }
          : {}),
      },
    };
  }

  if ('cont' in payload && 'cont' in newPayload) {
    return {
      cont: {
        ...payload.cont,
        ...newPayload.cont,
        ...(payload.cont.data || newPayload.cont.data
          ? {
              data: {
                ...payload.cont.data,
                ...newPayload.cont.data,
              },
            }
          : {}),
      },
    };
  }

  throw new Error('PAYLOAD_NOT_MERGEABLE');
};

export function patchCommand(
  command: Partial<IPactCommand>,
  patch: Partial<IPactCommand>,
): Partial<IPactCommand> {
  const next = { ...command };
  if (patch.payload !== undefined) {
    next.payload = mergePayload(next.payload, patch.payload);
  }
  if (patch.meta !== undefined) {
    next.meta = { ...next.meta, ...patch.meta };
  }
  if (patch.nonce !== undefined) {
    next.nonce = patch.nonce;
  }
  if (patch.networkId !== undefined) {
    next.networkId = patch.networkId;
  }
  if (patch.signers !== undefined) {
    patch.signers.forEach((signer) => {
      next.signers ??= [];
      const prev = next.signers.find(({ pubKey }) => signer.pubKey === pubKey);
      if (prev !== undefined) {
        prev.clist = [...(prev.clist ?? []), ...(signer.clist ?? [])];
      } else {
        next.signers.push(signer);
      }
    });
  }
  return next;
}
