<?php
/**
 * Handles the "Request service" form on the GS Truck & Trailer Repair site.
 * Runs on Hostinger's PHP runtime alongside the static build in public_html.
 */

header("Content-Type: application/json; charset=utf-8");

const TO_EMAIL = "info@gstruckrepair.ca";
const FROM_EMAIL = "info@gstruckrepair.ca"; // must be a mailbox on your own domain for deliverability

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

// Honeypot field: real visitors never fill this hidden input.
if (!empty($data["website"] ?? "")) {
    respond(true, "OK");
}

function clean(string $value): string {
    // Strip newlines/carriage returns so a field can't be used for header injection.
    return trim(str_replace(["\r", "\n"], " ", $value));
}

$firstName = clean((string) ($data["firstName"] ?? ""));
$lastName = clean((string) ($data["lastName"] ?? ""));
$email = clean((string) ($data["email"] ?? ""));
$phone = clean((string) ($data["phone"] ?? ""));
$service = clean((string) ($data["service"] ?? ""));
$message = trim((string) ($data["message"] ?? ""));

if ($firstName === "" || $lastName === "" || $phone === "" || $service === "" || strlen($message) < 10) {
    respond(false, "Missing or invalid fields");
}
if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Invalid email address");
}

$subject = "Service request from {$firstName} {$lastName}";
$body = "Name: {$firstName} {$lastName}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Service: {$service}\n\n"
    . $message;

$headers = [
    "From: GS Truck Website <" . FROM_EMAIL . ">",
    "Reply-To: {$firstName} {$lastName} <{$email}>",
    "Content-Type: text/plain; charset=utf-8",
];

$sent = mail(TO_EMAIL, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, "Sent");
}
respond(false, "Could not send email");
