#!/bin/bash

set -e

echo "🛑 Stopping and removing devnet container..."
docker rm -f devnet 2>/dev/null || echo "No running container named 'devnet'."

echo "🧹 Removing volume 'kadena_devnet'..."
docker volume rm kadena_devnet 2>/dev/null || echo "No volume named 'kadena_devnet'."

echo "✅ Devnet reset complete. You can now start from a clean state."
