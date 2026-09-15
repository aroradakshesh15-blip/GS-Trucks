<?php
/**
 * Server-side reminder scheduler. Triggered by a Hostinger Cron Job
 * (CLI or HTTP — both supported below), NOT by anything in the browser.
 *
 * Idempotent: each reminder flag is flipped with a conditional UPDATE
 * (`WHERE reminder_x_sent = 0`) before the email is sent, so if two
 * cron runs ever overlap, only the run that wins the compare-and-set
 * sends the email. A cycle is only ever advanced by one year at a time,
 * so this table never grows — there is exactly one row per booking,
 * always tracking exactly one active reminder cycle.
 *
 * Run frequency: every 15–30 minutes is enough, since reminders are
 * sent whenever "now" has passed the threshold, not at an exact
 * instant — see README section in this repo's report for the exact
 * Hostinger Cron Job configuration.
 */

require_once __DIR__ . "/../inc/env.php";
require_once __DIR__ . "/../inc/db.php";
require_once __DIR__ . "/../inc/dates.php";
require_once __DIR__ . "/../inc/mail.php";
require_once __DIR__ . "/../inc/email_templates.php";

$isCli = PHP_SAPI === "cli";
$providedKey = $isCli ? ($argv[1] ?? "") : ($_GET["key"] ?? "");
$expectedKey = env("CRON_SECRET", "");

if ($expectedKey === "" || !hash_equals($expectedKey, (string) $providedKey)) {
    if (!$isCli) {
        http_response_code(403);
        header("Content-Type: application/json");
        echo json_encode(["error" => "Forbidden"]);
    } else {
        fwrite(STDERR, "Forbidden: missing or incorrect cron secret\n");
    }
    exit(1);
}

$timezone = env("BUSINESS_TIMEZONE", "America/Toronto");
$now = now_in($timezone);

$pdo = db();
$rows = $pdo->query(
    "SELECT * FROM inspection_bookings WHERE status = 'upcoming'",
)->fetchAll();

$summary = ["advanced" => 0, "3_day" => 0, "1_day" => 0, "8_hour" => 0, "checked" => count($rows)];

foreach ($rows as $booking) {
    $cycleDateTime = make_datetime($booking["current_cycle_date"], $booking["inspection_time"], $timezone);

    if ($now >= $cycleDateTime) {
        // The active cycle's appointment has passed — advance one leap-safe
        // year and reset reminder flags for the new cycle. Guarded on the
        // old current_cycle_date so a concurrent run can't double-advance.
        $newCycleDate = add_years_leap_safe($cycleDateTime, 1)->format("Y-m-d");
        $nextAnnual = add_years_leap_safe($cycleDateTime, 2)->format("Y-m-d");

        $stmt = $pdo->prepare(
            "UPDATE inspection_bookings
             SET current_cycle_date = :new_date,
                 cycle_number = cycle_number + 1,
                 next_annual_inspection_date = :next_annual,
                 reminder_3_day_sent = 0,
                 reminder_1_day_sent = 0,
                 reminder_8_hour_sent = 0
             WHERE id = :id AND current_cycle_date = :old_date",
        );
        $stmt->execute([
            ":new_date" => $newCycleDate,
            ":next_annual" => $nextAnnual,
            ":id" => $booking["id"],
            ":old_date" => $booking["current_cycle_date"],
        ]);
        if ($stmt->rowCount() === 1) $summary["advanced"]++;
        continue;
    }

    $thresholds = [
        "8_hour" => $cycleDateTime->modify("-8 hours"),
        "1_day" => $cycleDateTime->modify("-1 day"),
    ];
    if ((int) $booking["cycle_number"] >= 2) {
        $thresholds["3_day"] = $cycleDateTime->modify("-3 days");
    }

    foreach (["3_day", "1_day", "8_hour"] as $kind) {
        if (!isset($thresholds[$kind])) continue;
        $flagColumn = "reminder_{$kind}_sent";
        if ((bool) $booking[$flagColumn]) continue;
        if ($now < $thresholds[$kind]) continue;

        $stmt = $pdo->prepare(
            "UPDATE inspection_bookings SET {$flagColumn} = 1
             WHERE id = :id AND {$flagColumn} = 0",
        );
        $stmt->execute([":id" => $booking["id"]]);

        if ($stmt->rowCount() === 1) {
            [$subject, $body] = reminder_email($booking, $kind);
            send_mail($booking["email"], $subject, $body, env("TO_EMAIL"));
            $summary[$kind]++;
        }
    }
}

if ($isCli) {
    echo json_encode($summary, JSON_PRETTY_PRINT) . "\n";
} else {
    header("Content-Type: application/json");
    echo json_encode($summary);
}
