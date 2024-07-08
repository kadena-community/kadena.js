import { useEffect, useState } from "react";
import { buyToken, getAuctionDetails, getEscrowAccount, withdrawToken } from "@kadena/client-utils/marmalade";
import * as styles from "@/styles/sale.css"
import { env } from "@/utils/env";
import { Button } from "@kadena/kode-ui";
import { getTimeUntilNextPriceChange, parsePactDate } from "@/utils/date";
import { IPactInt } from "../../../../../libs/types/dist/types";
import { getCurrentPrice } from "@/utils/sale";
import { useAccount } from "@/hooks/account";
import { createSignWithSpireKey } from "@/utils/signWithSpireKey";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Sale } from "@/hooks/getSales";
import { PactNumber } from "@kadena/pactjs";
import { Pact, createClient, createSignWithKeypair } from "@kadena/client";

export interface DutchAuctionProps {
  tokenImageUrl: string;
  sale: Sale
}

export function DutchAuction({ tokenImageUrl, sale }: DutchAuctionProps) {

  const router = useRouter() as AppRouterInstance;
  const { account } = useAccount();

  const [auctionDetails, setAuctionDetails] = useState();
  const [currentPrice, setCurrentPrice] = useState(0);
  const [nextPriceChange, setNextPriceChange] = useState("");

  const startDate = parsePactDate(auctionDetails?.["start-date"] as unknown as IPactInt);
  const endDate = parsePactDate(auctionDetails?.["end-date"] as unknown as IPactInt);

  const isEndDateInPast = endDate && endDate.getTime() < new Date().getTime();

  const isActive = auctionDetails?.["sell-price"] === 0 && !isEndDateInPast && sale.status === "CREATED";

  const isSellerConnected = account?.alias === auctionDetails?.["seller"];

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: sale.chainId,
    sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
  };


  const updateCurrentPrice = (auctionDetails: any) => {
    const currentPrice = auctionDetails ? getCurrentPrice({
      startDate: Number((auctionDetails?.["start-date"] as unknown as IPactInt).int) * 1000,
      endDate: Number((auctionDetails?.["end-date"] as unknown as IPactInt).int) * 1000,
      startPrice: auctionDetails?.["start-price"],
      reservePrice: auctionDetails?.["reserve-price"],
      priceIntervalSeconds: Number((auctionDetails?.["price-interval-seconds"] as unknown as IPactInt).int)
    }, new Date().getTime()) : 0;

    setCurrentPrice(currentPrice)
  }

  useEffect(() => {
    async function fetch() {

      const auctionDetails = await getAuctionDetails({
        auctionConfig: {
          dutch: true
        },
        saleId: sale.saleId,
        chainId: sale.chainId,
        networkId: env.NETWORK_NAME,
        host: env.CHAINWEB_API_HOST
      });

      console.log("auctionDetails", auctionDetails);

      setAuctionDetails(auctionDetails)

      updateCurrentPrice(auctionDetails);

      const priceIntervalSeconds = Number((auctionDetails?.["price-interval-seconds"] as unknown as IPactInt).int) * 1000;
      setNextPriceChange(getTimeUntilNextPriceChange(priceIntervalSeconds, new Date().getTime()));
    }

    fetch();
  }, [])

  useEffect(() => {

    if (!auctionDetails) return;

    if (isEndDateInPast) return;

    const priceIntervalSeconds = Number((auctionDetails?.["price-interval-seconds"] as unknown as IPactInt).int) * 1000;

    const currentPriceInterval = setInterval(() => updateCurrentPrice(auctionDetails), priceIntervalSeconds);
    const priceDropInterval = setInterval(() => {
      setNextPriceChange(getTimeUntilNextPriceChange(priceIntervalSeconds, new Date().getTime()));
    }, 1000);

    return () => {
      clearInterval(currentPriceInterval);
      clearInterval(priceDropInterval);
    }

  }, [auctionDetails, isEndDateInPast]);

  const handleWithdraw = async () => {

    if (!auctionDetails) return;

    if (!isSellerConnected) {
      alert("Only the seller can initiate withdrawal.");
      return;
    }

    try {
      await withdrawToken({
        tokenId: auctionDetails?.["token-id"],
        saleId: sale.saleId,
        amount: new PactNumber(sale.amount).toPactDecimal(),
        chainId: sale.chainId,
        seller: {
          account: sale.seller.account,
          keyset: sale.seller.guard!
        },
        timeout: new PactNumber(sale.timeoutAt / 1000).toPactInteger()
      }, {
        ...config,
        "defaults": { "networkId": config.networkId, meta: { "chainId": sale.chainId } }
      }).execute();

    } catch (error) {
      alert("Error withdrawing token")
      console.error(error);
    }
  }

  const handleBuyNow = async () => {
    if (!auctionDetails) return;

    if (!account?.alias) {
      alert("Please connect your wallet first to buy.");
      return;
    }


    const FUNDING_ACCOUNT = "sender00";
    const FUNDING_ACCOUNT_PUBLIC_KEY =
      "368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca";
    const FUNDING_ACCOUNT_PRIVATE_KEY =
      "251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898";


    console.log('account', account)
    const unsignedTransaction = Pact.builder
      .execution(
        `n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.get-wallet-guard "${account.accountName}"`,
      )
      .setNetworkId(env.NETWORKID)
      .setMeta({
        chainId: sale.chainId,
        senderAccount: FUNDING_ACCOUNT,
        gasPrice: 0.00001,
        gasLimit: 150000,
        ttl: 30000,
      })
      .addSigner(
        {
          pubKey: FUNDING_ACCOUNT_PUBLIC_KEY,
          scheme: "ED25519",
        },
        (withCap) => [
          withCap(`coin.GAS`),
        ]
      )
      .createTransaction();

    const signWithKeypair = createSignWithKeypair({
      publicKey: FUNDING_ACCOUNT_PUBLIC_KEY,
      secretKey: FUNDING_ACCOUNT_PRIVATE_KEY,
    });
    const transaction = await signWithKeypair(unsignedTransaction);

    const HOST = `${env.CHAINWEB_API_HOST}/chainweb/0.0/${env.NETWORK_NAME}/chain/${sale.chainId}/pact`;
    const client = createClient(HOST);

    const command = await client.local(transaction)

    console.log('command', command)

    const isSuccess = command.result.status === "success";

    if (!isSuccess) {
      console.error(command.result);
      alert("Error buying token")
      return;
    }

    const escrowAccountResult = await getEscrowAccount({
      saleId: sale.saleId,
      chainId: sale.chainId,
      networkId: env.NETWORK_NAME,
      host: env.CHAINWEB_API_HOST,
    }) as string | { account?: string };

    try {
      await buyToken({
        auctionConfig: {
          dutch: true
        },
        escrow: {
          account: typeof escrowAccountResult === "string"
          ? escrowAccountResult
          : "account" in escrowAccountResult && escrowAccountResult.account
            ? escrowAccountResult.account
            : escrowAccountResult as string,
        },
        updatedPrice: new PactNumber(currentPrice).toPactDecimal(),
        tokenId: auctionDetails?.["token-id"],
        saleId: sale.saleId,
        amount: new PactNumber(sale.amount).toPactDecimal(),
        chainId: sale.chainId,
        seller: {
          account: sale.seller.account,
        },
        buyer: {
          account: account?.accountName,
          keyset: {
            keys: [(command.result as any).data],
            pred: "keys-all"
          }
        },
      }, {
        ...config,
        "defaults": { "networkId": config.networkId, meta: { "chainId": sale.chainId } }
      }).execute();

    } catch (error) {
      alert("Error buying token")
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
        {!isActive && <>
          <span>Auction has ended</span>
          <hr />
        </>}

        {startDate && <span>Start Date: {startDate.toLocaleString()}</span>}
        {endDate && <span>End Date: {endDate.toLocaleString()}</span>}
        <hr />
        <span>Starting Price: {auctionDetails?.["start-price"]}</span>
        <span>Reserve Price: {auctionDetails?.["reserve-price"]}</span>

        {isActive && (
          <span>Current Price: {currentPrice}</span>
        )}

        {!isActive && !isEndDateInPast && (
          <span>Sold for: {auctionDetails?.["sell-price"]}</span>
        )}

        {isActive && (
          <>
            <Button variant="primary" onClick={handleBuyNow}>
              Buy Now
            </Button>

            <hr />
            <span>Next price drop: {nextPriceChange}</span>
            <hr />
          </>
        )}

        {!isActive && isEndDateInPast && sale.status !== "WITHDRAWN" && (
          <Button variant="primary" onClick={handleWithdraw}>
            Withdraw
          </Button>
        )}
      </div>
    </div >
  );
}
