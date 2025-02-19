# Issue events

## Analysis

When opening subscriptions for qualifiedEventNames or requestKeys, we're looking
every second for a new record. When we find one, we return it to the consumer.

We poll every second, which could lead to the depletion of connections to the
database

Maybe some queries take more than a second, which leads to a buildup of queries
that are not being processed.

## Mitigations & Solutions

1. We can increase the polling interval to 5 seconds, which would reduce the
   number of queries to the database.
2. If a query takes more than 5 seconds, the next polling will be ignored. The
   maximum timeout of a query is already set at 15 seconds. So we miss a max of
   2 polls
3. For every event we do a separate query. It would be better to create a single
   polling mechanism that'll check for all events that have open subscription

## Actual issue

The query that polls for events is using a `lastEventId` to get the next event.
The problem was that `lastEventId` was never set, which resulted in the query
being executed for the whole database every time.


## Fix

The fix was to set the `lastEventId` to the last event available in the database
