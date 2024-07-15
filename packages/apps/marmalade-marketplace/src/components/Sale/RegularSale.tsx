import { useEffect } from "react";
import { buyToken, getEscrowAccount } from "@kadena/client-utils/marmalade";
import { getWebauthnGuard, getWebauthnAccount } from "@kadena/client-utils/webauthn";
import * as styles from "@/styles/sale.css"
import { env } from "@/utils/env";
import { Button } from "@kadena/kode-ui";
import { createSignWithSpireKey } from "@/utils/signWithSpireKey";
import { Sale } from "@/hooks/getSales";
import { useRouter, useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAccount } from "@/hooks/account";
import { PactNumber } from "@kadena/pactjs";
import { generateSpireKeyGasCapability } from "@/utils/helper";

export interface RegularSaleProps {
  tokenImageUrl: string;
  sale: Sale
}

export function RegularSale({ tokenImageUrl, sale }: RegularSaleProps) {

  const router = useRouter() as AppRouterInstance;
  const searchParams = useSearchParams();
  const { account } = useAccount();

  useEffect(() => {

    const transaction = searchParams.get("transaction");
    if (transaction) {
      router.push('/transaction?transaction=' + transaction);
    }

  }, [])

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: sale.chainId,
    sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
  };

  console.log(account  , "ACCOUNT")
  const handleBuyNow = async () => {
    if (!account?.alias) {
      alert("Please connect your wallet first to buy.");
      return;
    }

    const webauthnGuard = await getWebauthnGuard({
      account: account.accountName,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
    }) as {
      keys: string[];
      pred: "keys-all" | "keys-2" | "keys-any";
    }

    const webauthnAccount:string = await getWebauthnAccount({
      account: account.accountName,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
    }) as string

    const escrowAccount = await getEscrowAccount({
      saleId: sale.saleId,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
    }) as { account: string }
    console.log("signer",  webauthnGuard)

    console.log("escrowAccount", escrowAccount);

    try {
      await buyToken({
        tokenId: sale.tokenId,
        saleId: sale.saleId,
        amount: new PactNumber(sale.amount).toPactDecimal(),
        chainId: sale.chainId,
        seller: {
          account: sale.seller.account,
        },
        signer: webauthnGuard.keys[0],
        buyer: {
          account: webauthnAccount,
          keyset: webauthnGuard
        },
        buyerFungibleAccount: account.accountName,
        capabilities: [
          ...generateSpireKeyGasCapability(account.accountName)!,
          {
            name: `${env.WEBAUTHN_WALLET}.TRANSFER`,
            props: [account.accountName, escrowAccount["account"], new PactNumber(sale.startPrice).toPactDecimal()]
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
    <div className={styles.twoColumnRow}>
      <img
        src={tokenImageUrl}
        alt="Token Image"
        className={styles.tokenImageClass}
      />
      <div className={styles.tokenInfoClass}>
        Price: {sale.startPrice}

        <Button variant="primary" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}
