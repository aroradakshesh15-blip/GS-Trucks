<?php
/**
 * Plain-text email bodies for booking confirmations and reminders.
 * Keep these in sync with src/lib/site.ts's BUSINESS constant.
 */

const BUSINESS_NAME = "GS Truck & Trailer Repair";
const BUSINESS_PHONE = "+1 (416) 918-2630";
const BUSINESS_ADDRESS = "18 Knightsbridge Rd, Brampton, ON L6T 3X5";

function format_services_list(array $services): string {
    return implode("\n", array_map(fn($s) => "- {$s}", $services));
}

function format_date_human(string $date, string $timezone): string {
    $dt = new DateTimeImmutable($date, new DateTimeZone($timezone));
    return $dt->format("l, F j, Y");
}

function format_time_human(string $time): string {
    $dt = DateTimeImmutable::createFromFormat("H:i", $time);
    return $dt ? $dt->format("g:i A") : $time;
}

function contact_footer(): string {
    return "GS Truck & Trailer Repair\n"
        . BUSINESS_PHONE . "\n"
        . BUSINESS_ADDRESS;
}

function booking_confirmation_email(array $booking): array {
    $dateHuman = format_date_human($booking["inspection_date"], $booking["timezone"]);
    $timeHuman = format_time_human($booking["inspection_time"]);
    $services = format_services_list(json_decode($booking["services_json"], true) ?: []);

    $subject = "Annual Inspection Booking Confirmed — GS Trucks";
    $body = "Hi {$booking["full_name"]},\n\n"
        . "Your annual inspection request has been received and confirmed.\n\n"
        . "Inspection date: {$dateHuman}\n"
        . "Inspection time: {$timeHuman}\n\n"
        . "Selected services:\n{$services}\n\n"
        . "We'll send you reminder emails as the date approaches "
        . "(1 day and 8 hours before), and again every year ahead of your "
        . "next annual inspection.\n\n"
        . "Questions or need to change your appointment? Just reply to this "
        . "email or call us.\n\n"
        . contact_footer();

    return [$subject, $body];
}

function internal_notification_email(array $booking): array {
    $dateHuman = format_date_human($booking["inspection_date"], $booking["timezone"]);
    $timeHuman = format_time_human($booking["inspection_time"]);
    $services = format_services_list(json_decode($booking["services_json"], true) ?: []);

    $subject = "New Annual Inspection Booking — {$booking["full_name"]}";
    $body = "Request type: Annual Inspection Booking\n\n"
        . "Name: {$booking["full_name"]}\n"
        . "Phone: {$booking["phone"]}\n"
        . "Email: {$booking["email"]}\n"
        . "Vehicle type: {$booking["vehicle_type"]}\n\n"
        . "Inspection date: {$dateHuman}\n"
        . "Inspection time: {$timeHuman}\n\n"
        . "Selected services:\n{$services}\n";

    if (!empty($booking["notes"])) {
        $body .= "\nAdditional notes:\n{$booking["notes"]}\n";
    }

    return [$subject, $body];
}

function quote_request_email(array $quote): array {
    $services = format_services_list($quote["services"]);
    $who = $quote["name"] !== "" ? $quote["name"] : "A website visitor";

    $subject = "New Quote Request" . ($quote["name"] !== "" ? " — {$quote["name"]}" : "");
    $body = "Request type: Instant Quote (WhatsApp)\n\n"
        . "Name: " . ($quote["name"] !== "" ? $quote["name"] : "Not provided") . "\n"
        . "Phone: " . ($quote["phone"] !== "" ? $quote["phone"] : "Not provided") . "\n\n"
        . "Requested services:\n{$services}\n\n"
        . "Location: {$quote["location"]}\n"
        . "Preferred date: " . ($quote["preferredDate"] !== "" ? $quote["preferredDate"] : "Not selected") . "\n"
        . "Preferred time: " . ($quote["preferredTime"] !== "" ? $quote["preferredTime"] : "Not selected") . "\n";

    if ($quote["notes"] !== "") {
        $body .= "\nNotes:\n{$quote["notes"]}\n";
    }

    $body .= "\n{$who} also opened WhatsApp to reach the shop directly — no price was shown to them.\n";

    return [$subject, $body];
}

/** @param "3_day"|"1_day"|"8_hour" $kind */
function reminder_email(array $booking, string $kind): array {
    $dateHuman = format_date_human($booking["current_cycle_date"], $booking["timezone"]);
    $timeHuman = format_time_human($booking["inspection_time"]);
    $services = format_services_list(json_decode($booking["services_json"], true) ?: []);

    $subjects = [
        "3_day" => "Annual Inspection Reminder — 3 Days to Go",
        "1_day" => "Annual Inspection Reminder — Tomorrow",
        "8_hour" => "Annual Inspection Reminder — Today",
    ];
    $subject = $subjects[$kind];

    if ($kind === "1_day") {
        $body = "Hi {$booking["full_name"]},\n\n"
            . "Just a reminder — your annual inspection is tomorrow, {$dateHuman} at {$timeHuman}.\n\n"
            . "See you then.\n\n"
            . contact_footer();
        return [$subject, $body];
    }

    $intro = $kind === "3_day"
        ? "Your annual inspection is coming up in 3 days."
        : "Your annual inspection is today.";

    $body = "Hi {$booking["full_name"]},\n\n"
        . "{$intro}\n\n"
        . "Inspection date: {$dateHuman}\n"
        . "Inspection time: {$timeHuman}\n\n"
        . "Selected services:\n{$services}\n\n"
        . "Questions or need to reschedule? Just reply to this email or call us.\n\n"
        . contact_footer();

    return [$subject, $body];
}
