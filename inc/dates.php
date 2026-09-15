<?php

/**
 * Adds N years to a date, handling Feb 29 correctly. PHP's native
 * `DateTime::modify('+1 year')` overflows Feb 29 into Mar 1/2 on a
 * non-leap target year — this clamps to Feb 28 instead, per the
 * project's leap-year convention.
 */
function add_years_leap_safe(DateTimeImmutable $date, int $years): DateTimeImmutable {
    $year = (int) $date->format("Y") + $years;
    $month = (int) $date->format("m");
    $day = (int) $date->format("d");

    if ($month === 2 && $day === 29 && !checkdate(2, 29, $year)) {
        $day = 28;
    }

    return $date->setDate($year, $month, $day);
}

/**
 * Builds a timezone-aware DateTimeImmutable from a "YYYY-MM-DD" date and
 * "HH:MM" 24-hour time, interpreted in the given IANA timezone.
 */
function make_datetime(string $date, string $time, string $timezone): DateTimeImmutable {
    return new DateTimeImmutable("{$date} {$time}:00", new DateTimeZone($timezone));
}

/** current time, honouring TEST_NOW for the local test suite only */
function now_in(string $timezone): DateTimeImmutable {
    $testNow = env("TEST_NOW");
    if ($testNow) {
        return new DateTimeImmutable($testNow, new DateTimeZone($timezone));
    }
    return new DateTimeImmutable("now", new DateTimeZone($timezone));
}
