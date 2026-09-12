<?php
require_once __DIR__ . "/env.php";

/**
 * PDO connection factory. Uses MySQL by default (Hostinger's included
 * database). DB_DSN can override the whole DSN — used by the local test
 * suite to point at a throwaway SQLite file instead of a real database.
 */
function db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = env("DB_DSN");
    $user = env("DB_USER", "");
    $pass = env("DB_PASS", "");

    if ($dsn === null) {
        $host = env("DB_HOST", "localhost");
        $name = env("DB_NAME", "");
        $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";
    }

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    if (str_starts_with($dsn, "sqlite:")) {
        $pdo->exec("PRAGMA foreign_keys = ON");
    }

    return $pdo;
}
