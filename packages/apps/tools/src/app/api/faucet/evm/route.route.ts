import { getEVMProvider } from '@/utils/evm';
import type { ChainId } from '@kadena/types';
import { ethers } from 'ethers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DEFAULT_AMOUNT = '20'; // KDA amount to send
const PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const CAPTCHAKEY = process.env.CAPTCHA_SECRETKEY;

const checkRecaptcha = async (token: string) => {
  console.log({
    secret: CAPTCHAKEY,
    response: token,
  });
  const result = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHAKEY}&response=${token}`,
  );

  const data = await result.json();
  return data;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown as {
    name: string;
    chainId: ChainId;
    token: string; //this is for recaptcha check
  };

  if (!PRIVATE_KEY || !RPC_URL) {
    return NextResponse.json(
      { message: 'missing env variables' },
      { status: 500 },
    );
  }

  const captchaResult: any = await checkRecaptcha(body.token);
  console.log({ captchaResult });
  if (!captchaResult?.success) {
    return NextResponse.json(
      {
        message: 'this is a bot',
      },
      { status: 500 },
    );
  }

  const provider = getEVMProvider(body.chainId);

  if (!body.name || !ethers.isAddress(body.name)) {
    return NextResponse.json(
      {
        message: 'Invalid Ethereum address',
      },
      { status: 404 },
    );
  }

  const faucetWallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const balance = await provider.getBalance(faucetWallet.address);
  const sendAmount = ethers.parseEther(DEFAULT_AMOUNT);

  if (balance < sendAmount) {
    return NextResponse.json(
      {
        message: 'Faucet has insufficient funds',
      },
      { status: 500 },
    );
  }

  const tx = await faucetWallet.sendTransaction({
    to: body.name,
    value: sendAmount,
  });

  // console.log({ tx });
  // const receipt = await tx.wait();

  return NextResponse.json(tx, {
    status: 200,
  });
}
