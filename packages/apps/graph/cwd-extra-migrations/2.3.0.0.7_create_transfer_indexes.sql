CREATE INDEX transfers_from_acct_height ON transfers (from_acct, height DESC);
CREATE INDEX transfers_to_acct_height ON transfers (to_acct, height DESC);
