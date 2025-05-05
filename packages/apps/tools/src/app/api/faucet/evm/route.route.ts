import faucetABI from '@/contracts/faucet-abi.json';
import {
  createServerUrl,
  formatErrorMessage,
  getChainwebEVMChain,
  getPublicClient,
} from '@/utils/evm';
import type { ChainId } from '@kadena/types';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { checkRecaptcha } from './utils/captcha';

const PRIVATE_KEY = process.env.EVMFAUCET_PRIVATE_KEY as `0x${string}`;
const EVMFAUCET_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_EVMFAUCET_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_EVMRPC_URL;

// Create the faucet account from private key

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown as {
    recipient: string;
    chainId: ChainId;
    token: string; //this is for recaptcha check
  };

  if (!PRIVATE_KEY || !RPC_URL || !EVMFAUCET_CONTRACT_ADDRESS) {
    return NextResponse.json(
      { error: 'missing env variables' },
      { status: 500 },
    );
  }

  const captchaResult: any = await checkRecaptcha(body.token);
  if (!captchaResult?.success) {
    return NextResponse.json(
      {
        error: 'this is a bot',
      },
      { status: 500 },
    );
  }

  // Create chain instance
  const chainwebEVMChain = getChainwebEVMChain(body.chainId, true);
  const account = privateKeyToAccount(PRIVATE_KEY);

  // Create the wallet client for writing to the blockchain
  const walletClient = createWalletClient({
    account,
    chain: chainwebEVMChain,
    transport: http(createServerUrl(body.chainId, true)),
  });

  // First simulate the transaction to check for errors
  try {
    const { request: evmRequest } = await getPublicClient(
      body.chainId,
      true,
    ).simulateContract({
      address: process.env
        .NEXT_PUBLIC_EVMFAUCET_CONTRACT_ADDRESS as `0x${string}`,
      abi: faucetABI,
      functionName: 'dispenseNativeToken',
      args: [body.recipient],
      account,
    });

    console.log('Simulation successful, sending transaction...');

    // If simulation succeeds, send the actual transaction
    const result = await walletClient.writeContract(evmRequest);
    console.log('Transaction hash:', result);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (err) {
    console.log({ err });
    return NextResponse.json(
      { error: formatErrorMessage(err) },
      {
        status: 500,
      },
    );
  }
}
