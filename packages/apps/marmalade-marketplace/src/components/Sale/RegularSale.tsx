import { useEffect } from "react";
import { buyToken, getEscrowAccount } from "@kadena/client-utils/marmalade";
import * as styles from "@/styles/sale.css"
import { env } from "@/utils/env";
import { Button } from "@kadena/kode-ui";
import { createSignWithSpireKeySDK } from "@/utils/signWithSpireKey";
import { useTransaction } from '@/hooks/transaction';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { Sale } from "@/hooks/getSales";
import { useRouter, useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAccount } from "@/hooks/account";
import { PactNumber } from "@kadena/pactjs";
import { generateSpireKeyGasCapability } from "@/utils/helper";

export interface RegularSaleProps {
  tokenImageUrl: string;
  sale: Sale;
}

export function RegularSale({ tokenImageUrl, sale }: RegularSaleProps) {
  const { setTransaction } = useTransaction();

  const router = useRouter() as AppRouterInstance;
  const searchParams = useSearchParams();
  const { account } = useAccount();

  useEffect(() => {

    const transaction = searchParams.get("transaction");
    if (transaction) {
      router.push('/transaction?transaction=' + transaction);
    }

  }, [])
  
  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens`);
  }
    const config = {
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
      sign: createSignWithSpireKeySDK([account], onTransactionSigned),
    };
  
    console.log(env)
  const handleBuyNow = async () => {
    if (!account) {
      alert("Please connect your wallet first to buy.");
      return;
    }

    const escrowAccount = await getEscrowAccount({
      saleId: sale.saleId,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
    }) as { account: string }

    // TODO: Update key to r:account's public key 
    const key = ''

    try {
      await buyToken({
        tokenId: sale.tokenId,
        saleId: sale.saleId,
        amount: new PactNumber(sale.amount).toPactDecimal(),
        chainId: sale.chainId,
        seller: {
          account: sale.seller.account,
        },
        signer: key || '', 
        buyer: {
          account: account.accountName,
          keyset: account.guard,
        },
        buyerFungibleAccount: account.accountName,
        capabilities: [
          ...generateSpireKeyGasCapability(account.accountName)!,          
          {name: `marmalade-v2.ledger.BUY`, 
            props: [sale.tokenId, sale.seller.account, account.accountName, 1.0, sale.saleId]
          },
        ],
        meta: {senderAccount: account.accountName}
      },
        {
          ...config,
          "defaults": { "networkId": config.networkId, meta: { "chainId": sale.chainId } }
        }).execute();

      } catch (error) {
      console.error(error);
    }
  }

  return (
    <Button variant="primary" onClick={handleBuyNow}>
      Buy Now
    </Button>
  );
}
