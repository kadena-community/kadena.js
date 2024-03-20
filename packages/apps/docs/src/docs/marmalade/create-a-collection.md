---
title: Create a token collection
description: This guide demonstrates how to create a non-fungible token collection using the Marmalade standard with permanent storage on IPFS.
menu: Non-fungible tokens (NFT)
label: Create a token collection
order: 2
layout: full
tags: [NFT, marketplace, non-fungible tokens, minting, marmalade, v2]
---

# Create a token collection

Many token creators generate non-fungible tokens in collections with a common theme or categorize their creative work by media, style, or subject.
Creating a collection is similar to creating an individual non-fungible token as described in [Create a non-fungible token](/build/nft-marmalade/create-nft) except that you need a metadata file that describes the collection in addition to a metadata file for each token that's part of the collection.
You can use the built-in `collection-policy` to identify the collection and the tokens that are part of collection.

The `collection-policy` helps organize tokens into a curated group that can be uploaded and stored together.
The policy does generate a collection of tokens.
If you use tools that automate token generation and metadata, you should evaluate the generated metadata to ensure that it conforms with the Marmalade metadata schema.

For demonstration purposes, the sample collection consists of portable network graphics.

## Identify the collection

After you have created the artwork in a digital format, you can create the collection using the create-collection function in ChainWeaver.

To identify the collection:

1. Create a folder for the collection and move all of the digital artwork into the folder.
   In this example, the folder **Luxi-Dupree** contains the collection of digital images.

   You can rename the files in the collection to use sequential numbering—for example, 1.jpg, 2.jpg, and so on—to make them easier to reference.

2. Open and unlock the Chainweaver desktop or web application.

3. Select **Testnet** as the network to connect to, click **Contracts**, then click **Module Explorer**.

4. Under **Deployed Contracts**, select the `marmalade-v2.collection-policy` contract, then click **View**.

5. Under Functions, select **create-collection**, then click **Call**. 

6. On the Parameters tab, set the **collection-name**, **collection-size**, **operator guard** and **operator-account** information, then click **Next**.
   
   - Set the **collection-name** to the name you'll use in the token metadata. In this example, the collection name is `luxi-dupree`.

   - Set the **collection-size** to the number of tokens include in collection. In this example, the collection size is eight images.

   - Set the **operator-guard** to authorize a specific keyset or another guard to create the collection.
     In this example, the guard can be read from the transaction using `(read-keyset "my-keyset")`.

   - Set the **operator-account** to the account curating the token collection.
     In this example, the account is a single-key account with funds on the test network `k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e`.

7. On the Configuration tab, select the **Transaction Sender**, review transaction settings, and select the keyset to use, then click **Next**.
8. On the Sign tab, select an Unrestricted Signing key, then click **Next**.
9. On the Preview tab, scroll to see the Raw Response is **true**, then click **Submit**.

   After you submit the transaction, it is queued for processing in the memory pool until validated and added to a block.
   After the transaction is included in a block, you can view the transaction results in the block explorer.

   ![Successful collection creation](/assets/marmalade/collection.png)

## Upload the digital assets

As noted in [Store digital assets](/build/nft-marmalade/storage), there are many ways you can store digital assets, including hosting the collection yourself, using a cloud service provider like Google or AWS, or uploading to a distributed file storage service like the InterPlanetary File System (IPFS).
   
There are also many tools available for uploading digital files for permanent storage. 
For example, you can use NFT.Storage with NFTUp, IPFS Desktop, Pinata, or any other tool to upload files and generate the content identifier (CID) for your work.

To upload the collection:

1. Upload the folder containing the collection to a storage location that provides permanent internet access to the digital asset.
   
   In this example, uploading the `luxi-dupree` folder to IPFS generated the following content identifier and links:
   
   | For the image&nbsp;file | Uploaded example result 
   | :----------------- | :----------------------
   | Content&nbsp;identifier | `bafybeigzjyhvnq3ipdkipms2pd2ytebg3rb5mdqha5pytnitaeb7uel56y`
   | IPFS URL | `ipfs://bafybeigzjyhvnq3ipdkipms2pd2ytebg3rb5mdqha5pytnitaeb7uel56y`
   | Gateway URL | `https://nftstorage.link/ipfs/bafybeigzjyhvnq3ipdkipms2pd2ytebg3rb5mdqha5pytnitaeb7uel56y`

1. Click the gateway URL to verify the assets in the collection are stored in IPFS.
2. Copy the IPFS URL for the collection to use in the metadata for each asset.
   
## Create the metadata for each asset

Now that you have an content identifier that describes the location of each asset, you can create the metadata for each asset in the collection.
In this example, the asset file names were left unchanged, but the metadata files use sequential numbering.

To create the metadata:

1. Create the metadata to describe each asset in the collection using the Marmalade metadata schema.
   
   For example, the metadata for each asset—`1.json`, `2.json`, and so on—might contain information similar to the following `1.json` metadata file that describes the `sleeping-on-dream-machine.jpg` image. 
   
   ```json
   {
      "name": "Dupree and The Dream Machine",
      "description": "Dupree falls asleep on the couch with The Dream Machine as his pillow.",
      "image": "ipfs://bafybeigzjyhvnq3ipdkipms2pd2ytebg3rb5mdqha5pytnitaeb7uel56y/sleeping-on-dream-machine.jpg",
      "external_url": "https://bafybeigzjyhvnq3ipdkipms2pd2ytebg3rb5mdqha5pytnitaeb7uel56y.ipfs.nftstorage.link/sleeping-on-dream-machine.jpg",
      "authors": [
          {
              "name": "Lola Pistola"
          }
      ],
      "collection": {
          "name": "luxi-dupree",
          "family": "Dogs"
      }    
   }
   ```

2. Create a folder for the collection metadata.
   In this example, the folder **luxi-dupree-metadata** contains the metadata files for each asset in the collection of digital images.

3. Upload the folder containing the metadata files to IPFS.
   
   In this example, uploading the **luxi-dupree-metadata** folder to IPFS generated the following content identifier and links:
   
   | For the JSON file | Uploaded example result 
   | :---------------- | :----------------------
   | Content&nbsp;identifier | `bafybeic43pacmyel2bavpahsbrd4daknvizoyrpcsazxhrs6zmvwx5wlqu`
   | IPFS URL | `ipfs://bafybeic43pacmyel2bavpahsbrd4daknvizoyrpcsazxhrs6zmvwx5wlqu`
   | Gateway URL | `https://nftstorage.link/ipfs/bafybeic43pacmyel2bavpahsbrd4daknvizoyrpcsazxhrs6zmvwx5wlqu`
   
4. Copy the content identifier for the metadata folder and append the name of each metadata file.
   
   `ipfs://bafybeic43pacmyel2bavpahsbrd4daknvizoyrpcsazxhrs6zmvwx5wlqu/1.json`

   With this step, you are ready to create and mint the non-fungible tokens in the collection.

## Create a token identifier

Each token in the collection needs a unique identifier that links the token metadata to the collection identifier.
You can create token identifiers using the `create-token-id` function in the `marmalade-v2.ledger` contract.
As before, you can use the Chainweaver desktop or web application to navigate to contract functions and **Testnet** as the network to connect to

To create a token identifier:

1. In Chainweaver, click **Contracts**, then click **Module Explorer**.

1. Under **Deployed Contracts**, select the `marmalade-v2.ledger` contract, then click **View**.

2. Under Functions, select **create-token-id**, then click **Call**. 
   
1. On the Parameters tab, you need to specify the **token-details** and a **creation-guard**.
   
   In this example, the **token-details** for the metadata file that describes the first token in the collection look like this:
   
   ```json
   {
     "uri": "ipfs://bafybeic43pacmyel2bavpahsbrd4daknvizoyrpcsazxhrs6zmvwx5wlqu/1.json",
     "precision": 0,
     "policies": [marmalade-v2.non-fungible-policy-v1,marmalade-v2.guard-policy-v1,marmalade-v2.collection-policy-v1]
   }
   ```
   
   As this example illustrates, for the tokens in a collection, you should typically apply the built-in guard and collection policies.
   The guard policy protects the tokens from unauthorized activity and the collection policy is required to associate the tokens with the correct collection you've defined for them.
   To configure the guard policy, you'll need to register the accounts that can perform the activities you want to restrict access to.
   
   You can use **(read-keyset "my-keyset")** for the **creation-guard** to read the keyset from information you configure in the transaction details.

   After configuring the parameters for the create-token-id function, click **Next**.

1. On the Configuration tab, select the **Transaction Sender** and, under Advanced, configure a keyset and key, then click **Next**.

1. On the Sign tab, select an unrestricted signing key from the available Unrestricted Signing Keys, then click **Next**.

   Note that you aren't required to select a transaction sender or a signing key to create a token identifier. 
   However, this information is required to submit a transaction that records the token identifier in the blockchain.

2. On the Preview tab, scroll to see the **Raw Response** is a token identifier.
   If you want to submit the transaction, click **Submit**.
   Otherwise, copy the token identifier and close the **create-token-id** function call window.

   In this example, the token identifier created is:
   "t:BRY_BIznnBWXuXlzKHg8Ha-s6k_4YTf1ctOfsz3CeWg"

## Create a token in the collection

TODO:
To create a token in the collection:

id: "t:BRY_BIznnBWXuXlzKHg8Ha-s6k_4YTf1ctOfsz3CeWg"
precision: 0
uri: "ipfs://bafybeic43pacmyel2bavpahsbrd4daknvizoyrpcsazxhrs6zmvwx5wlqu/1.json"
policies: [marmalade-v2.non-fungible-policy-v1,marmalade-v2.guard-policy-v1,marmalade-v2.collection-policy-v1]
creation-guard: (read-keyset "my-keyset")

## Mint the token

TODO:
To mint the token for the collection:

## Create a collection identifier

"collection:MawFy7BSJMkatOJ07y_e0tYbPE26K_q8x0ACX5C25B8"

## Get collection information

TODO:
get-collection
{
   "id": "collection:MawFy7BSJMkatOJ07y_e0tYbPE26K_q8x0ACX5C25B8",
   "max-size": 8,
   "name": "luxi-dupree",
   "operator-account": "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e","operator-guard": KeySet {
      keys: [bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e],
      pred: keys-all
      },
   "size": 0
}

## Configure the guard policy

TODO:

To configure the guard policy: