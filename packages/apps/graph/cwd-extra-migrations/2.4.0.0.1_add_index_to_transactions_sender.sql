-- For querying transactions send by a sender
CREATE INDEX transactions_sender_height_desc ON transactions (sender, height DESC);
