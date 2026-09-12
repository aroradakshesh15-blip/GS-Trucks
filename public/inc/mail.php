<?php
require_once __DIR__ . "/env.php";

/**
 * Sends an email via PHP's mail() (default; works out of the box on
 * Hostinger). Set MAIL_DRIVER=log in public/inc/.env to instead append
 * to public/inc/mail.log — used by the local test suite so no real
 * emails go out during testing.
 */
function send_mail(string $to, string $subject, string $body, ?string $replyTo = null): bool {
    $driver = env("MAIL_DRIVER", "php_mail");
    $from = env("FROM_EMAIL", "info@gstruckrepair.ca");

    if ($driver === "log") {
        $entry = "----- " . date("c") . " -----\n"
            . "To: {$to}\nSubject: {$subject}\n"
            . ($replyTo ? "Reply-To: {$replyTo}\n" : "")
            . "\n{$body}\n\n";
        file_put_contents(__DIR__ . "/mail.log", $entry, FILE_APPEND | LOCK_EX);
        return true;
    }

    $headers = [
        "From: GS Truck Website <{$from}>",
        "Content-Type: text/plain; charset=utf-8",
    ];
    if ($replyTo) $headers[] = "Reply-To: {$replyTo}";

    return mail($to, $subject, $body, implode("\r\n", $headers));
}
