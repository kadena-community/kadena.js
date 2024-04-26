---
title: Store digital assets
description: Ensure the long-term storage and availability of non-fungible tokens.
menu: Non-fungible tokens (NFT)
label: Store digital assets
order: 5
layout: full
---

# Store digital assets

In [Describe tokens in metadata](/build/nft-marmalade/metadata), you saw how token attributes are defined using an off-chain JSON file. 
When you create and mint tokens, you must provide the uniform resource identifier for the metadata that describes your non-fungible token or token collection.
Because storing your digital assets is a critical part of the process, one of your first decision is how to make the assets available using an off-chain storage option.

There are many possible ways you could store digital assets, including a public node that you manage yourself, a cloud service provider, or a distributed file system service.
In general, you should consider the long-term accessibility required to ensure the sustainability of the asset.

As an example, two protocols that are designed to handle long-term storage and global accessibility are the **InterPlanetary File System (IPFS)** and **Arweave**.

## Using IPFS

The InterPlanetary File System (IPFS) is a file storage protocol designed to allow distributed file sharing, storage, and access over a peer-to-peer network.
You can use this distributed file system to store you digital assets and the corresponding metadata, so that the data remains available and accessible for tokens minted using the Marmalade standard and recorded in the Marmalade ledger.

### Store a single NFT

The following example demonstrates how to store a single image and its metadata using the InterPlanetary File System (IPFS). 
The example uses sample paths and content identifiers to illustrate how to store and access the image.

To store a single NFT on IPFS:

1. Upload the image asset to IPFS.

2. Record the content identifier (CI)D for the asset you uploaded.
   
   For example, `Bayfabc...`.

3. Update the metadata file so that the `image` property is the path to the content identifier.
   
   For example, `ipfs://Bayfabc.../1.jpg`.

4. Upload the metadata file to IPFS.

5. Retrieve the content identifier for the uploaded metadata file.
   
   For example, `ipfs://Bayfxyz.../metadata.json" `.

For an example of storing a non-fungible token using IPFS, see [Create a non-fungible token](/build/nft-marmalade/create-nft).

### Store an NFT collection

The following example demonstrates how to store a collection of images and the corresponding metadata using the InterPlanetary File System (IPFS). 
The example uses sample paths and content identifiers to illustrate how to store and access the image.

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

For an example of storing a non-fungible token collection using IPFS, see [Create a token collection](/build/nft-marmalade/create-a-collection).

### Verify the metadata details

The metadata files that you upload for your image or collection adhere to the Marmalade [metadata schema](/build/nft-marmalade/metadata). 
In this schema, the `image` field should contain a link to the image on IPFS
as illustrated in the previous examples.

### Create the token in the ledger

To create the token in the Marmalade ledger, you should use the link from IPFS (`.json`) as the URI.
For example, each token should have a link to a JSON file similar to the following:

```
ipfs://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna/1.json
```

To use the `create-token` function:

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

When you call the `get-uri` function and pass in a token ID, the function accesses the `tokens` map, finds the row corresponding to the provided token ID, and returns the value stored in the `'uri` field of that row. 

## Leveraging Arweave with Akord

Given the immutable characteristic of NFTs, the associated data's long-term
accessibility and sustainability are critical aspects to consider. 
Akord has
emerged as a powerful tool to handle these requirements, and its importance is
underscored in the context of Marmalade.

Arweave is a pioneering protocol designed to modernize the internet's
foundational structures, augmenting its capacity for storing, addressing, and
accessing data. 
This technology is central to our approach to dealing with NFT
data, ensuring its perpetual availability and integrity and thereby
strengthening the overall dependability of the NFTs hosted on Marmalade.

### What is Akord?

Akord is a platform built on the Arweave blockchain that helps NFT projects and creators get the most out of permanent storage and data ownership. 
Akord facilitates easy uploading to Arweave, caching, reposting, file management, end-to-end encryption, notifications, token-gated access, private messaging, note creation and more. 

Everything in Akord happens through public or private digital vaults, where you can invite others and set access control. 

### How is Akord different?
While there are other products that also provide data storage on Arweave, Akord has some key differentiating features.

- **The easiest and cheapest way to upload to Arweave**. Akord makes it simple to upload to Arweave via the [API](https://docs.akord.com/api-and-dev-tools/quickest-way-to-upload-to-arweave), [CLI](https://docs.akord.com/api-and-dev-tools/build/cli) or [app](https://v2.akord.com/signup). The only service to offer free Arweave storage, 100 MB on [signup](https://v2.akord.com/signup), their prices are also the [cheapest in the ecosystem](https://akord.com/pricing).

- **A secure space to manage on-chain data**. Akord’s advanced system of end-to-end encryption not only secures your files and messages, but uses key rotation to facilitate collaboration within private vaults.
  
- **A focus on user experience for developers and end users**. Akord’s vision is to make the power of web3 accessible to everyone, a vision shared by Kadena.

### Use Akord

All users get [100 MB of free permanent storage on Arweave](https://v2.akord.com/signup) when signing up, it literally takes a minute. 

- [**Storing NFT assets on Arweave**](https://docs.akord.com/nfts/storing-nft-assets-on-arweave-100-mb-free). Learn how to store NFT assets on Arweave using Akord, and how to manage your data by generating a manifest.
- [**Simple API upload to Arweave**](https://docs.akord.com/api-and-dev-tools/simple-api-upload-to-arweave). A super simple, fast way to upload to Arweave with no tokens or wallets needed.
- [**Full developer documentation**](https://docs.akord.com/api-and-dev-tools/learn). Developers can learn about Akord protocol, the [API](https://docs.akord.com/api-and-dev-tools/quickest-way-to-upload-to-arweave), and open source [CLI](https://docs.akord.com/api-and-dev-tools/build/cli) and [JavaScript SDK](https://github.com/Akord-com/akord-js), as well as how to publish a website on Arweave.
- [**Use the intuitive web app**](https://v2.akord.com/signup). The Akord web app abstracts away the complexities of web3 and makes it easy to store any of your data, personal or professional, on Arweave. 

For any questions, contact the team in their [Discord](https://discord.com/invite/DVkyUtcKGn). 