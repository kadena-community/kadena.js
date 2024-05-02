import { createSignWithKeypair } from '@kadena/client';
import {
  addData,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { IGeneralCapability } from '@kadena/client/lib/interfaces/type-utilities';
import { ChainId, ICap, IPactInt } from '@kadena/types';
import { expect } from 'vitest';
import { submitClient } from '../../core';
import type { Any } from '../../core/utils/types';
import { CommonProps } from '../../marmalade/config';
import { sourceAccount } from '../test-data/accounts';

export const withStepFactory = () => {
  let step = 0;
  return <
      Args extends Any[],
      Rt extends Any,
      T extends (step: number, ...args: Args) => Rt,
    >(
      cb: T,
    ) =>
    (...args: Args): Rt => {
      step += 1;
      return cb(step, ...args);
    };
};

export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addDaysToDate = (originalDate: Date, daysToAdd: number) =>
  new Date(originalDate.getTime() + daysToAdd * 86400000);

export const addMinutesToDate = (originalDate: Date, minutesToAdd: number) =>
  new Date(originalDate.getTime() + minutesToAdd * 3600000);

export const addSecondsToDate = (originalDate: Date, secondsToAdd: number) =>
  new Date(originalDate.getTime() + secondsToAdd * 1000);

export const dateToPactInt = (date: Date): IPactInt => ({
  int: Math.floor(date.getTime() / 1000).toString(),
});

export const formatCapabilities = (
  capabilities: CommonProps['capabilities'] = [],
  signFor: IGeneralCapability,
): ICap[] =>
  capabilities.map((capability) =>
    signFor(capability.name, ...capability.props),
  );

export const formatAdditionalSigners = (
  additionalSigners: CommonProps['additionalSigners'] = [],
): any[] =>
  additionalSigners.map((signer) =>
    addSigner(signer.keyset.keys, (signFor) =>
      formatCapabilities(signer.capabilities, signFor),
    ),
  );

export const deployGasStation = async ({ chainId }: { chainId: ChainId }) => {
  const config = {
    host: 'http://127.0.0.1:8080',
    defaults: {
      networkId: 'development',
    },
    sign: createSignWithKeypair([sourceAccount]),
  };

  const result = await submitClient(config)(
    composePactCommand(
      execution(
        `
          (namespace "free")

          (module test-gas-station GOVERNANCE
            (defcap GOVERNANCE () true)

            (implements gas-payer-v1)

            (use coin)

            (defun chain-gas-price ()
              (at 'gas-price (chain-data))
            )

            (defun enforce-below-or-at-gas-price:bool (gasPrice:decimal)
              (enforce (<= (chain-gas-price) gasPrice)
                (format "Gas Price must be smaller than or equal to {}" [gasPrice]))
            )

            (defcap GAS_PAYER:bool
              ( user:string
                limit:integer
                price:decimal
              )
              (enforce (= "exec" (at "tx-type" (read-msg))) "Can only be used inside an exec")
              (enforce (= 1 (length (at "exec-code" (read-msg)))) "Can only be used to call one pact function")
              (enforce-below-or-at-gas-price 0.000001)
              (compose-capability (ALLOW_GAS))
            )

            (defcap ALLOW_GAS () true)

            (defun create-gas-payer-guard:guard ()
              (create-user-guard (gas-payer-guard))
            )

            (defun gas-payer-guard ()
              (require-capability (GAS))
              (require-capability (ALLOW_GAS))
            )

            (defconst GAS_STATION_ACCOUNT "test-gas-station")

            (defun init ()
              (coin.create-account GAS_STATION_ACCOUNT (create-gas-payer-guard))
            )
          )

          (if (read-msg "init")
            [(init)]
            ["not creating the gas station account"]
          )
          `,
      ),
      addSigner(sourceAccount.publicKey, (signFor) => [signFor('coin.GAS')]),
      addData('init', true),
      setMeta({
        senderAccount: sourceAccount.account,
        chainId,
        gasLimit: 100_000,
      }),
    ),
  ).execute();

  expect(result).toStrictEqual(['Write succeeded']);
};
