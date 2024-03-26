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

   With this step, you are ready to mint the non-fungible token.
   The simplest way to do that is using the `mint-NFT` helper function defined in the `marmalade-v2.util` contract.

## Mint the non-fungible token

The `mint-NFT` helper function defined in the `marmalade-v2.util` contract is similar to the `mint-basic-NFT` function used in [Get started with Marmalade](/build/nft-marmalade/get-started).
Like the `mint-basic-NFT` function, you can access the `mint-NFT` function using the Chainweaver desktop or web application.

To mint the non-fungible token uploaded to IPFS:

1. Open and unlock the Chainweaver desktop or web application.
2. Select **Testnet** as the network to connect to the Kadena test network.
3. Click **Contracts**, then click **Module Explorer**.
4. Under **Deployed Contracts**, select the `marmalade-v2.util` contract, then click **View**.
5. Under Functions, select **mint-NFT**, then click **Call**. 
6. On the Parameters tab, set the **uri**, **policies**, and **guard** information, then click **Next**.
   
   - Set the **uri** to point to the content identifier for the metadata file for the token.
     For this walk-through, the **uri** for the metadata file for the token is:
     `ipfs://bafkreibtpwfidowlbmxblew2lyghgy2tctvcazsfcjxk3ozgnm5a33uc4m/guitar1.json`

   - Set the **policies** to identify the policies to enforce for the token.
     For this walk-through, the token uses the following policies: 
     [marmalade-v2.non-fungible-policy-v1,marmalade-v2.guard-policy-v1]

   - Set the **guard** to authorize a specific keyset or another guard to mint the token.
     For this walk-through, the guard can be read from the transaction using `(read-keyset "my-keyset")`.

7. On the Configuration tab, select the **Transaction Sender**, review transaction settings, and select the keyset to use, then click **Next**.
8. On the Sign tab, select an Unrestricted Signing key, then click **Next**.
9. On the Preview tab, scroll to see the Raw Response is **true**, then click **Submit**.
   
   After you submit the transaction, it is queued for processing in the memory pool until validated and added to a block.
   After the transaction is included in a block, your NFT is part of the permanent blockchain record and added to the Marmalade ledger.

   ![Successful mint transaction](/assets/marmalade/tx-successful-nft.png)

## Review the mint transaction

The `mint` transaction emits several events to report the operations performed.
You can view these events in the Kadena block explorer.

To review your transaction results:

1. Copy the **Request Key** displayed in Chainweaver, then click **Done**.
2. Open the [Kadena Testnet block explorer](explorer.chainweb.com/testnet).
3. Select **Request Key**, then paste the key you copied from Chainweaver into the Search field.
4. Review the transaction results and the events recorded for the mint transaction.
   
   For example, you should also see a set of events similar to the following:

   ![Events related to minting a non-fungible token](/assets/marmalade/create-nft-events.png)
   
## Start a sale with an offer

Now that your token is recorded in the Marmalade ledger, you can transfer it to another account or offer it for sale.
In this simple example, there's no royalty policy associated with the token because it isn't intended to generate an ongoing revenue stream.
However, the token owner can still offer the token for sale.

The offer can include a specific quoted price or be configured without a quoted price.
If an offer doesn't have a quoted price, it can be configure to use either a **conventional auction** or a **dutch auction** contract to attract buyers to bid on the work.
You can find an introduction to sales-specific contracts like these auction contracts in [Layered contract architecture](/build/nft-marmalade/contract-architecture#sales-specific-contracts).
Regardless of the sales model you choose, you enter the token marketplace by submitting the offer transaction.

## Next steps

This walk-through demonstrated the workflow for creating a non-fungible token (NFT) using the Marmalade standard with permanent storage on IPFS.
To learn more about configuring auction contracts, see [Auctions](/build/nft-marmalade/auctions).
To learn more about creating and using your own sale contract, see [Sale contracts](/build/nft-marmalade/sale-contracts).
For technical reference information about any Marmalade smart contract, see [NFT marketplace](/reference/marmalade).