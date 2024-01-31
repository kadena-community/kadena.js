-- For querying the events of a transaction and events related to a module.
CREATE INDEX events_block_requestkey ON events (block, requestkey);
CREATE INDEX events_module ON events (module);
CREATE INDEX events_id ON events (id);

-- Signers are often found by public key or by request key.
CREATE INDEX signers_pubkey ON signers (pubkey);

-- Transfers are queried in different ways. These are the most used columns.
CREATE INDEX transfers_from_acct ON transfers (block, from_acct);
CREATE INDEX transfers_to_acct ON transfers (block, to_acct);
CREATE INDEX transfers_block_requestkey ON transfers (block, requestkey);
