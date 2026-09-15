<?php
/**
 * Minimal .env loader. Real OS environment variables (getenv()) always
 * win, so this works unchanged if a Hostinger plan exposes proper
 * per-site env vars in hPanel — the .env file is just the shared-hosting
 * fallback most Hostinger plans need.
 */

function load_env(): void {
    static $loaded = false;
    if ($loaded) return;
    $loaded = true;

    $path = __DIR__ . "/.env";
    if (!is_file($path)) return;

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === "" || str_starts_with($line, "#")) continue;
        $eq = strpos($line, "=");
        if ($eq === false) continue;
        $key = trim(substr($line, 0, $eq));
        $value = trim(substr($line, $eq + 1));
        $value = trim($value, "\"'");
        if ($key !== "" && getenv($key) === false) {
            putenv("{$key}={$value}");
        }
    }
}

function env(string $key, ?string $default = null): ?string {
    load_env();
    $value = getenv($key);
    return $value === false || $value === "" ? $default : $value;
}
