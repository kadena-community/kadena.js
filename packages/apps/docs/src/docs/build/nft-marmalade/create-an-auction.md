---
title: Create an auction
description: Demonstrates how to create a conventional auction to sell a token.
menu: Sales
label: Create an auction 
order: 5
layout: full
---

# Create an auction

So far, you've seen how to start a sale pact that uses a specific type of sale contract.
Depending on the type of sale contract you attach to a the pact, you need to set the appropriate parameters to handle the mechanics of the sale, including when the sale starts and ends and a starting price.
In this example, the sale is a conventional auction that starts with a low price and allows potential buyers to submit bids.

To create a conventional auction for a non-fungible token:

1. Open and unlock the Chainweaver desktop or web application.
2. Select **Testnet** as the network to connect to the Kadena test network.
3. Click **Contracts**, then click **Module Explorer**.
4. Under **Deployed Contracts**, search for the `marmalade-sale` contracts.
5. Select the `marmalade-sale.conventional-auction` contract, then click **View**.
6. Under Functions, select **create-auction**, then click **Call**.
      
   - Set the **sale-id** to the pact identifier for the sale pact.
     For this example, the **sale-id** is `M1uFQ7OCI7kw_-93UglWzVMy0DGO1uUllyCnJR5eo6w`.

   - Set the **token-id** to the token identifier that you have for sale.
     For this example, the **token-id** for the token is `t:jEDZtohdLCkbsbFTlVrgVOQOYckgSLHHWQsXKry8jO0`.

   - Set the **start-time** to an integer that represents when you want the auction to start.
     You can use the `marmalade-v2.util-v1` contract to look up the current time (`curr-time`) or convert a time (`to-timestamp`) to an integer. For example, the `to-timestamp` function converts the input (time "2024-04-29T00:00:00Z") to 1714348800.0
     For this example, the start time is `1714348800`.

   - Set the **end-time** to an integer that represents when you want the auction to end. 
     For this example, the end time is `1714608000`.

   - Set the **reserve-prince** to lowest bid you are willing to accept.
     For this example, the start time is `5.0`.

   For example:
   
   ```pact
   (marmalade-sale.conventional-auction.create-auction "M1uFQ7OCI7kw_-93UglWzVMy0DGO1uUllyCnJR5eo6w" "t:jEDZtohdLCkbsbFTlVrgVOQOYckgSLHHWQsXKry8jO0" 1714348800 1714608000 5.0)
   ```  

7. Click **Deploy** to display the transaction details Configuration tab.

8. Select the **Transaction Sender** and **Chain ID**, review transaction settings, then click **Next**.

9.  On the Sign tab, click the Grant Capabilities plus (+) to add the MANAGE_AUCTION capability to the transaction and specify the sale identifier and the token identifier.
   
   In this example, the MANAGE_AUCTION capabilities look like this:
   
   ```pact
   (marmalade-sale.MANAGE_AUCTION  "M1uFQ7OCI7kw_-93UglWzVMy0DGO1uUllyCnJR5eo6w" "t:jEDZtohdLCkbsbFTlVrgVOQOYckgSLHHWQsXKry8jO0)
   ```

10. Select the account to pay for **coin.GAS** and the account you want to grant the **marmalade-sale.MANAGE_AUCTION** capability , then click **Next**.
11. On the Preview tab, review the transaction details and verify that the Raw Response is a string—in this example, **"E2zl-Y_MWBQ39nliHZdrbs1ooC35y9iJGurVDpmJjfo"**—then click **Submit**.

   After you submit the transaction, it is queued for processing in the memory pool until validated and added to a block.
   After the transaction is included in a block, you can view the transaction results in the block explorer.

   ![Token offered for sale](/assets/marmalade/sales-tx.png)

   In the transaction results, you'll notice that there's a Continuation section and several events. 
   Within the events, there are two important pieces of information, the pact-id and escrow account that now holds the token awaiting a buyer.
   In this example, the pact-id is **M1uFQ7OCI7kw_-93UglWzVMy0DGO1uUllyCnJR5eo6w** and the escrow account is **c:nRIVifc_ClgWSAM8N0qsvpl8eD5kI_exsTqdGaN6We4**.

   ![Sale events](/assets/marmalade/sales-tx-events.png)

## Next steps

Congratulations! 
You have made your digital asset available on the marketplace.
Well, almost.
You've selected a type of sale—the conventional auction—but haven't configure any auction details.