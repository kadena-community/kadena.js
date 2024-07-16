import { useEffect } from "react";
import { buyToken, getEscrowAccount } from "@kadena/client-utils/marmalade";
import { getWebauthnGuard, getWebauthnAccount } from "@kadena/client-utils/webauthn";
import * as styles from "@/styles/sale.css"
import { env } from "@/utils/env";
import { MonoAutoFixHigh, MonoAccountBalanceWallet, MonoAccessTime } from '@kadena/kode-icons';
import { Stack, Button } from "@kadena/kode-ui";
import { createSignWithSpireKey } from "@/utils/signWithSpireKey";
import { Sale } from "@/hooks/getSales";
import { useRouter, useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAccount } from "@/hooks/account";
import { PactNumber } from "@kadena/pactjs";
import { generateSpireKeyGasCapability } from "@/utils/helper";
import CrudCard from '@/components/CrudCard';

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
    <>
      <CrudCard
        headingSize="h3"
        titleIcon={<MonoAutoFixHigh />}
        title="View a Sale"
        description={[
          "View Available Sales and Buy",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi",
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia"
        ]}
      >
      <img
        src={tokenImageUrl}
        alt="Token Image"
        className={styles.tokenImageClass}
      />
      </CrudCard>
      <CrudCard       
        title="Sale Information"
        description= {[]}
      >
        <div className={styles.tokenInfoClass}>
          Price: {sale.startPrice}

        <Button variant="primary" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
      </CrudCard>
    </>
  );
}
