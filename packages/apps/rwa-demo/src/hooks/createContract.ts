import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IAddContractProps } from '@/services/createContract';
import { getClient } from '@/utils/client';
import type { IUnsignedCommand } from '@kadena/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';
import { useUser } from './user';

export const useCreateContract = () => {
  const { account, isMounted, sign, isGasPayable } = useAccount();
  const { userToken } = useUser();
  const { organisation } = useOrganisation();
  const [isAllowed, setIsAllowed] = useState(false);
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (
    data: IAddContractProps,
  ): Promise<boolean | undefined> => {
    if (!userToken || !organisation) {
      addNotification(
        {
          intent: 'negative',
          label: 'User token is missing',
        },
        {
          name: `error:submit:createcontract`,
          options: {
            message: 'User token is missing',
            sentryData: {
              type: 'submit_chain',
            },
          },
        },
      );
      return;
    }

    const result = await fetch(
      `/api/admin/contract?organisationId=${organisation.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken.token}`,
        },
        body: JSON.stringify({ ...data, accountAddress: account?.address }),
      },
    );

    if (result.status !== 200) {
      addNotification({
        intent: 'negative',
        label: 'Error creating contract',
        message: `Status: ${result.status}, Message: ${result.statusText}`,
      });
      return;
    }
    const { tx } = (await result.json()) as { tx: IUnsignedCommand };

    if (!tx) {
      addNotification(
        {
          intent: 'negative',
          label: 'Error creating contract',
          message: 'Unknown error occurred',
        },
        {
          name: `error:submit:createcontract`,
          options: {
            message: 'Unknown error occurred',
            sentryData: {
              type: 'submit_chain',
              captureContext: {
                extra: {
                  result,
                },
              },
            },
          },
        },
      );
      return;
    }

    try {
      const signedTransaction = await sign(tx);

      if (!signedTransaction) {
        addNotification(
          {
            intent: 'negative',
            label: 'Signing transaction failed',
            message: 'Please check your account and try again.',
          },
          {
            name: `error:submit:createcontract`,
            options: {
              message: 'Problem with signing transaction',
              sentryData: {
                type: 'submit_chain',
                captureContext: {
                  extra: {
                    tx,
                    result,
                  },
                },
              },
            },
          },
        );
        return;
      }

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await addTransaction({
        ...res,
        type: TXTYPES.CREATECONTRACT,
        accounts: [account?.address!],
      });

      const dataResult = await client.listen(res);

      // if the contract already exists, go to that contract
      if (dataResult.result.status === 'failure') {
        if (
          (dataResult.result.error as any)?.message?.includes(
            '"PactDuplicateTableError',
          )
        ) {
          window.location.href = `/assets/create/${data.namespace}/${data.contractName}`;
          return false;
        }
        return false;
      }

      addNotification({
        intent: 'positive',
        message: `Contract ${data.contractName} created successfully`,
      });

      return true;
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
  };

  useEffect(() => {
    if (!organisation) return;
    if (
      !userToken?.claims?.orgAdmins?.[organisation?.id] ||
      !isMounted ||
      isGasPayable === undefined
    )
      return;

    setIsAllowed(isGasPayable);
  }, [isMounted, isGasPayable, organisation, userToken]);

  return { submit, isAllowed };
};
