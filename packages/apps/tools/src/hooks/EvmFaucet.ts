import type { FormStatus } from '@/components/Global';
import faucetABI from '@/contracts/faucet-abi.json';
import { env } from '@/utils/env';
import type { EVMChainId } from '@/utils/evm';
import { getPublicClient } from '@/utils/evm';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

export function useEvmFaucet() {
  // State for token amount, faucet balance, and loading status
  const [dispenseAmount, setDispenseAmount] = useState('0');
  const [faucetBalance, setFaucetBalance] = useState('0');
  const [innerChainId, setInnerChainId] = useState<EVMChainId>(
    process.env.NEXT_PUBLIC_STARTCHAIN_ID as EVMChainId,
  );

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
    hash?: string;
    explorerLink?: string;
  }>({ status: 'idle' });

  const { executeRecaptcha } = useReCaptcha();

  const createExplorerLink = ({
    hash,
    chainId,
  }: {
    hash?: `0x${string}`;
    chainId: EVMChainId;
  }) => {
    console.log('Creating explorer link for hash:', hash, 'on chain:', chainId);
    console.log(hash);
    if (!hash) return '';
    return `http://chain-${chainId}.evm-testnet-blockscout.chainweb.com/tx/${hash}`;
  };

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

  const waitForTx = async (hash: `0x${string}`) => {
    if (!hash) return;
    setRequestStatus({
      status: 'processing',
      explorerLink: createExplorerLink({ hash, chainId: innerChainId }),
    });
    try {
      const receipt = await getPublicClient(
        innerChainId,
      ).waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        setRequestStatus({
          status: 'successful',
          hash,
          explorerLink: createExplorerLink({ hash, chainId: innerChainId }),
        });
      }

      await getAmounts();
    } catch (e) {
      setRequestStatus({
        status: 'erroneous',
        message: 'No transaction found',
        hash,
        explorerLink: createExplorerLink({ hash, chainId: innerChainId }),
      });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAmounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerChainId]);

  // Function to dispense tokens
  const dispenseTokens = async (recipient: string): Promise<void> => {
    setRequestStatus({ status: 'processing' });

    let hash: any;
    try {
      const token = await executeRecaptcha('form_submit');
      console.log('Attempting dispense to:', recipient);

      const result: Response = await fetch(`/api/faucet/evm`, {
        method: 'POST',
        body: JSON.stringify({ recipient, chainId: innerChainId, token }),
      });

      hash = await result.json();

      if (result.status !== 200) {
        throw new Error(hash.error);
      }

      await waitForTx(hash);
    } catch (err) {
      console.log({ err });
      setRequestStatus({
        status: 'erroneous',
        message: err.message,
        explorerLink: createExplorerLink({ hash, chainId: innerChainId }),
      });
    }
  };

  const setChainId = (chainId: EVMChainId) => {
    console.log('Setting chain ID to:', chainId);
    if (!chainId) {
      setInnerChainId(process.env.NEXT_PUBLIC_STARTCHAIN_ID as EVMChainId);
    }
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
