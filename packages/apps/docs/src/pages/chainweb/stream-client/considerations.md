---
title: Considerations ⚠️
description: Kadena makes blockchain work for everyone.
menu: Considerations ⚠️
label: Considerations ⚠️
order: 4
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainweb-stream-client/README.md
layout: full
tags: [chainweb, stream, reference]
lastModifiedDate: Wed, 02 Aug 2023 07:22:41 GMT
---

# Considerations ⚠️

### Ensure configuration compatibility

Make sure that your client and server `confirmationDepth` values are compatible.

If your client `confirmationDepth` is larger than the server's, the `confirmed`
event will never fire. The client will automatically detect this condition, emit
an `error` event and disconnect.

If your client's configured network does not match the server's, the client will
emit an `error` event and disconnect.

If your client `heartbeatTimeout` is smaller than the server heartbeat interval,
the client will automatically adapt its heartbeat timeout to 2500ms larger than
the server value.

### Handle temporary and permanent connection failures

When the connection is interrupted or determined to be stale (no heartbeats
received within the heartbeatTimeout interval), a reconnection attempt will be
made (up to `maxReconnects` times.)

It is recommended to handle the fired [will-reconnect ]() and
[error ](/chainweb/stream-client/events#error) events.
