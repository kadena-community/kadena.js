---
title: Binary encoding
description:
  Provides reference information for the chainweb-node block header binary encoding.
menu: Chainweb API
label: Binary encoding
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Block header binary encoding

The binary format for chain graphs of degree three is defined in `Chainweb.BlockHeader`.

| Size | Bytes | Value
| ---- | ----- | -----
| 8	| 0-7	| flags
| 8	| 8-15 | time
| 32 | 16-47 | parent
| 110 | 48-157 | adjacents
| 32 | 158-189 | target
| 32 | 190-221 | payload
| 4 | 222-225 | chain
| 32 | 226-257 | weight
| 8 | 258-265 | height
| 4	| 266-269	| version
| 8	| 270-277	| epoch start
| 8	| 278-285	| nonce
| 32 | 286-317 | hash

total: 318 bytes

## Adjacent parents record 

The binary format for adjacent parents (length 3):

| Bytes	| Value
| ----- | -----
| 0-1	| length
| 2-109	| adjacents

total: 110 bytes

## Adjacent parent

| Bytes	| Value
| ----- | -----
| 0-3	| chain
| 4-35 | hash

total: 36 bytes

## Proof of work and field values

Arithmetic operations and comparisons on `parent`, `target`, `weight`, and `hash` interpret the value as unsigned 256-bit integral numbers in little endian encoding. 
All operations are performed using rational arithmetic of unlimited precision and the final result is rounded. 
For details about how the result is rounded, consult the source code directly.

### Time stamps

The `time` and `epoch start` values are a little endian twos complement encoded integral numbers that count SI microseconds since the start of the POSIX/UNIX epoch (leap seconds are ignored). 
These numbers are always positive (highest bit is 0).

### Numbers

The `height` is a little endian encoded unsigned integral 64 bit number.
The `length` is a little endian encoded unsigned integral 16 bit number.

### Version

The `version` field identifies the Chainweb version. 
It is a 32 bit value in little endian encoding. 
Values up to 0x0000FFFF are reserved for production versions, including includes development and testnets.

| Value	| Version
| ----- | -------
| 0x00000005 | mainnet01
| 0x00000001 | development
| 0x00000007 | testnet04

### Other

The `nonce` is any sequence of 8 bytes that is only compared for equality.
The `chain` is any sequence of 4 bytes that identifies a chain and can be compared for equality.
The `payload` is any sequence of 32 bytes that is a cryptographic hash of the payload associated with the block and can be compared for equality.
flags are eight bytes of value 0x0 that are reserved for future use.

## Work header binary encoding

The work bytes received from the `/miner/work` endpoint is slightly different than the above header format. 
These headers do not include the block hash, instead prefixing the header above (without hash) with chain id and hash target bytes.

The first 36 bytes are informational. 
Only the bytes from position 36 to the end are the subject of the proof of work hash computation.

The final 8 bytes are the nonce. 
The creation time is encoded in bytes 44-52 (see above for details of the encoding). 
Miners are allowed, but not required, to update the time to reflect the solve time for the block more closely. 
A larger value for the creation time increases the accuracy of the difficulty adjustment which is in the interest of miners.
The high difficulty guarantees that the outcome of the race of winning blocks is determined by actual hash power. 
However, blocks that are predated (that is, have a creation time that is in the future) are rejected during block header validation. 
Leaving the time unchanged is a valid choice.

Miners must not change or make any assumptions about the content of the "reserved" bytes.

Defined in `Chainweb.Miner.Core`:

| Size | Bytes | Work bytes |	Value
| ---- | ----- | ---------- | -----
| 4	| 0-3	| NA | chain
| 32 | 4-35	| NA | hash-target
| 8 | 36-43 | 0-7 | reserved
| 8	| 44-51	| 8-15 | time
| 298	| 52-313 | 16-277	| reserved
| 8 | 314-321	| 278-285	| nonce

total: 322 bytes

For arithmetic comparisons the `hash-target` is interpreted as unsigned 256 bit integral number in little endian encoding.

The `time` is a little endian twos complement encoded integral number that counts SI microseconds since the start of the POSIX/UNIX epoch (leap seconds are ignored). The value is always positive (highest bit is 0).