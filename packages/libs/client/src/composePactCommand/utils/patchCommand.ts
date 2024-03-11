import type { IPartialPactCommand } from '../../interfaces/IPactCommand';

/**
 * @internal
 */
export const mergePayload = (
  payload: IPartialPactCommand['payload'] | undefined,
  newPayload: IPartialPactCommand['payload'],
): IPartialPactCommand['payload'] => {
  if (payload === undefined || newPayload === undefined)
    return newPayload ?? payload;

  if ('exec' in payload && 'exec' in newPayload) {
    return {
      exec: {
        code: (payload.exec?.code ?? '') + (newPayload.exec?.code ?? ''),
        data: {
          ...payload.exec?.data,
          ...newPayload.exec?.data,
        },
      },
    };
  }

  if ('cont' in payload && 'cont' in newPayload) {
    return {
      cont: {
        ...payload.cont,
        ...newPayload.cont,
        data: {
          ...payload.cont?.data,
          ...newPayload.cont?.data,
        },
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
  command: IPartialPactCommand,
  patch: IPartialPactCommand,
): IPartialPactCommand {
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
      const foundSigner = state.signers
        .filter(Boolean)
        .find((item) => signer?.pubKey === item?.pubKey);
      if (foundSigner !== undefined) {
        foundSigner.clist = [
          ...(foundSigner.clist ?? []),
          ...(signer?.clist ?? []),
        ];
      } else {
        state.signers.push(signer);
      }
    });
  }
  if (patch.verifiers !== undefined) {
    patch.verifiers.forEach((verifier) => {
      state.verifiers ??= [];
      const foundVerifier = state.verifiers
        .filter(Boolean)
        .find(
          (item) =>
            verifier?.name === item?.name && verifier?.proof === item?.proof,
        );
      if (foundVerifier !== undefined) {
        foundVerifier.clist = [
          ...(foundVerifier.clist ?? []),
          ...(verifier?.clist ?? []),
        ];
      } else {
        state.verifiers.push(verifier);
      }
    });
  }
  return state;
}
