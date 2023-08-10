---
title: Metadata Standard
description: What is the Marmalade v2 Metadata Standard
menu: Metadata Standard
label: Metadata Standard
order: 6
layout: normal
---

# Metadata standard

The Marmalade v2 metadata standard, serves as a crucial component for
constructing a comprehensive and comprehensible profile for each NFT. Now, it
may seem a little intimidating at first glance, but when you break it down, it's
really a guide to how we describe the unique features of each Non-Fungible Token
(NFT) on the Marmalade platform.

This schema provides the structural foundation for key attributes of an NFT,
each representing an integral facet of the NFT's identity. However, the schema
also allows for the addition of arbitrary properties that serve to enhance the
individuality of each token.

## JSON standard

A significant characteristic of marmalade involves the URI attribute, a pointer
to an off-chain JSON file. This design ensures the delivery of usefull
information on tokens without straining the constraints imposed by on-chain data
storage fees.

The off-chain schema contains properties that describe the metadata of an NFT
stored off-chain in a JSON format. The schema includes the following fields:

| **Field Name**  |  **Data Type**   |                                                                                                                           **Description**                                                                                                                           |
| :-------------- | :--------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| name            |      string      |                                                                                                          Identifies the asset to which this NFT represents                                                                                                          |
| description     |      string      |                                                                                                          Describes the asset to which this NFT represents                                                                                                           |
| \*image         |      string      |                   A URI pointing to a resource with mime type image/\* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.                    |
| \*properties    |      object      |                                                                                               Arbitrary properties. Values may be strings, numbers, object or arrays.                                                                                               |
| \*authors       | array of objects |                                                               An array of authors who created or contributed to the asset. Each author is an object with a "name" field specifying the author's name.                                                               |
| \*external_url  |      string      |                                                                                            URL to an external application or website where users can also view the asset                                                                                            |
| \*animation_url |      string      | URL to a multimedia attachment of the asset. The supported file formats are MP4 and MOV for video, MP3, FLAC and WAV for audio, GLB for AR/3D assets, and HTML for HTML pages. You may use the ?ext={file_extension} query to provide information on the file type. |
| \*collection    |      object      |                                                 an object with a "name" field specifying the name of the collection, and a “family” field specifying the larger category or group to which the collection belongs.                                                  |

\* optional

##

### JSON Schema

     {
      "title": "Token Metadata",
      "description": "Schema for non-fungible token (NFT) metadata.",
      "type": "object",
      "required": [
        "name",
        "description",
      ],
      "properties": {
        "name": {
          "type": "string",
          "description": "Identifies the asset to which this NFT represents."
        },
        "description": {
          "type": "string",
          "description": "Describes the asset to which this NFT represents."
        },
        "image": {
          "type": "string",
          "format": "uri",
          "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
        },
        "properties": {
          "type": "object",
          "description": "Arbitrary properties. Values may be strings, numbers, objects or arrays."
        },
        "external_url": {
          "type": "string",
          "format": "uri",
          "description": "URL to an external application or website where users can also view the asset."
        },
        "animation_url": {
          "type": "string",
          "format": "uri",
          "description": "URL to a multimedia attachment of the asset. The supported file formats are MP4 and MOV for video, MP3, FLAC and WAV for audio, GLB for AR/3D assets, and HTML for HTML pages. You may use the ?ext={file_extension} query to provide information on the file type."
        },
        "authors": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "The author's name."
              }
            }
          },
          "description": "An array of authors who created or contributed to the asset."
        },
        "collection": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The name of the collection."
            },
            "family": {
              "type": "string",
              "description": "The larger category or group to which the collection belongs."
            }
          },
          "description": "An object specifying the name and family of the collection to which this NFT belongs."
        }
      }
    }

---

The Marmalade v2 metadata standard for Non-Fungible Tokens (NFTs) adheres
closely to the widely recognised ERC1155 "metadata standard". By aligning with
this well-established standard, Marmalade enables seamless portability and
interoperability of NFTs between the Ethereum network and the Kadena blockchain.

Both standards share similar fundamental attributes for describing NFTs.
Marmalade v2 also supports additional optional fields, including "properties,"
which allow for the inclusion of arbitrary properties to enhance the uniqueness
and individuality of each token. Similarly, the ERC1155 "metadata" standard"
includes the "properties" field, ensuring compatibility between the two
standards in terms of extensibility.

Another addittion to Marmalade v2 is the inclusion of the "authors" field, which
enables the attribution of the individuals who created or contributed to the
asset. This promotes transparency and recognition of the artistic and creative
contributions associated with each NFT.

Marmalade v2 recognises the importance of categorisation and collection
organization. The "collection" field in Marmalade v2, allows for specifying the
name and family of the collection to which the NFT belongs. This categorisation
provides context and grouping, facilitating efficient management and discovery
of NFTs within a broader ecosystem.

In summary, Marmalade's adoption of the ERC1155 "metadata standard" showcases a
dedication to following established industry norms, ensuring consistency,
compatibility, and ease of migration for NFTs. This commitment enables a broader
range of users to participate in the vibrant world of digital collectibles while
fostering interoperability between different blockchain ecosystems.

---

A more extensive metadata guide with some JSON examples can be found on our
github
[here](https://github.com/kadena-io/marmalade/blob/v2/README.md#marmalade-v2-metadata-standard)
