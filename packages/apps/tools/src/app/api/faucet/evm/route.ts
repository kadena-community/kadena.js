import faucetABI from '@/contracts/faucet-abi.json';
import type { EVMChainId } from '@/utils/evm';
import {
  createServerUrl,
  formatErrorMessage,
  getChainwebEVMChain,
  getPublicClient,
} from '@/utils/evm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createWalletClient, http, parseGwei } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { checkRecaptcha } from './utils/captcha';

const PRIVATE_KEY = process.env.EVMFAUCET_PRIVATE_KEY as `0x${string}`;
const EVMFAUCET_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_EVMFAUCET_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_EVMRPC_URL;
const MAX_PRIORITY_FEE_CAP_GWEI =
  (process.env.NEXT_PUBLIC_MAX_PRIORITY_FEE_CAP_GWEI as string) ?? '0.000001'; // 1000 wei cap default

// Create the faucet account from private key

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown as {
    recipient: string;
    chainId: EVMChainId;
    token: string; //this is for recaptcha check
  };

  console.log('Faucet request body:', body);

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

  const publicClient = getPublicClient(body.chainId, true);

  // Estimating and setting a cap so that the faucet doesn't get caught up in the high gas feedback loop that happens when relying only on Viem's estimation
  const block = await publicClient.getBlock();
  const baseFeePerGas = block.baseFeePerGas ?? BigInt(0);
  const estimatedFees = await publicClient.estimateFeesPerGas();
  const cappedPriorityFee = parseGwei(MAX_PRIORITY_FEE_CAP_GWEI);

  console.log('Base fee per gas:', baseFeePerGas.toString());
  console.log(
    'Estimated max priority fee per gas:',
    estimatedFees.maxPriorityFeePerGas.toString(),
  );
  console.log('Capped max priority fee per gas:', cappedPriorityFee.toString());

  // Use estimated or capped value, whichever is lower
  const maxPriorityFee =
    estimatedFees.maxPriorityFeePerGas > cappedPriorityFee
      ? cappedPriorityFee
      : estimatedFees.maxPriorityFeePerGas;

  const maxFeePerGas = baseFeePerGas + maxPriorityFee;

  console.log('Using max priority fee per gas:', maxPriorityFee.toString());
  console.log('Using max fee per gas:', maxFeePerGas.toString());

  // First simulate the transaction to check for errors
  try {
    const { request: evmRequest } = await publicClient.simulateContract({
      address: process.env
        .NEXT_PUBLIC_EVMFAUCET_CONTRACT_ADDRESS as `0x${string}`,
      abi: faucetABI,
      functionName: 'dispenseNativeToken',
      args: [body.recipient],
      account,
      maxPriorityFeePerGas: maxPriorityFee,
      maxFeePerGas: maxFeePerGas,
    });

    console.log('Simulation successful, sending transaction...');

    // If simulation succeeds, send the actual transaction
    const result = await walletClient.writeContract(evmRequest);
    console.log('Transaction hash:', result);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      { error: formatErrorMessage(err) },
      {
        status: 500,
      },
    );
  }
}
