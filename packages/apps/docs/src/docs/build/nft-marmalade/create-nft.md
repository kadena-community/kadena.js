---
title: Create a non-fungible token
description: This guide demonstrates how to create a non-fungible token (NFT) from artwork to marketplace using the Marmalade standard with permanent storage on IPFS.
menu: Non-fungible tokens (NFT)
label: Create a non-fungible token
order: 6
layout: full
tags: [NFT, marketplace, non-fungible tokens, minting, marmalade, v2]
---

# Create a non-fungible token

[Get started with Marmalade](/build/nft-marmalade/get-started) demonstrated how to use the `mint-basic-NFT` function and a local metadata file to mint a token for an image on the local file system.
To see a more realistic example, you need to perform some additional preliminary steps.
The topic provides a walk-though to illustrate the entire process from artwork to marketplace.

## Prepare a digital item and metadata

1. Generate the artwork in a digital format.
   
   For this walk-through, the artwork is a portable network graphic image.
   The file name for the digital image is `guitar1.png`. 

2. Create the initial metadata to describe the asset using the Marmalade metadata schema.
   
   For this walk-through, the initial metadata file—`guitar1.json`—contains the following information for the `guitar1.png` image. 
   
   ```json
   {
    "name": "Cathedral of the Acoustic Guitar",
    "description": "The power of music is amplified in the sacred Cathedral of the Acoustic Guitar.",
    "image": "guitar1.png",
    "external_url": "",
    "authors": [
        {
            "name": "Lola Pistola"
        }
    ],
    "properties": {
        "type": "acoustic",
        "cathedral": "red",
       }
   }
   ```

   Note that the `image` field is just a placeholder that will need to be replaced with the actual location for the file after you upload it to a publicly accessible network.

3. Upload the image to a storage location that provides permanent internet access to the digital asset.
   
   As noted in [Store digital assets](/build/nft-marmalade/storage), there are many ways you can store digital assets, including hosting images yourself, using a cloud service provider like Google or AWS, or uploading content to a distributed file storage service like the InterPlanetary File System (IPFS).
   
   There are also many tools available for uploading digital files for permanent storage. 
   For example, you can use NFT.Storage with NFTUp, IPFS Desktop, Pinata, or any other tool to upload files and generate the content identifier (CID) for your work.
   
   For this walk-through, uploading the `guitar1.png` image to IPFS generated the following content identifier and links:
   
   | For the image&nbsp;file | Uploaded example result 
   | :----------------- | :----------------------
   | Content&nbsp;identifier | `bafybeied7rg4uiviidrzd33wnvmrkmys3wuh5omnrmeateydo5oe25kawu`
   | IPFS URL | `ipfs://bafybeied7rg4uiviidrzd33wnvmrkmys3wuh5omnrmeateydo5oe25kawu/guitar1.png`
   | Gateway URL | `https://nftstorage.link/ipfs/bafybeied7rg4uiviidrzd33wnvmrkmys3wuh5omnrmeateydo5oe25kawu`
   
1. Update the metadata file so that the `image` field is the path to the content identifier.
   You should review the metadata carefully to ensure it has all of the descriptive information you want to include.
   
   For example:
   
   ```json
   {
    "name": "Cathedral of the Acoustic Guitar",
    "description": "The power of music is amplified in the sacred Cathedral of the Acoustic Guitar.",
    "image": "ipfs://bafybeied7rg4uiviidrzd33wnvmrkmys3wuh5omnrmeateydo5oe25kawu/guitar1.png",
    "external_url": "https://bafybeied7rg4uiviidrzd33wnvmrkmys3wuh5omnrmeateydo5oe25kawu.ipfs.nftstorage.link/",
    "authors": [
        {
            "name": "Lola Pistola"
        }
    ],
    "properties": {
        "type": "acoustic",
        "cathedral": "red",
       }
   }
   ```

2. Upload the updated metadata file to IPFS.
   
   For this walk-through, uploading the `guitar1.json` metadata to IPFS generated the following content identifier and links:
   
   | For the JSON file | Uploaded example result 
   | :---------------- | :----------------------
   | Content&nbsp;identifier | `bafkreibtpwfidowlbmxblew2lyghgy2tctvcazsfcjxk3ozgnm5a33uc4m`
   | IPFS URL | `ipfs://bafkreibtpwfidowlbmxblew2lyghgy2tctvcazsfcjxk3ozgnm5a33uc4m/guitar1.json`
   | Gateway URL | `https://nftstorage.link/ipfs/bafkreibtpwfidowlbmxblew2lyghgy2tctvcazsfcjxk3ozgnm5a33uc4m`

1. Copy the content identifier for the metadata file.

   With this step, you are ready to select policies and create the non-fungible token identifier.

## Create a token identifier

Every token must have a unique identifier that links the token metadata to the location of the asset.
You can create token identifiers using the `create-token-id` function in the `marmalade-v2.ledger` contract.
As before, you can use the Chainweaver desktop or web application to navigate to contract functions and **Testnet** as the network to connect to.

To create a token identifier:

1. In Chainweaver, click **Contracts**, then click **Module Explorer**.

1. Under **Deployed Contracts**, select the `marmalade-v2.ledger` contract, then click **View**.

2. Under Functions, select **create-token-id**, then click **Call**. 
   
1. On the Parameters tab, you need to specify the **token-details** and a **creation-guard**.
   
   In this example, the **token-details** for the metadata file that describes the first token in the collection looks like this:
   
   ```json
   {
      "uri": "ipfs://bafkreibtpwfidowlbmxblew2lyghgy2tctvcazsfcjxk3ozgnm5a33uc4m/guitar1.json",
      "precision": 0,
      "policies": [marmalade-v2.non-fungible-policy-v1,marmalade-v2.guard-policy-v1]
   }
   ```
   
   As this example illustrates, the most common concrete policies to use are the non-fungible-token and guard policies.
   If you want to enforce royalty payments, you should add the royalty policy to the list.
   The guard policy is particularly important because it protects the token from unauthorized activity.
   To configure the guard policy, you'll register the accounts that can perform the activities you want to restrict access to when you create the token.

   You can use **(read-keyset "my-keyset")** for the **creation-guard** to read the keyset from information you configure in the transaction details.

   After configuring the parameters for the **create-token-identifier** function, click **Next**.

2. On the Configuration tab, select the **Transaction Sender** and, under Advanced, configure **my-keyset** by selecting a keyset predicate and a key, then click **Next**.

3. On the Sign tab, select an unrestricted signing key from the available Unrestricted Signing Keys, then click **Next**.

   Note that you aren't required to select a transaction sender or a signing key to create a token identifier. 
   However, this information is required to submit a transaction that records the token identifier in the blockchain.

4. On the Preview tab, scroll to see the **Raw Response** is a token identifier.
   
   In this example, the token identifier generated for the new token is:
   "t:LgMWE4ZKH4H2i6Ri4ZyuWIpHCE5cJDS4HjFEzN7PnQ0"

## Create the token

Now that you have a unique identifier for the token, you can create the reference to the token on the Kadena blockchain.

To create the token:

1. In **Module Explorer**, check that you are still viewing the `marmalade-v2.ledger` contract, then select the **create-token** function and click **Call**. 
   
2. On the Parameters tab, specify the token identifier for the **id**, the token **precision**, the **uri** for the token metadata, the token **policies** you want to apply, and a **creation-guard** keyset, then click **Next**.
   
   In this example, the **id** is "t:LgMWE4ZKH4H2i6Ri4ZyuWIpHCE5cJDS4HjFEzN7PnQ0", the **precision** is 0, the **uri** is "ipfs://bafkreibtpwfidowlbmxblew2lyghgy2tctvcazsfcjxk3ozgnm5a33uc4m/guitar1.json", the **policies** are [marmalade-v2.non-fungible-policy-v1,marmalade-v2.guard-policy-v1], and the **creation-guard** is specified using (read-keyset "my-keyset").

3. On the Configuration tab, select the Transaction Sender, then click **Advanced** to select a key and a predicate function for the creation guard, then click **Next**.

4. On the Sign tab, select an unrestricted signing key from the available Unrestricted Signing Keys, then click **Next**.

5. On the Preview tab, scroll to see the Raw Response is **true**, then click **Submit**.
   
   After you submit the transaction, it is queued for processing in the memory pool until validated and added to a block.
   After the transaction is included in a block, your NFT is part of the permanent blockchain record.

## Mint the non-fungible token

The `mint` function defined in the `marmalade-v2.ledger` contract is similar to the `mint-basic-NFT` function used in [Get started with Marmalade](/build/nft-marmalade/get-started).
Like the other functions, you can access the `mint` function using the Chainweaver desktop or web application.

To mint the non-fungible token uploaded to IPFS:

1. In **Module Explorer**, check that you are still viewing the `marmalade-v2.ledger` contract, then select the **mint** function and click **Call**. 
   
2. On the Parameters tab, specify the token identifier for the **id**, the **account** for the token owner, the **guard** for the account that is authorized to mint the token, and the **amount** to mint, then click **Next**.
   
      In this example, the id is "t:LgMWE4ZKH4H2i6Ri4ZyuWIpHCE5cJDS4HjFEzN7PnQ0", the account is "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e", the guard is specified using (read-keyset "my-keyset"), and the amount is 1.0.

3. On the Configuration tab, select the **Transaction Sender** and review the General transaction settings, then click **Advanced** to verify the keyset you're using.
   
   After you select a key and a predicate function to use, click **Next**.

4. On the Sign tab, click the Grant Capabilities plus (+) to add the MINT capability to the transaction and specify the **token identifier**, **minting account**, and **amount** as arguments.

   In this example, the MINT capabilities look like this:
   
   ```text
   (marmalade-v2.ledger.MINT "t:LgMWE4ZKH4H2i6Ri4ZyuWIpHCE5cJDS4HjFEzN7PnQ0" "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" 1.0)
   ```

   After you add the capability and arguments, select an account to sign for the **coin.GAS** and **marmalade-v2.ledger.MINT** capabilities, then click **Next**.

5. On the Preview tab, scroll to see the Raw Response is **true**, then click **Submit**.
   
   After you submit the transaction, it is queued for processing in the memory pool until validated and added to a block.
   After the transaction is included in a block, your NFT is part of the permanent blockchain record and added to the Marmalade ledger.

   ![Successful mint transaction](/assets/marmalade/tx-successful-nft.png)

## Review the mint transaction

The `mint` transaction emits several events to report the operations performed.
You can view these events in the Kadena block explorer.

To review your transaction results:

1. Copy the **Request Key** displayed in Chainweaver, then click **Done**.
2. Open the [Kadena Testnet block explorer](https://explorer.chainweb.com/testnet).
3. Select **Request Key**, then paste the key you copied from Chainweaver into the Search field.
4. Review the transaction results and the events recorded for the mint transaction.
   
   For example, you should also see a set of events similar to the following:

   ![Events related to minting a non-fungible token](/assets/marmalade/create-nft-events.png)
   
## Start a sale with an offerfil

Now that your token is recorded in the Marmalade ledger, you can transfer it to another account or offer it for sale.
In this simple example, there's no royalty policy associated with the token because it isn't intended to generate an ongoing revenue stream.
However, the token owner can still offer the token for sale.

The offer can include a specific fixed quoted price or be configured with a variable quoted price that is adjusted according to the rules in a reference sale-specific contract.
If an offer doesn't have a fixed quoted price, you can be configure to use either a **conventional auction** or a **dutch auction** contract to attract buyers to bid on the work.
You can find an introduction to sales-specific contracts like these auction contracts in [Contract architecture](/build/nft-marmalade/architecture#sales-specific-contracts).
Regardless of the sales model you choose, you enter the token marketplace by submitting the offer transaction.

## Next steps

This walk-through demonstrated the workflow for creating a non-fungible token (NFT) using the Marmalade standard with permanent storage on IPFS.
To learn more about configuring sale contracts, see [Sales options](/build/nft-marmalade/sales).
To learn more about creating and using your own sale contract, see [Create a sale contract](/reference/nft-ref/sale-contracts).
For technical reference information about any Marmalade smart contract, see [NFT marketplace reference](/reference/nft-ref).