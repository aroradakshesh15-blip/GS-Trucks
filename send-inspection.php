<?php
/**
 * Handles the simplified Annual Inspection booking form. Validates the
 * submission server-side, stores it as an inspection_bookings row (the
 * source of truth the reminder cron reads from), and emails a
 * confirmation to the customer plus an internal notification to the
 * shop. Never trusts client-side validation.
 */

require_once __DIR__ . "/inc/env.php";
require_once __DIR__ . "/inc/db.php";
require_once __DIR__ . "/inc/dates.php";
require_once __DIR__ . "/inc/mail.php";
require_once __DIR__ . "/inc/email_templates.php";

header("Content-Type: application/json; charset=utf-8");

function respond(bool $success, string $message): void {
    http_response_code($success ? 200 : 400);
    echo json_encode(["success" => $success, "message" => $message]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    respond(false, "Method not allowed");
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

// Honeypot: real visitors never fill this hidden input.
if (!empty($data["website"] ?? "")) {
    respond(true, "OK");
}

function clean(string $value): string {
    return trim(str_replace(["\r", "\n"], " ", $value));
}

$fullName = clean((string) ($data["fullName"] ?? ""));
$phone = clean((string) ($data["phone"] ?? ""));
$email = clean((string) ($data["email"] ?? ""));
$vehicleType = clean((string) ($data["vehicleType"] ?? ""));
$preferredDate = clean((string) ($data["preferredDate"] ?? ""));
$preferredTime = clean((string) ($data["preferredTime"] ?? ""));
$notes = trim((string) ($data["notes"] ?? ""));

$services = $data["services"] ?? [];
if (!is_array($services)) $services = [];
$services = array_values(array_filter(array_map(fn($s) => clean((string) $s), $services)));

if ($fullName === "" || $phone === "" || $vehicleType === "") {
    respond(false, "Missing or invalid fields");
}
if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Invalid email address");
}
if (count($services) === 0) {
    respond(false, "Select at least one inspection service");
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $preferredDate) || !checkdate(
    (int) substr($preferredDate, 5, 2),
    (int) substr($preferredDate, 8, 2),
    (int) substr($preferredDate, 0, 4),
)) {
    respond(false, "Invalid inspection date");
}
if (!preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $preferredTime)) {
    respond(false, "Invalid inspection time");
}

$timezone = env("BUSINESS_TIMEZONE", "America/Toronto");

try {
    $inspectionDateTime = make_datetime($preferredDate, $preferredTime, $timezone);
} catch (Exception $e) {
    respond(false, "Invalid inspection date/time");
}

$nextAnnual = add_years_leap_safe($inspectionDateTime, 1);

try {
    $pdo = db();
    $stmt = $pdo->prepare(
        "INSERT INTO inspection_bookings
            (full_name, phone, email, vehicle_type, services_json, notes,
             inspection_date, inspection_time, timezone, status,
             current_cycle_date, cycle_number, next_annual_inspection_date)
         VALUES
            (:full_name, :phone, :email, :vehicle_type, :services_json, :notes,
             :inspection_date, :inspection_time, :timezone, 'upcoming',
             :current_cycle_date, 1, :next_annual_inspection_date)",
    );
    $stmt->execute([
        ":full_name" => $fullName,
        ":phone" => $phone,
        ":email" => $email,
        ":vehicle_type" => $vehicleType,
        ":services_json" => json_encode($services),
        ":notes" => $notes !== "" ? $notes : null,
        ":inspection_date" => $preferredDate,
        ":inspection_time" => $preferredTime,
        ":timezone" => $timezone,
        ":current_cycle_date" => $preferredDate,
        ":next_annual_inspection_date" => $nextAnnual->format("Y-m-d"),
    ]);
} catch (Throwable $e) {
    error_log("[send-inspection] DB error: " . $e->getMessage());
    respond(false, "Could not save booking");
}

$booking = [
    "full_name" => $fullName,
    "phone" => $phone,
    "email" => $email,
    "vehicle_type" => $vehicleType,
    "services_json" => json_encode($services),
    "notes" => $notes,
    "inspection_date" => $preferredDate,
    "inspection_time" => $preferredTime,
    "timezone" => $timezone,
];

[$subject, $body] = booking_confirmation_email($booking);
send_mail($email, $subject, $body, env("TO_EMAIL"));

[$subject, $body] = internal_notification_email($booking);
send_mail(env("TO_EMAIL", "info@gstruckrepair.ca"), $subject, $body, $email);

respond(true, "Booked");
