---
title: IPFS Storage
description: Leveraging IPFS in Marmalade
menu: IPFS Storage
label: IPFS Storage
order: 2
layout: full
---

# Leveraging IPFS in Marmalade

Given the immutable characteristic of NFTs, the associated data's long-term
accessibility and sustainability are critical aspects to consider. IPFS has
emerged as a powerful tool to handle these requirements, and its importance is
underscored in the context of Marmalade,

IPFS is a pioneering protocol designed to modernise the internet's foundational
structures, augmenting its capacity for storing, addressing, and accessing data.
This technology is central to our approach in dealing with NFT data, ensuring
its perpetual availability and integrity and thereby strengthening the overall
dependability of the NFTs hosted on Marmalade.

Our guide offers you an easy-to-follow examples for storing your NFT data on
IPFS, aiming to make this process as effortless as possible. These best
practices, which cater to both extensive asset collections and individual NFTs,
are crafted to ensure your data's resilience and longevity in the IPFS
ecosystem.

## Guide

This guide provides our recommend approach to storing metadata and image assets
on IPFS, leveraging hypothetical paths and CIDs. Our manual illustrates two
distinctive storage scenarios and outlines the method for accessing stored data.

### Storing Collections: Step-by-Step Guide

1.  **Image Upload to IPFS:**

    - Uploading your image assets folder to IPFS, adopting sequential numbering
      for streamlined referencing (e.g., `1.jpg, 2.jpg...`).

2.  **Metadata Update:**

    - After the upload, capture the CID for the assets folder (e.g.,
      "Bayfol...").
    - Proceed to update the metadata files, correlating the image property with
      the path to CID (e.g., `ipfs://Bayfol.../1.jpg`).

3.  **Metadata Upload to IPFS:**

    - Upload the metadata files to IPFS, maintaining sequential numbering that
      corresponds with the asset (e.g., `1.json, 2.json...`).
    - Retrieve the CID for the uploaded metadata folder (e.g., "Baymetx...).

4.  **Finalizing URI:**

    - Merge the metadata folder CID (e.g., "Baymetx...") with the respective
      filename and extension to construct a comprehensive URI (e.g.,
      `ipfs://Baymetx.../1.json`).

### Example:

- **uri:**
  `ipfs://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna/1.json`
- **gateway:**
  [[click here]](https://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna.ipfs.dweb.link/1.json)

- **collection-asset-folder:**
  `ipfs://bafybeie4ktsgx4x3gnpvo2uptngez4cvvqdq75iimpnukvpee2x34yp6jm`

- **collection-asset-folder-gateway:**
  [[click here]](https://bafybeie4ktsgx4x3gnpvo2uptngez4cvvqdq75iimpnukvpee2x34yp6jm.ipfs.dweb.link/)
- **collection-metadata-folder:**
  `ipfs://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna`

- **collection-metadata-folder-gateway:**
  [[click here]](https://bafybeig4ihtm2phax2eodfpubwy467szuiieqafkoywp5khzt6cz2hqrna.ipfs.dweb.link/)

### Single NFT Storage: Step-by-Step Guide

1.  **Image and Metadata Upload to IPFS:**

    - Upload the image asset to IPFS.

2.  **Metadata Update:**

    - Upon successful upload, retrieve the CID for the asset (e.g.,
      "Bayfabc...").
    - Revise the metadata files, matching the image property with the path to
      CID (e.g., `ipfs://Bayfabc.../1.jpg`).

3.  **Metadata Upload to IPFS:**

    - Upload the metadata file to IPFS.

4.  **Finalizing URI:**

    - Retrieve the path containing the CID for the uploaded metadata file (e.g.,
      `ipfs://Bayfxyz.../metadata.json" `)

### Example:

- **uri:**
  `ipfs://bafyreiainnf575ivbxffep3xqx4d4v2jrpyz4yrggylfp5i7lru7zpfese/metadata.json`
- **gateway-link:**
  [[click here]](https://bafyreiainnf575ivbxffep3xqx4d4v2jrpyz4yrggylfp5i7lru7zpfese.ipfs.dweb.link/metadata.json)

### Metadata Structure

Your metadata files should adhere to our [JSON schema](/marmalade/metadata). The
schema provides a structure for your metadata, ensuring that necessary details
are present and formatted correctly. This schema can be found within this
readme.

In this schema, the `image` property should contain a link to the image on IPFS
(as illustrated in the previous examples).

### Token Creation in the Ledger

When creating a token in the ledger, you should use the `create-token` function.
The link obtained from IPFS (.json) serves as the URI supplied to create a token
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

Please be reminded that these CIDs are hypothetical and should be tailored to
match your specific use case and IPFS setup. A thorough understanding of the
IPFS storage mechanism is crucial, and the steps should be adjusted as
necessary.

By faithfully following these detailed steps, you can efficiently store metadata
and image assets on IPFS, associate them with NFTs, and seamlessly retrieve them
in your DApp or application.

### URI retrieval from Ledger

Retrieving the URI for a specific token from the ledger is facilitated through a
function called `get-uri`. This function requires a token ID as its argument and
returns the associated URI.

```pact
(defun get-uri:string (id:string)
  (at 'uri (read tokens id))
)

```

When you call the `get-uri` function and pass in a token ID, it will access the
`tokens` map, find the row corresponding to the provided token ID, and return
the value stored in the `'uri` field of that row. Essentially, it retrieves the
URI that corresponds to the token ID you specified.

Thus, by utilising this `get-uri` function, you can efficiently retrieve the URI
associated with any token stored within the ledger by simply providing its token
ID.
