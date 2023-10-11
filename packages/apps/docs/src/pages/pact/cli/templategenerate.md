---
title: template-generate
description: Kadena makes blockchain work for everyone.
menu: template-generate
label: template-generate
order: 2
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/tools/pactjs-cli/README.md
layout: full
tags: [pactjs,cli,client,contracts]
lastModifiedDate: Thu, 06 Jul 2023 12:02:09 GMT
---
# template-generate

Generate statically typed generators for templates

| **Parameter** | **Description**                                     | **Required** | **Default value** |
| ------------- | --------------------------------------------------- | ------------ | ----------------- |
| -c, clean     | Clean existing template                             | No           |                   |
| -f, --file    | File or directory to use to generate the client     | Yes          |                   |
| -o, --out     | Output file/directory to place the generated client | Yes          |                   |

Generate a client from a template

```sh
pactjs template-generate --file ./contractDir --out ./myContract.pact
```

[1]: https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact

[2]: https://api.chainweb.com
