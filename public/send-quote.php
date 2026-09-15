<?php
/**
 * Handles the homepage "Get Quote on WhatsApp" widget. The customer's
 * quote request (selected services, location, preferred date/time,
 * optional contact details) is emailed to the shop so the team has a
 * record even though the customer is routed to WhatsApp for the actual
 * conversation. No pricing is calculated or sent here — this only
 * relays what the customer picked.
 */

require_once __DIR__ . "/inc/env.php";
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

$name = clean((string) ($data["name"] ?? ""));
$phone = clean((string) ($data["phone"] ?? ""));
$location = clean((string) ($data["location"] ?? ""));
$preferredDate = clean((string) ($data["preferredDate"] ?? ""));
$preferredTime = clean((string) ($data["preferredTime"] ?? ""));
$notes = trim((string) ($data["notes"] ?? ""));

$services = $data["services"] ?? [];
if (!is_array($services)) $services = [];
$services = array_values(array_filter(array_map(fn($s) => clean((string) $s), $services)));

if (count($services) === 0) {
    respond(false, "Select at least one service");
}

$quote = [
    "name" => $name,
    "phone" => $phone,
    "services" => $services,
    "location" => $location !== "" ? $location : "Not specified",
    "preferredDate" => $preferredDate,
    "preferredTime" => $preferredTime,
    "notes" => $notes,
];

[$subject, $body] = quote_request_email($quote);
$sent = send_mail(env("TO_EMAIL", "info@gstruckrepair.ca"), $subject, $body);

if ($sent) {
    respond(true, "Sent");
}
respond(false, "Could not send email");
