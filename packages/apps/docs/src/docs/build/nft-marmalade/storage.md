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

## Using Arweave with Akord

**Arweave** is a data storage blockchain, designed specifically to permanently store data on-chain with one upfront payment. As an on-chain storage solution, data is immutable and timestamped. Its permanence is guaranteed by an on-chain endowment, which ensures miners are incentivized to store data for a minimum of 200 years.

**Akord** provides a web app, API, CLI and SDK to easily upload and manage data on Arweave. To use Arweave for storing your NFT assets, take the following steps.

### Upload assets with the Akord app


You get 100 MB free on sign up and can easily upload in a few minutes using the web app. 

1. [Sign up](https://v2.akord.com/signup), login and follow the instructions to create an “NFT assets” vault. 

![Kadena Docs-1](https://github.com/kadena-community/kadena.js/assets/57722629/075c3c75-2a79-4ffa-b715-435c93b63a0c)

2. Upload your file to the vault and wait for it to be successfully committed on the Arweave blockchain, normally 5-15 minutes. 


### Upload with the Akord API

1. Create your account in seconds](https://v2.akord.com/signup) (100 MB free to test your workflow).

2. Get your [API key here](https://v2.akord.com/account/developers).

```javascript
const fs = require('fs').promises;
const data = await fs.readFile('/path/to/your/file.txt', 'utf8'); //nodejs specific

const response = await fetch('https://api.akord.com/files', {
method: 'POST',
headers: {
'Accept': 'application/json',
'Api-Key': 'your_api_key',
'Content-Type': 'text/plain'
},
body: data
});
```
That's it! You just uploaded the file to Arweave.

For example responses, API uploads with tags, multipart uploads for larger files, and full documentation on the API, please [check out the Akord API docs here](https://docs.akord.com/).


### Upload with Akord CLI

You can also use the Akord CLI to upload by syncing with S3 or a local directory. 

For a complete guide, [check out the Akord CLI docs here](https://docs.akord.com/nft-projects/upload-with-app-api-or-cli/sync-s3-or-local-directory-using-cli).

### Get the Arweave gateway URL

After your assets are uploaded, you’ll need the Arweave gateway URLs. This will be used for the image field in the metadata JSON.


#### Single NFT

You can get the Arweave gateway URL very easily in the Akord app by clicking the info icon on the file row:

![Kadena-Docs-2](https://github.com/kadena-community/kadena.js/assets/57722629/42c4c974-8627-4336-a6dc-a3ea0bff1fb9)

At the top you have two gateway URLs: Akord’s own gateway, akrd.net, and another popular gateway, arweave.net:

![Kadena-Docs-3](https://github.com/kadena-community/kadena.js/assets/57722629/474c44b2-0cb9-4cd8-8f7f-8ac46b4d2ee8)

All gateways follow the same scheme: https://{gateway host}/{tx-id}. On Arweave, the transaction ID is the content identifier. 


#### NFT collection

If you’re uploading multiple assets, it’s best to create an Arweave manifest in your vault to get all the transaction IDs in one JSON. 

_In the app_ you can do this by selecting “Create JSON metadata” and selecting Arweave manifest:

![Kadena-4](https://github.com/kadena-community/kadena.js/assets/57722629/9c15faf1-cc49-4895-9223-895d08e58b9c)

_From the CLI_ you can run: `akord manifest:generate <vault-id>`

For full documentation on creating manifests, [check out the Akord docs on manifests here](https://docs.akord.com/nft-projects/get-the-arweave-urls).


