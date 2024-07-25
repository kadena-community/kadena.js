-- For querying transactions send by a sender
CREATE INDEX transactions_sender_height_desc_idx ON transactions (sender, height DESC);
CREATE INDEX transfers_to_modulename_height_idx ON transfers (to_acct, modulename, height DESC);
CREATE INDEX transfers_from_modulename_height_idx ON transfers (from_acct, modulename, height DESC);
