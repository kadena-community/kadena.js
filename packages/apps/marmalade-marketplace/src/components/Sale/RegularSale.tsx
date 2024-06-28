import { useEffect } from "react";
import { buyToken, getEscrowAccount } from "@kadena/client-utils/marmalade";
import { getWebauthnGuard } from "@kadena/client-utils/webauthn";
import * as styles from "@/styles/sale.css"
import { env } from "@/utils/env";
import { Button } from "@kadena/react-ui";
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

  const handleBuyNow = async () => {
    if (!account?.alias) {
      alert("Please connect your wallet first to buy.");
      return;
    }

    const webauthnGuard = getWebauthnGuard(account.accountName)


    const escrowAccount = await getEscrowAccount({
      saleId: sale.saleId,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
    })

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
        buyer: {
          account: account.accountName,
          keyset: getWebauthnGuard(account.accountName)
        },
        buyerFungibleAccount: account.accountName,
        capabilities: [
          ...generateSpireKeyGasCapability(account.accountName)!,
          {
            name: `${env.WEBAUTHN_WALLET}.TRANSFER`,
            props: [account.accountName, escrowAccount["account"], sale.startPrice]
          },
          {name: `marmalade-v2.ledger.BUY`, 
            props: ["t:4V-JVwklwR0L43KOybc0PS5JtOMb0C_qMWgdruIout0","k:3a9582c99cee1ee4bb2bdd995960d595c39776e5917bc43e8cdc71b645e0720e","c:HaVXI-z_P3Br5zmh9M0KZTe-LdnYUcKEJvDOwEmyJpo",1,"3lxvBSQNSklQc22RqfaVOWMuE_YmtqEQFRcx3vTZsiw"]
          }
        ],
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
