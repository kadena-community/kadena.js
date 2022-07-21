<p align="center">
  <picture>
    <source srcset="./common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
    <img src="./common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
  </picture>
</p>

# Contributing to Kadena.js

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to Kadena.js, which is hosted here 
[Kadena.js](https://github.com/kadena-io/kadena.js) on GitHub.

### Table Of Contents

- Code of Conduct
- Kadena & Kadena.js
- Kadena.js and Packages
- Issues
- Pull Requests


### Questions
If you have any question please use one of the following methods:

* [ask a question on stackoverflow](https://stackoverflow.com/questions/tagged/kadena)
* [join our discord](http://discord.io/kadena)

> **note** please do not use our issue board for asking a question 


## Code of Conduct 


## Kadena & Kadena.js

Kadena was founded on the idea that blockchain could revolutionize how the world interacts and transacts. 
But to get to mass adoption, chain technology and the ecosystem connecting it to the world needed 
to be reimagined from the ground up. Our founders built a proprietary chain architecture and created the 
tools to make blockchain work for everyone. – at speed, scale, and energy efficiency previously thought unachievable.

Our ecosystem powers real-world use cases for enterprises and entrepreneurs, providing the security of Bitcoin, 
virtually free gas (transaction fees), unparalleled throughput, as well as Pact - a secure smart contract 
language with built-in bug detection.

With such a revolutionary blockchain the community also needs the tools to create products on this chain. 
Therefore, we started with Kadena.js.
Kadena.js is a Monorepo (mono repository) where we will store all our JavaScript/ TypeScript solutions for 
our blockchain (libs, tooling, dapps, and so forth).


## Kadena.js and Packages
Kadena.js is the source for several packages, tooling and dapps that have any affiliation with Front-end development.

At this moment Kadena.js will be the home of these packages:
* @kadena/cryptography-utils contains encode/decode/hash utils
* @kadena/chainweb-node-client typed js wrapper with fetch to call chainweb-node API endpoints (amongst others https://api.chainweb.com/openapi/pact.html).
This will probably have some breakdown
  * api one-to-one mapping of rest endpoints to typed js client
  * utils functions like that use the api functions to get information
* @kadena/chainweb-data-client typed js wrapper with fetch to call chainweb-data API endpoints
* @kadena/pactjs-core low-level generator for pact expressions
* @kadena/pactjs-cli cli to generate pact contract type definitions and interface to pact client. deployment of contracts, etc
* @kadena/pactjs-client wrapper around chainweb-node-client with ability to switch environments etc.
* @kadena/wallet-client client for wallet to sign, connect, retreive account info, etc
* @kadena/marmalade-client specific client for marmalade/NFTs

As our eco system will grow so will the packages and dapps we will release under Kadena.js.

### Conventions
tbd.

### Issues
This section will help you create issues or filing bugs for Kadena.js. Following these steps will 
help maintainers and community members solving the issues finding duplicates etc. etc.

1. Before creating an issue  make sure you are running the latest version
2. Check if the issue doesn't already exist under [issues](https://github.com/kadena-community/kadena.js/issues)
3. Use a clear and descriptive title for the identification of the problems
4. Describe in a clear flow how to reproduce the problem. If possible create a gif or use screenshots. 
5. Include details about the configuration and environment


## Pull Request
When you want to pick up an issues or want to improve the code it is done via a pull request.

When filling out the pull request please take note of the following checklists:
* Link the PR to an issue (if this is applicable).
* Enable the checkbox to allow maintainer edits so the branch can be updated for a merge. Once you submit your PR, a team member will review your proposal. We may ask questions or request for additional information.
* As you update your PR and apply changes, mark each conversation as resolved.

When your PR is merged!

🚀🚀 Thank you 🚀🚀.

Now that you are part of the Kadena.js community, see how else you can contribute to the project.


