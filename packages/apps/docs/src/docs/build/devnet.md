---
title: Get Started with DevNet - Your Development Hub in Kadena
description: How to use devnet
menu: Devnet
label: Devnet
order: 2
layout: full
tags: [devnet, docker, layer2, development]
---

# Devnet

DevNet is Kadena's dedicated blockchain environment for developers. 
Designed to empower innovation, DevNet serves as a sandbox where you can 
unleash your creativity and harness the power of blockchain technology.


## Key Features of DevNet

1. **A Testing Ground for Innovation:** DevNet provides an unmatched platform for you to test and refine your blockchain applications and smart contracts. 
This space allows you to explore the limits of your ideas freely, without the restrictions of a live network.

2. **Advanced Tools and Comprehensive Resources:** Devnet is equipped with state-of-the-art tools and extensive resources.

3. **Secure Testing Environment:** Understanding the importance of security in blockchain development, DevNet offers a protected platform for you to experiment and validate your applications. This ensures that your projects are robust and secure before they go live on the mainnet.

## Current versions out there
latest
```shell
 docker run -it --rm -p 127.0.0.1:8080:8080 --name devnet kadena/devnet:latest
```


experimental-graph-integration
```shell
 docker run -it --rm -p 127.0.0.1:8080:8080 --name devnet kadena/devnet:experimental-graph-integration
```


l2-webauthn
```shell
 docker run -it --rm -p 127.0.0.1:8080:8080 --name devnet kadena/devnet:l2-webauthn
```
