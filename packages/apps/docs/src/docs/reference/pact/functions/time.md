---
title: Time
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Time
label: Time
order: 3
layout: full
tags: ['pact', 'language reference', 'time']
---

# Time

## add-time

_time_&nbsp;`time` _seconds_&nbsp;`decimal` _&rarr;_&nbsp;`time`

_time_&nbsp;`time` _seconds_&nbsp;`integer` _&rarr;_&nbsp;`time`

Add SECONDS to TIME; SECONDS can be integer or decimal.

```pact
pact> (add-time (time "2016-07-22T12:00:00Z") 15)
"2016-07-22T12:00:15Z"
```

## days

_n_&nbsp;`decimal` _&rarr;_&nbsp;`decimal`

_n_&nbsp;`integer` _&rarr;_&nbsp;`decimal`

N days, for use with 'add-time'

```pact
pact> (add-time (time "2016-07-22T12:00:00Z") (days 1))
"2016-07-23T12:00:00Z"
```

## diff-time

_time1_&nbsp;`time` _time2_&nbsp;`time` _&rarr;_&nbsp;`decimal`

Compute difference between TIME1 and TIME2 in seconds.

```pact
pact> (diff-time (parse-time "%T" "16:00:00") (parse-time "%T" "09:30:00"))
23400.0
```

## format-time

_format_&nbsp;`string` _time_&nbsp;`time` _&rarr;_&nbsp;`string`

Format TIME using FORMAT. See
["Time Formats" docs](/pact/reference/time-formats) for supported formats.

```pact
pact> (format-time "%F" (time "2016-07-22T12:00:00Z"))
"2016-07-22"
```

## hours

_n_&nbsp;`decimal` _&rarr;_&nbsp;`decimal`

_n_&nbsp;`integer` _&rarr;_&nbsp;`decimal`

N hours, for use with 'add-time'

```pact
pact> (add-time (time "2016-07-22T12:00:00Z") (hours 1))
"2016-07-22T13:00:00Z"
```

## minutes

_n_&nbsp;`decimal` _&rarr;_&nbsp;`decimal`

_n_&nbsp;`integer` _&rarr;_&nbsp;`decimal`

N minutes, for use with 'add-time'.

```pact
pact> (add-time (time "2016-07-22T12:00:00Z") (minutes 1))
"2016-07-22T12:01:00Z"
```

## parse-time

_format_&nbsp;`string` _utcval_&nbsp;`string` _&rarr;_&nbsp;`time`

Construct time from UTCVAL using FORMAT. See
["Time Formats" docs](/pact/reference/time-formats) for supported formats.

```pact
pact> (parse-time "%F" "2016-09-12")
"2016-09-12T00:00:00Z"
```

## time

_utcval_&nbsp;`string` _&rarr;_&nbsp;`time`

Construct time from UTCVAL using ISO8601 format (%Y-%m-%dT%H:%M:%SZ).

```pact
pact> (time "2016-07-22T11:26:35Z")
"2016-07-22T11:26:35Z"
```
