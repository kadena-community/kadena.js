---
title: Long-term storage
description: Ensure the long-term storage and availability of non-fungible tokens.
menu: Long-term storage
label: Long-term storage
order: 1
layout: full
---

# Long-term storage options

Given the immutable characteristic of non-fungible tokens, it's important to consider the long-term accessibility and sustainability associated with the token.

Two protocols designed to handle these requirements are the **InterPlanetary File System** (IPFS) and **Arweave**.

## Using IPFS

The InterPlanetary File System (IPFS) is a file storage protocol designed to allow distributed file sharing, storage, and access over a peer-to-peer network.
You can use this distributed file system to store NFT data, so that the data remains available and accessible for NFTs hosted on the Marmalade platform.

### Store an NFT collection

The following guide describes the recommended approach to storing metadata and a collection of image assets on IPFS. 
The guide uses sample paths and content identifiers to illustrate the best practices for storing asset collections to ensure resilience and longevity in the IPFS ecosystem and how to access stored data.

To store an asset collection on IPFS:

1. Upload images to your image assets folder on IPFS.
   
   You should use sequential numbering—for example, `1.jpg`, `2.jpg`, and so on—for your images to streamline referencing them.

2. Record the content identifier (CI)D for the assets folder you uploaded images to.
   
   For example, `Bayfol...`.

3. Update the metadata file for each image so that the `image` property is the path to the content identifier for the image. 
   
   For example, `ipfs://Bayfol.../1.jpg`.

4. Upload the metadata files to IPFS, maintaining the sequential numbering that corresponds with each asset.
   
   For example, `1.json`, `2.json`, and so on.

5. Retrieve the content identifier for the uploaded metadata folder.
   
   For example, `Baymetx...`.

6. Merge the metadata folder content identifier with each image filename and extension to construct a comprehensive uniform resource identifier (URI).
   
   For example, `ipfs://Baymetx.../1.json`.

The following example illustrates the file names and links for accessing a collection on IPFS:

**uri:** `ipfs://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna/1.json`

**gateway:** [[click here]](https://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna.ipfs.dweb.link/1.json)

**collection-asset-folder:** `ipfs://bafybeie4ktsgx4x3gnpvo2uptngez4cvvqdq75iimpnukvpee2x34yp6jm`

**collection-asset-folder-gateway:** [[click here]](https://bafybeie4ktsgx4x3gnpvo2uptngez4cvvqdq75iimpnukvpee2x34yp6jm.ipfs.dweb.link/)

**collection-metadata-folder:** `ipfs://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna`

**collection-metadata-folder-gateway:** [[click here]](https://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna.ipfs.dweb.link/)

Note that these content identifiers are only intended as examples.
In addition, you should have a thorough understanding of IPFS storage and adjust the steps, as needed for your IPFS environment.

### Store a single NFT

The following guide describes the recommended approach to storing metadata and a single image on IPFS. 
The guide uses sample paths and content identifiers to illustrate the best practices for storing individual to ensure resilience and longevity in the IPFS ecosystem and how to access stored data.

To store a single NFT on IPFS:

1. Upload the image asset to IPFS.

2. Record the content identifier (CI)D for the asset you uploaded.
   
   For example, `Bayfabc...`.

3. Update the metadata file so that the `image` property is the path to the content identifier.
   
   For example, `ipfs://Bayfabc.../1.jpg`.

4. Upload the metadata file to IPFS.

5. Retrieve the content identifier for the uploaded metadata file.
   
   For example, `ipfs://Bayfxyz.../metadata.json" `.

The following example illustrates the file name and link for accessing an individual NFT on IPFS:

**uri:** `ipfs://bafyreiainnf575ivbxffep3xqx4d4v2jrpyz4yrggylfp5i7lru7zpfese/metadata.json`
**gateway-link:** [[click here]](https://bafyreiainnf575ivbxffep3xqx4d4v2jrpyz4yrggylfp5i7lru7zpfese.ipfs.dweb.link/metadata.json)

Note that these content identifiers are only intended as examples.
In addition, you should have a thorough understanding of IPFS storage and adjust the steps, as needed for your IPFS environment.

### Metadata structure

Your metadata files should adhere to the Marmalade [JSON schema](/marmalade/metadata). 
The schema provides a structure for your metadata, ensuring that necessary details are present and formatted correctly. 
You can find the schema in this readme.

In this schema, the `image` property should contain a link to the image on IPFS
as illustrated in the previous examples.

### Token creation in the ledger

When creating a token in the ledger, you should use the `create-token` function.
The link obtained from IPFS (`.json`) serves as the URI supplied to create a token
within the ledger:

```pact
(defun create-token:bool
    ( id:string
      precision:integer
      uri:string
      policies:[module{kip.token-policy-v2}]
    )
    ...
)

```

### Get the URI for a token

You can get the URI for a specific token from the ledger by calling the `get-uri` function. 
This function requires a token ID as its argument and returns the associated URI.

```pact
(defun get-uri:string (id:string)
  (at 'uri (read tokens id))
)
```

When you call the `get-uri` function and pass in a token ID, the function accesses the `tokens` map, finds the row corresponding to the provided token ID, and returns
the value stored in the `'uri` field of that row. 
Essentially, it retrieves the URI that corresponds to the token ID you specified.

## Using Arweave with Akord

Arweave is a blockchain protocol designed to provide decentralized permanent storage for data. 

The Akord application is a data storage and collaboration product that leverages the Arweave blockchain to store files, messages, and all protocol transactions. 
With Akord, files and messages are organized into vaults and your private data is end-to-end encrypted. 
With an Akord account, you own the keys that encrypt your data.

There are other products that provide data storage on Arweave.
However, Akord has some key differentiating features to consider.
For example, Akord makes it easy to sign up for an account and create a wallet with 250 MB of free storage.

In addition, Akord offers:

- **A secure space to collaborate with others**. 
Akord believes if you want to store something permanently, it's because it has a social dimension—value for others—so, they provide the tools to facilitate the collaborative process.

**A focus on user experience with a web3, decentralised vision**. 
Many decentralized applications suffer from poor user experience and performance issues. 
Akord started by focusing on the best UX possible, then matured to become a fully decentralized application.

For an example of how to store your NFT data on ArweaveSee using Akord, see the [File management](https://docs.akord.com/app/product-guides/file-management) in the Akord documentation.
Akord also offers a command-line interface—[akord-cli](https://docs.akord.com/build/akord-cli)—and a JavaScript SDK ([Akord-js](https://github.com/Akord-com/akord-js))
