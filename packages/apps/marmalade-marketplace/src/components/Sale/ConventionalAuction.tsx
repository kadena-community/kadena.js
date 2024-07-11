import { useEffect, useState } from "react";
import { buyToken, escrowAccount, getAuctionDetails, getBid, withdrawToken } from "@kadena/client-utils/marmalade";
import * as styles from "@/styles/sale.css"
import { env } from "@/utils/env";
import { Button, Stack } from "@kadena/kode-ui";
import { parsePactDate } from "@/utils/date";
import { IPactInt } from "../../../../../libs/types/dist/types";
import { Sale } from "@/hooks/getSales";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAccount } from "@/hooks/account";
import { createSignWithSpireKey } from "@/utils/signWithSpireKey";
import { PactNumber } from "@kadena/pactjs";
import { getBids } from "@/hooks/getBids";

export interface ConventionalAuctionProps {
  tokenImageUrl: string;
  sale: Sale
}

export function ConventionalAuction({ tokenImageUrl, sale }: ConventionalAuctionProps) {

  const router = useRouter() as AppRouterInstance;
  const { account } = useAccount();
  const [auctionDetails, setAuctionDetails] = useState();
  const [mustCreateAuction, setMustCreateAuction] = useState(false);
  const [highestBid, setHighestBid] = useState();

  const { data: bids } = getBids({ tokenId: sale.tokenId });

  const startDate = parsePactDate(auctionDetails?.["start-date"] as unknown as IPactInt);
  const endDate = parsePactDate(auctionDetails?.["end-date"] as unknown as IPactInt);

  const isEndDateInPast = endDate && endDate.getTime() < new Date().getTime();

  const isActive = !isEndDateInPast && sale.status === "CREATED";

  const isSellerConnected = account?.alias === auctionDetails?.["seller"];

  useEffect(() => {
    async function fetch() {

      let auctionDetails;
      try {
        auctionDetails = await getAuctionDetails({
          auctionConfig: {
            conventional: true
          },
          saleId: sale.saleId,
          chainId: sale.chainId,
          networkId: env.NETWORK_NAME,
          host: env.CHAINWEB_API_HOST
        });
      } catch {
        setMustCreateAuction(true);
        return;
      }

      console.log("auctionDetails", auctionDetails);

      setAuctionDetails(auctionDetails)

      const highestBid = await getBid({
        bidId: auctionDetails?.["highest-bid-id"],
        chainId: sale.chainId,
        networkId: env.NETWORK_NAME,
        host: env.CHAINWEB_API_HOST,
      })

      console.log("highestBid", highestBid);
      setHighestBid(highestBid);
    }

    fetch();
  }, [])

  const handleOnWithdraw = async () => {

    if (!auctionDetails) return;

    if (!isSellerConnected) {
      alert("Only the seller can initiate withdrawal.");
      return;
    }

    const config = {
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
      sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
    };

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

  const handleOnClaim = async () => {

    if (!auctionDetails || !highestBid) return;

    if (!account) {
      alert("Please connect your wallet to claim the token.");
      return;
    }

    if (highestBid["bidder"] !== account.accountName) {
      alert("Only the highest bidder can claim the token.");
      return;
    }

    const config = {
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
      sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
    };

    const escrowAccountResult = await escrowAccount({
      saleId: sale.saleId,
      chainId: sale.chainId,
      networkId: env.NETWORK_NAME,
      host: env.CHAINWEB_API_HOST,
    })

    try {
      await buyToken({
        signer: "",
        auctionConfig: {
          conventional: true
        },
        escrow: {
          account: escrowAccountResult as string
        },
        updatedPrice: new PactNumber(highestBid["bid"]).toPactDecimal(),
        tokenId: auctionDetails?.["token-id"],
        saleId: sale.saleId,
        amount: new PactNumber(sale.amount).toPactDecimal(),
        chainId: sale.chainId,
        seller: {
          account: sale.seller.account,
        },
        buyer: {
          account: highestBid["bidder"],
          keyset: highestBid["bidder-guard"]
        },
      }, {
        ...config,
        "defaults": { "networkId": config.networkId, meta: { "chainId": sale.chainId } }
      }).execute();

    } catch (error) {
      alert("Error claiming token")
      console.error(error);
    }
  }

  console.log('bids', bids)

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

        {mustCreateAuction && <>
          <span>No auction found, did you forgot to initiate the auction?</span>
          <hr />
        </>}

        {startDate && <span>Start Date: {startDate.toLocaleString()}</span>}
        {endDate && <span>End Date: {endDate.toLocaleString()}</span>}

        {!mustCreateAuction && (
          <>
            <hr />
            <span>Reserve Price: {auctionDetails?.["reserve-price"]}</span>
          </>
        )}

        {!!highestBid && (
          <>
            <hr />
            <span>Highest bid:</span>
            <div className={styles.bidClass}>
              <span>{highestBid["bid"]}</span>
              <span>{highestBid["bidder"]}</span>
            </div>
            <hr />
          </>
        )}

        {!isActive && isEndDateInPast && sale.status === "CREATED" && (
          <>
            {bids.length === 0 && (
              <Button variant="primary" onClick={handleOnWithdraw}>
                Withdraw
              </Button>
            )}
            <Button variant="primary" onClick={handleOnClaim}>
              Claim
            </Button>
          </>
        )}


        {!mustCreateAuction && <span>Bid history:</span>}

        <div>
          <Stack
            flexDirection="column"
            gap="xs"
          >
            {bids.map(bid => (
              <div className={styles.bidClass}
                key={bid.bidId}
              >
                <span>{bid.bid}</span>
                <span>{bid.bidder.account}</span>
              </div>
            ))}
          </Stack>
        </div>
      </div >
    </div >
  );
}
