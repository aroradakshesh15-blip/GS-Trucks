<?php
/**
 * Handles the "Annual Inspection" request form on the GS Truck & Trailer
 * Repair site. Runs on Hostinger's PHP runtime alongside the static build
 * in public_html. Kept separate from send-form.php (the general Request
 * Service form) so inspection requests are easy to tell apart by subject
 * line and content without needing a database or admin panel.
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

$fullName = clean((string) ($data["fullName"] ?? ""));
$phone = clean((string) ($data["phone"] ?? ""));
$email = clean((string) ($data["email"] ?? ""));
$company = clean((string) ($data["company"] ?? ""));
$vehicleType = clean((string) ($data["vehicleType"] ?? ""));
$year = clean((string) ($data["year"] ?? ""));
$make = clean((string) ($data["make"] ?? ""));
$model = clean((string) ($data["model"] ?? ""));
$vin = clean((string) ($data["vin"] ?? ""));
$unitNumber = clean((string) ($data["unitNumber"] ?? ""));
$mileage = clean((string) ($data["mileage"] ?? ""));
$preferredDate = clean((string) ($data["preferredDate"] ?? ""));
$preferredTime = clean((string) ($data["preferredTime"] ?? ""));
$location = clean((string) ($data["location"] ?? ""));
$message = trim((string) ($data["message"] ?? ""));

$services = $data["services"] ?? [];
if (!is_array($services)) {
    $services = [];
}
$services = array_values(array_filter(array_map(
    fn($s) => clean((string) $s),
    $services,
)));

if ($fullName === "" || $phone === "" || $company === "" || $vehicleType === "") {
    respond(false, "Missing or invalid fields");
}
if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Invalid email address");
}
if (count($services) === 0) {
    respond(false, "Select at least one inspection service");
}

$subject = "New Annual Inspection Request from {$fullName}";

$lines = [
    "Request type: Annual Inspection Request",
    "",
    "Contact",
    "-------",
    "Name: {$fullName}",
    "Phone: {$phone}",
    "Email: {$email}",
    "Company / Fleet: {$company}",
    "",
    "Vehicle",
    "-------",
    "Type: {$vehicleType}",
];
if ($year !== "") $lines[] = "Year: {$year}";
if ($make !== "") $lines[] = "Make: {$make}";
if ($model !== "") $lines[] = "Model: {$model}";
if ($vin !== "") $lines[] = "VIN: {$vin}";
if ($unitNumber !== "") $lines[] = "License plate / unit number: {$unitNumber}";
if ($mileage !== "") $lines[] = "Current mileage: {$mileage}";

$lines[] = "";
$lines[] = "Inspection preference";
$lines[] = "----------------------";
if ($preferredDate !== "") $lines[] = "Preferred date: {$preferredDate}";
if ($preferredTime !== "") $lines[] = "Preferred time: {$preferredTime}";
if ($location !== "") $lines[] = "Location: {$location}";

$lines[] = "";
$lines[] = "Selected services";
$lines[] = "------------------";
foreach ($services as $service) {
    $lines[] = "- {$service}";
}

if ($message !== "") {
    $lines[] = "";
    $lines[] = "Additional details";
    $lines[] = "-------------------";
    $lines[] = $message;
}

$body = implode("\n", $lines);

$headers = [
    "From: GS Truck Website <" . FROM_EMAIL . ">",
    "Reply-To: {$fullName} <{$email}>",
    "Content-Type: text/plain; charset=utf-8",
];

$sent = mail(TO_EMAIL, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, "Sent");
}
respond(false, "Could not send email");
