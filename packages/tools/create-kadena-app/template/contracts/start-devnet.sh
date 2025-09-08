#!/bin/bash

# Kill and remove any existing container named 'devnet' (suppress errors)
docker rm -f devnet 2>/dev/null || true

# Start a new Kadena devnet container
docker run --rm -it \
  -p 8080:8080 \
  --volume kadena_devnet:/data \
  --name devnet \
  kadena/devnet
