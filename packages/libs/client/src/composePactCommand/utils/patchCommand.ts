import {
  IContinuationPayloadObject,
  IExecutionPayloadObject,
  IPactCommand,
} from '../../interfaces/IPactCommand';

/**
 * @internal
 */
export const mergePayload = (
  payload: IPactCommand['payload'] | undefined,
  newPayload: IPactCommand['payload'] | undefined,
): IExecutionPayloadObject | IContinuationPayloadObject | undefined => {
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

/**
 * Merge a partial command on top of the command
 *
 * @remarks
 * It will only be necessary to use in advanced use cases
 *
 * @param command - the target command
 * @param patch - the properties to patch on top of the target command
 * @public
 */
export function patchCommand(
  command: Partial<IPactCommand>,
  patch: Partial<IPactCommand>,
): Partial<IPactCommand> {
  const state = { ...command };
  if (patch.payload !== undefined) {
    state.payload = mergePayload(state.payload, patch.payload);
  }
  if (patch.meta !== undefined) {
    state.meta = { ...state.meta, ...patch.meta };
  }
  if (patch.nonce !== undefined) {
    state.nonce = patch.nonce;
  }
  if (patch.networkId !== undefined) {
    state.networkId = patch.networkId;
  }
  if (patch.signers !== undefined) {
    patch.signers.forEach((signer) => {
      state.signers ??= [];
      const foundSigner = state.signers.find(
        ({ pubKey }) => signer.pubKey === pubKey,
      );
      if (foundSigner !== undefined) {
        foundSigner.clist = [
          ...(foundSigner.clist ?? []),
          ...(signer.clist ?? []),
        ];
      } else {
        state.signers.push(signer);
      }
    });
  }
  return state;
}
