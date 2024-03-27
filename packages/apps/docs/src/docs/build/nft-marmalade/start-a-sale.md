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
All token sales—whether they use a fixed quote price or allow bidding—start with an offer.

To start the sales process for a non-fungible token:

1. Open and unlock the Chainweaver desktop or web application.
2. Select **Testnet** as the network to connect to the Kadena test network.
3. Click **Contracts**, then click **Module Explorer**.
4. Under **Deployed Contracts**, select the `marmalade-v2.leger` contract, then click **View**.
5. Under Functions, select **offer**, then click **Call**. 
6. On the Parameters tab, set the **id**, **seller**, and **amount** information, then click **Next**.
   
   - Set the **id** to the token identifier that you want to offer for sale.
     For this example, the **id** for the token is `t:jEDZtohdLCkbsbFTlVrgVOQOYckgSLHHWQsXKry8jO0`.

   - Set the **seller** to the account that owns the token.
     For this example, the seller is `k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e`.

   - Set the **amount** to number of tokens for sale.
     For non-fungible tokens, the amount is always 1.0. 
     If you applied the non-fungible policy to the token, the policy manager enforces this amount and any other amount will fail.

7. On the Configuration tab, select the **Transaction Sender**, review transaction settings, then click **Advanced**.
8. Click the **Raw** tab and add the quote specification for the sale as a JSON object.
   
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
   
   In this example, the quote specification includes the seller account information and the type of sale contract to use for this offer is a conventional auction:
   
   ```json
   {
     "fungible": {"refSpec":[{"namespace":null,"name":"fungible-xchain-v1"},{"namespace":null,"name":"fungible-v2"}],"refName":{"namespace":null,"name":"coin"}}
     ,"sale-price": 0.0
     ,"seller-fungible-account": {
          "account": "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"
          ,"guard": {"keys": ["bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"], "pred": "keys-all"}
        }
     ,"sale-type": "marmalade-sale.conventional-auction"
   }
   ```

   8. On the Sign tab, select an Unrestricted Signing key, then click **Next**.

