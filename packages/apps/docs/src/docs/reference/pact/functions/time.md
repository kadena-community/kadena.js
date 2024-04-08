---
title: Time
description:
  Describes functions for handling date and time operations and formatting time output.
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

Format TIME using FORMAT. See [Time formats](#time-formats) for supported formats.

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

Construct time from UTCVAL using FORMAT. See [Time formats](#time-formats) for supported formats.

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

## Time formats

The [parse-time](/reference/functions/time#parse-timeh-1026813529) and
[format-time](/reference/functions/time#format-timeh1412423395) functions
accept format codes that derive from GNU `strftime` with some extensions, as
follows:

`%%` - literal `"%"`

`%z` - RFC 822/ISO 8601:1988 style numeric time zone (e.g., `"-0600"` or
`"+0100"`)

`%N` - ISO 8601 style numeric time zone (e.g., `"-06:00"` or `"+01:00"`)
/EXTENSION/

`%Z` - timezone name

`%c` - The preferred calendar time representation for the current locale. As
'dateTimeFmt' `locale` (e.g. `%a %b %e %H:%M:%S %Z %Y`)

`%R` - same as `%H:%M`

`%T` - same as `%H:%M:%S`

`%X` - The preferred time of day representation for the current locale. As
'timeFmt' `locale` (e.g. `%H:%M:%S`)

`%r` - The complete calendar time using the AM/PM format of the current locale.
As 'time12Fmt' `locale` (e.g. `%I:%M:%S %p`)

`%P` - day-half of day from ('amPm' `locale`), converted to lowercase, `"am"`,
`"pm"`

`%p` - day-half of day from ('amPm' `locale`), `"AM"`, `"PM"`

`%H` - hour of day (24-hour), 0-padded to two chars, `"00"`–`"23"`

`%k` - hour of day (24-hour), space-padded to two chars, `" 0"`–`"23"`

`%I` - hour of day-half (12-hour), 0-padded to two chars, `"01"`–`"12"`

`%l` - hour of day-half (12-hour), space-padded to two chars, `" 1"`–`"12"`

`%M` - minute of hour, 0-padded to two chars, `"00"`–`"59"`

`%S` - second of minute (without decimal part), 0-padded to two chars,
`"00"`–`"60"`

`%v` - microsecond of second, 0-padded to six chars, `"000000"`–`"999999"`.
/EXTENSION/

`%Q` - decimal point and fraction of second, up to 6 second decimals, without
trailing zeros. For a whole number of seconds, `%Q` produces the empty string.
/EXTENSION/

`%s` - number of whole seconds since the Unix epoch. For times before the Unix
epoch, this is a negative number. Note that in `%s.%q` and `%s%Q` the decimals
are positive, not negative. For example, 0.9 seconds before the Unix epoch is
formatted as `"-1.1"` with `%s%Q`.

`%D` - same as `%m\/%d\/%y`

`%F` - same as `%Y-%m-%d`

`%x` - as 'dateFmt' `locale` (e.g. `%m\/%d\/%y`)

`%Y` - year, no padding.

`%y` - year of century, 0-padded to two chars, `"00"`–`"99"`

`%C` - century, no padding.

`%B` - month name, long form ('fst' from 'months' `locale`),
`"January"`–`"December"`

`%b`, `%h` - month name, short form ('snd' from 'months' `locale`),
`"Jan"`–`"Dec"`

`%m` - month of year, 0-padded to two chars, `"01"`–`"12"`

`%d` - day of month, 0-padded to two chars, `"01"`–`"31"`

`%e` - day of month, space-padded to two chars, `" 1"`–`"31"`

`%j` - day of year, 0-padded to three chars, `"001"`–`"366"`

`%G` - year for Week Date format, no padding.

`%g` - year of century for Week Date format, 0-padded to two chars,
`"00"`–`"99"`

`%f` - century for Week Date format, no padding. /EXTENSION/

`%V` - week of year for Week Date format, 0-padded to two chars, `"01"`–`"53"`

`%u` - day of week for Week Date format, `"1"`–`"7"`

`%a` - day of week, short form ('snd' from 'wDays' `locale`), `"Sun"`–`"Sat"`

`%A` - day of week, long form ('fst' from 'wDays' `locale`),
`"Sunday"`–`"Saturday"`

`%U` - week of year where weeks start on Sunday (as 'sundayStartWeek'), 0-padded
to two chars, `"00"`–`"53"`

`%w` - day of week number, `"0"` (= Sunday) – `"6"` (= Saturday)

`%W` - week of year where weeks start on Monday (as
'Data.Thyme.Calendar.WeekdayOfMonth.mondayStartWeek'), 0-padded to two chars,
`"00"`–`"53"`

Note: `%q` (picoseconds, zero-padded) does not work properly so not documented
here.

### Default format and JSON serialization

The default format is a UTC ISO8601 date+time format: "%Y-%m-%dT%H:%M:%SZ", as
accepted by the [time](/reference/functions/time#timeh3560141) function.
While the time object internally supports up to microsecond resolution, values
returned from the Pact interpreter as JSON will be serialized with the default
format. When higher resolution is desired, explicitly format times with `%v` and
related codes.

### Examples

To format time using ISO8601:

```bash
pact> (format-time "%Y-%m-%dT%H:%M:%S%N" (time "2016-07-23T13:30:45Z"))
"2016-07-23T13:30:45+00:00"
```

To format time using RFC822:

```bash
pact> (format-time "%a, %_d %b %Y %H:%M:%S %Z" (time "2016-07-23T13:30:45Z"))
"Sat, 23 Jul 2016 13:30:45 UTC"
```

To format time using YYYY-MM-DD hh:mm:ss.000000

```bash
pact> (format-time "%Y-%m-%d %H:%M:%S.%v" (add-time (time "2016-07-23T13:30:45Z") 0.001002))
"2016-07-23 13:30:45.001002"
```
