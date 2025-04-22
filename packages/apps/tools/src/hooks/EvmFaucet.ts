import type { FormStatus } from '@/components/Global';
import faucetABI from '@/contracts/faucet-abi.json';
import { env } from '@/utils/env';
import { getChainwebEVMChain } from '@/utils/evm';
import type { ChainId } from '@kadena/types';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useEffect, useState } from 'react';
import { createPublicClient, formatEther, http } from 'viem';

const TXHASH_LOCALSTORAGEKEY = 'TXHASH_LOCALSTORAGEKEY';

const getPublicClient = (chainId: ChainId) => {
  return createPublicClient({
    chain: getChainwebEVMChain(chainId),
    transport: http(`/eth/${chainId}`),
  });
};

export function useEvmFaucet() {
  // State for token amount, faucet balance, and loading status
  const [dispenseAmount, setDispenseAmount] = useState('0');
  const [faucetBalance, setFaucetBalance] = useState('0');
  const [innerChainId, setInnerChainId] = useState<ChainId>(
    process.env.NEXT_PUBLIC_STARTCHAIN_ID as ChainId,
  );

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  const { executeRecaptcha } = useReCaptcha();

  // Read the dispensed token amount and contract balance when the component mounts
  const getAmounts = async () => {
    // Create the public client for reading from the blockchain

    try {
      // Get dispense amount (how much will be sent)
      const amount = (await getPublicClient(innerChainId).readContract({
        address: env('EVMFAUCET_CONTRACT_ADDRESS', '0x_'),
        abi: faucetABI,
        functionName: 'nativeTokenAmount',
      })) as bigint;

      // Get faucet's current balance
      const balance = await getPublicClient(innerChainId).getBalance({
        address: env('EVMFAUCET_CONTRACT_ADDRESS', '0x_'),
      });

      setDispenseAmount(formatEther(amount));
      setFaucetBalance(formatEther(balance));
    } catch (err) {
      setRequestStatus({
        status: 'erroneous',
        message: 'Error reading amounts',
      });
    }
  };

  const waitForTx = async () => {
    const hash = localStorage.getItem(TXHASH_LOCALSTORAGEKEY) as `0x${string}`;
    if (!hash) return;
    setRequestStatus({ status: 'processing' });
    try {
      const receipt = await getPublicClient(
        innerChainId,
      ).waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setRequestStatus({ status: 'successful' });
      }

      localStorage.removeItem(TXHASH_LOCALSTORAGEKEY);
      await getAmounts();
    } catch (e) {
      setRequestStatus({
        status: 'erroneous',
        message: 'No transaction found',
      });
      localStorage.removeItem(TXHASH_LOCALSTORAGEKEY);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAmounts();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitForTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerChainId]);

  // Function to dispense tokens
  const dispenseTokens = async (recipient: string): Promise<void> => {
    setRequestStatus({ status: 'processing' });

    try {
      const token = await executeRecaptcha('form_submit');
      console.log('Attempting dispense to:', recipient);

      const result: Response = await fetch(`/api/faucet/evm`, {
        method: 'POST',
        body: JSON.stringify({ recipient, chainId: innerChainId, token }),
      });

      const hash: any = await result.json();

      if (result.status !== 200) {
        throw new Error(hash.error);
      }

      localStorage.setItem(TXHASH_LOCALSTORAGEKEY, `${hash}`);
      await waitForTx();
    } catch (err) {
      console.log({ err });
      setRequestStatus({ status: 'erroneous', message: err.message });
    }
  };

  const setChainId = (chainId: ChainId) => {
    setInnerChainId(chainId);
  };

  return {
    dispenseAmount,
    faucetBalance,
    dispenseTokens,
    requestStatus,
    setChainId,
    chainId: innerChainId,
  };
}
