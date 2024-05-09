---
title: Start a sale
description: Demonstrates how to put a non-fungible token up for sale using a conventional auction as the sale type.
menu: Sales
label: Start a sale
order: 5
layout: full
---

# Start a sale

After you have control of a token in the Marmalade ledger, you can transfer it to another account or offer it for sale.
As you learned in [What is Marmalade?](/build/nft-marmalade), a sale is a two-step process defined in a pact.
All token sales—whether they use a fixed quoted price or allow bidding—start with an offer.

To start the sales process for a non-fungible token:

1. Open and unlock the Chainweaver desktop or web application.
2. Select **Testnet** as the network to connect to the Kadena test network.
3. Click **Contracts**, then click **Module Explorer**.
4. Under **Deployed Contracts**, select the `marmalade-v2.ledger` contract, then click **View**.
5. Under Pacts, select **sale**, then click **View** to view the signature for the **sale** pact.
   
   The signature indicates that you need to provide the the **id**, **seller**, **amount**, and **timeout** information.

   In the Contracts editor panel, clear any text displayed, then type the required information for the **sale** pact.
   
   - Set the **id** to the token identifier that you want to offer for sale.
     For this example, the **id** for the token is `t:jEDZtohdLCkbsbFTlVrgVOQOYckgSLHHWQsXKry8jO0`.

   - Set the **seller** to the account that owns the token.
     For this example, the seller is `k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e`.

   - Set the **amount** to number of tokens for sale.
     For non-fungible tokens, the amount is always 1.0. 
     If you applied the non-fungible policy to the token, the policy manager enforces this amount and any other amount will fail.
   
   - Set the **timeout** to the number of blocks you want to wait before you can withdraw from the sale. 
     The timeout is optional, so for this example, it is set to zero.

   ```pact
   (marmalade-v2.ledger.sale "t:jEDZtohdLCkbsbFTlVrgVOQOYckgSLHHWQsXKry8jO0" "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" 1.0 0)
   ```  

2. Click **Deploy** to display the transaction details Configuration tab.

1. Select the **Transaction Sender** and **Chain ID**, review transaction settings, then click **Advanced**.
3. Click the **Raw** tab and add the quote specification for the sale as a JSON object.
   
   The raw form for the quote specification looks like this:
   
   ```json
   "quote" : {
     "fungible": coin
     ,"sale-price": 0.0
     ,"seller-fungible-account": {
          "account": "k:seller"
          ,"guard": {"keys": ["seller"], "pred": "keys-all"}
        }
     ,"sale-type": "marmalade-sale.contract-type"
   }
   ```
   
   However, the reference to the fungible `coin` module is a bit more complicated than it looks in its raw form.
   It must include references to the `fungible-xchain-v1` and `fungible-v2` specifications.
   In the following example, the quote specification includes the references, seller account information, and the type of sale contract to use—in this case, the sale type is a conventional auction:
   
   ```json
   {
    "quote": {
      "fungible": {
        "refSpec":[
          {"namespace":null,"name":"fungible-xchain-v1"},
          {"namespace":null,"name":"fungible-v2"}],
        "refName":{
          "namespace":null,"name":"coin"}
        },
        "sale-price": 0.0,
        "seller-fungible-account": {
          "account": "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e",
          "guard": {
              "keys": ["bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"], 
              "pred": "keys-all"
            }
        },
        "sale-type": "marmalade-sale.conventional-auction"
        }
   }
   ```
  
   After you add the quote specification to the Raw tab, click **Next**.

1. On the Sign tab, click the Grant Capabilities plus (+) to add the OFFER capability to the transaction and specify the same arguments as you specified for the **sale** pact.
   
   In this example, the OFFER capabilities look like this:
   
   ```pact
   (marmalade-v2.ledger.OFFER "t:jEDZtohdLCkbsbFTlVrgVOQOYckgSLHHWQsXKry8jO0" "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" 1.0 0)
   ```

2. Select the account to pay for **coin.GAS** and the account you want to grant the **marmalade-v2.ledger.OFFER** capability, then click **Next**.
3. On the Preview tab, review the transaction details and verify that there are no errors in the Raw Response, then click **Submit**.

   After you submit the transaction, it is queued for processing in the memory pool until validated and added to a block.
   After the transaction is included in a block, you can view the transaction results in the block explorer.

   ![Token offered for sale](/assets/marmalade/sales-tx.png)

   In the transaction results, you'll notice that there's a Continuation section and several events. 
   Within the events, there are two important pieces of information, the **pact-id** and **escrow account** that now holds the token awaiting a buyer.
   In this example:
   
   - The pact-id is **M1uFQ7OCI7kw_-93UglWzVMy0DGO1uUllyCnJR5eo6w**.
   - The escrow account is **c:nRIVifc_ClgWSAM8N0qsvpl8eD5kI_exsTqdGaN6We4**.

   ![Sale events](/assets/marmalade/sales-tx-events.png)

## Next steps

Congratulations! 
You have made your digital asset available on the marketplace.
Well, almost.
You've selected a type of sale—the conventional auction—but haven't configured any auction details.
To complete the first part of the sales process, you need to create a conventional auction with start and end times and a reserve price. 
To continue with this example, see [Create an auction](/build/nft-marmalade/sales/create-an-auction).