---
title: Describe tokens in metadata
description: Set token properties for digital assets using the Marmalade metadata standard.
menu: Non-fungible tokens (NFT)
label: Describe tokens in metadata
order: 5
layout: full
---

# Describe tokens in metadata

The Marmalade metadata schema provides the structural foundation for describing the key attributes and identifying properties of a token using a simple JSON file.
By describing token properties using the metadata schema, you can ensure the token is compatible with marketplaces and wallets that rely on metadata, making the tokens more accessible and long-term storage and distribution more flexible.

## Using recognized metadata standards

The Marmalade metadata standard for non-fungible tokens (NFTs) largely conforms to the well-established Ethereum metadata standard to support portability and between the Ethereum network and the Kadena blockchain.
For example, both standards describe the fundamental NFT attributes the same way, including a `properties` field that you can use to define arbitrary properties to enhance the uniqueness and individuality of each token.
However, the Marmalade metadata also supports several additional fields, including the following:

- An `authors` field that you can use to identify the individuals who created or contributed to the asset, promoting transparency and recognition of the artistic and creative contributions associated with each NFT.

- A `collection` field that you can use to specify the name and family of the collection to which the NFT belongs, enabling you to organize and categorize tokens for efficient management and discovery of NFTs within a broader ecosystem.

## Defining attributes in JSON

As you saw in [Get started with Marmalade](/build/nft-marmalade/get-started), minting a token requires you to specify a uniform resource identifier (URI). 
The `uri` is a pointer to the off-chain JSON file that describes the token. 
Storing the path to the metadata ensures that token information is available without consuming the on-chain resources or incurring by on-chain data
storage fees.

The metadata for a token contains the properties that describe the token in JSON format using the following fields:

| Field name | Data type | Description |
| :--------- | :-------: | :---------- |
| name | string | Required field that identifies the asset that the NFT represents. |
| description |string | Required field that describes the asset that the NFT represents. |
| image | string | A URI pointing to a resource with mime type image/\* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive. |
| properties | object | Arbitrary properties. Values may be strings, numbers, object or arrays. |
| authors| array of objects | An array of authors who created or contributed to the asset. Each author is an object with a "name" field specifying the author's name.                                                               |
| external_url | string | URL to an external application or website where users can also view the asset. |
| animation_url | string | URL to a multimedia attachment of the asset. The supported file formats are MP4 and MOV for video, MP3, FLAC and WAV for audio, GLB for AR/3D assets, and HTML for HTML pages. You may use the ?ext={file_extension} query to provide information on the file type. |
| collection | object | An object with a "name" field specifying the name of the collection, and a “family” field specifying the larger category or group to which the collection belongs.                                                  |

### JSON Schema

```json
{
  "title": "Token Metadata",
  "description": "Schema for non-fungible token (NFT) metadata.",
  "type": "object",
  "required": ["name", "description"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Identifies the asset that this NFT represents."
    },
    "description": {
      "type": "string",
      "description": "Describes the asset that this NFT represents."
    },
    "image": {
      "type": "string",
      "format": "uri",
      "description": "Specifies a URI pointing to a resource with mime type image/* representing the asset that this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
    },
    "properties": {
      "type": "object",
      "description": "Arbitrary properties. Values may be strings, numbers, objects, or arrays."
    },
    "external_url": {
      "type": "string",
      "format": "uri",
      "description": "Specifies a URL to an external application or website where users can also view the asset."
    },
    "animation_url": {
      "type": "string",
      "format": "uri",
      "description": "Specifies a URL to a multimedia attachment of the asset. The supported file formats are MP4 and MOV for video; MP3, FLAC and WAV for audio; GLB for AR/3D assets; and HTML for HTML pages. You can use the ?ext={file_extension} query to provide information on the file type."
    },
    "authors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Specifies one or more contributor names."
          }
        }
      },
      "description": "Specifies an array of authors who created or contributed to the asset."
    },
    "collection": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Specifies the name of the collection."
        },
        "family": {
          "type": "string",
          "description": "Specifies a larger category or group to which the collection belongs."
        }
      },
      "description": "Specifies the name and family of the collection to which this NFT belongs."
    }
  }
}
```

### Basic example

```json
{
  "name": "My NFT",
  "description": "This is my awesome NFT",
  "image": "https://example.com/my-nft.jpg"
}
```

### Additional fields example

```json
{
  "name": "My NFT",
  "description": "This is my non-fungible token.",
  "image": "https://example.com/image.png",
  "external_url": "https://example.com",
  "animation_url": "https://example.com/animation.mp4",
  "authors": [
    {
      "name": "John Doe"
    },
    {
      "name": "Jane Smith"
    }
  ],
  "collection": {
    "name": "My Collection",
    "family": "Art"
  }
}
```

### Properties example

```json
{
  "name": "Sword of the Thunder God",
  "description": "A legendary sword imbued with the power of the thunder god.",
  "image": "https://example.com/sword-of-thunder-god.jpg",
  "properties": {
    "damage": 50,
    "element": "Thunder",
    "rarity": "Legendary"
  },
  "external_url": "https://example.com/sword-of-thunder-god",
  "authors": [
    {
      "name": "John Smith"
    }
  ],
  "collection": {
    "name": "Legendary Weapons",
    "family": "Fantasy"
  }
}
```

## Pact schema

The Marmalade off-chain metadata schema for non-fungible tokens (NFTs) conforms
to the widely accepted standard for NFT metadata.
In Pact, the token schema has the following structure:

```pact
    (defschema token-schema
      id:string
      uri:string
      precision:integer
      supply:decimal
      policies:[module{kip.token-policy-v2}]
    )
```

In this structure, the `uri` is a string representing the URI to an off-chain metadata for the NFT in JSON format.
