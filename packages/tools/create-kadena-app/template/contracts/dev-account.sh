#!/bin/bash
ALIAS=${KADENA_ALIAS:-testing-account}
KEYFILE="$ALIAS.yaml"

if [ ! -f "$KEYFILE" ]; then
  npx kadena key generate --key-alias "$ALIAS" --key-amount 1
fi

PUBKEY=$(grep -m 1 -oE 'publicKey: [0-9a-f]+' "$KEYFILE" | awk '{print $2}')

npx kadena account add --from key --account-alias "$ALIAS" --fungible coin --public-keys "$PUBKEY" --predicate keys-all --quiet || true
npx kadena account fund --account "$ALIAS" --network devnet --chain-ids 0 --amount 20 --deploy-faucet --quiet

echo "Account $ALIAS funded on devnet chain 0 (pubkey: $PUBKEY)."
