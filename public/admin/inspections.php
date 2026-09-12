<?php
/**
 * Minimal password-protected admin utility for Annual Inspection
 * bookings. This project has no existing admin panel/auth system, so
 * this is a single-file, session-based one — enough to view bookings
 * and change status, which the reminder cron depends on (cancelling
 * stops future reminders; rescheduling recalculates the cycle).
 */

require_once __DIR__ . "/../inc/env.php";
require_once __DIR__ . "/../inc/db.php";
require_once __DIR__ . "/../inc/dates.php";

session_start();

$passwordHash = env("ADMIN_PASSWORD_HASH", "");

function csrf_token(): string {
    if (empty($_SESSION["csrf"])) {
        $_SESSION["csrf"] = bin2hex(random_bytes(32));
    }
    return $_SESSION["csrf"];
}

function csrf_valid(string $token): bool {
    return !empty($_SESSION["csrf"]) && hash_equals($_SESSION["csrf"], $token);
}

// --- Login / logout ---
if (($_POST["action"] ?? "") === "login") {
    if ($passwordHash !== "" && password_verify((string) ($_POST["password"] ?? ""), $passwordHash)) {
        $_SESSION["admin_authed"] = true;
    } else {
        $loginError = "Incorrect password";
    }
}
if (($_GET["logout"] ?? "") === "1") {
    session_destroy();
    header("Location: inspections.php");
    exit;
}

$authed = !empty($_SESSION["admin_authed"]);

// --- Status actions (only when authed) ---
if ($authed && $_SERVER["REQUEST_METHOD"] === "POST" && csrf_valid((string) ($_POST["csrf"] ?? ""))) {
    $pdo = db();
    $id = (int) ($_POST["id"] ?? 0);
    $action = $_POST["action"] ?? "";

    if ($action === "complete" && $id) {
        $pdo->prepare("UPDATE inspection_bookings SET status = 'completed' WHERE id = ?")->execute([$id]);
    } elseif ($action === "cancel" && $id) {
        $pdo->prepare("UPDATE inspection_bookings SET status = 'cancelled' WHERE id = ?")->execute([$id]);
    } elseif ($action === "reschedule" && $id) {
        $newDate = (string) ($_POST["new_date"] ?? "");
        $newTime = (string) ($_POST["new_time"] ?? "");
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $newDate) && preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $newTime)) {
            $row = $pdo->prepare("SELECT timezone FROM inspection_bookings WHERE id = ?");
            $row->execute([$id]);
            $tz = $row->fetchColumn() ?: env("BUSINESS_TIMEZONE", "America/Toronto");
            $newDateTime = make_datetime($newDate, $newTime, $tz);
            $nextAnnual = add_years_leap_safe($newDateTime, 1)->format("Y-m-d");

            $pdo->prepare(
                "UPDATE inspection_bookings
                 SET inspection_date = :d, inspection_time = :t,
                     current_cycle_date = :d, next_annual_inspection_date = :next,
                     reminder_3_day_sent = 0, reminder_1_day_sent = 0, reminder_8_hour_sent = 0,
                     status = 'upcoming'
                 WHERE id = :id",
            )->execute([":d" => $newDate, ":t" => $newTime, ":next" => $nextAnnual, ":id" => $id]);
        }
    }
    header("Location: inspections.php");
    exit;
}

$bookings = $authed
    ? db()->query("SELECT * FROM inspection_bookings ORDER BY current_cycle_date ASC")->fetchAll()
    : [];

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, "UTF-8");
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Annual Inspections — Admin</title>
<meta name="robots" content="noindex,nofollow">
<style>
  body { font-family: system-ui, sans-serif; background: #101214; color: #f4f2ed; margin: 0; padding: 2rem; }
  h1 { font-size: 1.4rem; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.85rem; }
  th, td { border: 1px solid #3b4246; padding: 0.5rem 0.6rem; text-align: left; vertical-align: top; }
  th { background: #191c1f; }
  tr:nth-child(even) { background: #191c1f; }
  form.login { max-width: 320px; margin: 4rem auto; display: grid; gap: 0.75rem; }
  input, button { font: inherit; padding: 0.6rem; background: #22272b; color: #f4f2ed; border: 1px solid #3b4246; }
  button { cursor: pointer; background: #ff1616; border: none; }
  .actions { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .actions form { display: inline-flex; gap: 0.3rem; align-items: center; }
  .status-upcoming { color: #47a8ff; }
  .status-completed { color: #4caf50; }
  .status-cancelled { color: #999; }
  .error { color: #ff5555; }
  a { color: #ff8080; }
</style>
</head>
<body>
<?php if (!$authed): ?>
  <form class="login" method="post">
    <h1>Admin login</h1>
    <?php if (!empty($loginError)): ?><p class="error"><?= h($loginError) ?></p><?php endif; ?>
    <input type="hidden" name="action" value="login">
    <input type="password" name="password" placeholder="Password" required autofocus>
    <button type="submit">Log in</button>
  </form>
<?php else: ?>
  <h1>Annual Inspections <a href="?logout=1" style="float:right;font-size:0.8rem;">Log out</a></h1>
  <table>
    <thead>
      <tr>
        <th>Customer</th><th>Email</th><th>Phone</th><th>Vehicle</th>
        <th>Services</th><th>Cycle date</th><th>Time</th><th>Cycle #</th>
        <th>Next annual</th><th>Status</th><th>Reminders sent</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($bookings as $b): ?>
      <tr>
        <td><?= h($b["full_name"]) ?></td>
        <td><?= h($b["email"]) ?></td>
        <td><?= h($b["phone"]) ?></td>
        <td><?= h($b["vehicle_type"]) ?></td>
        <td><?= h(implode(", ", json_decode($b["services_json"], true) ?: [])) ?></td>
        <td><?= h($b["current_cycle_date"]) ?></td>
        <td><?= h($b["inspection_time"]) ?></td>
        <td><?= (int) $b["cycle_number"] ?></td>
        <td><?= h($b["next_annual_inspection_date"]) ?></td>
        <td class="status-<?= h($b["status"]) ?>"><?= h(ucfirst($b["status"])) ?></td>
        <td>
          <?= $b["reminder_3_day_sent"] ? "3d " : "" ?>
          <?= $b["reminder_1_day_sent"] ? "1d " : "" ?>
          <?= $b["reminder_8_hour_sent"] ? "8h" : "" ?>
        </td>
        <td class="actions">
          <?php if ($b["status"] === "upcoming"): ?>
            <form method="post">
              <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
              <input type="hidden" name="id" value="<?= (int) $b["id"] ?>">
              <input type="hidden" name="action" value="complete">
              <button type="submit">Complete</button>
            </form>
            <form method="post">
              <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
              <input type="hidden" name="id" value="<?= (int) $b["id"] ?>">
              <input type="hidden" name="action" value="cancel">
              <button type="submit">Cancel</button>
            </form>
            <form method="post">
              <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
              <input type="hidden" name="id" value="<?= (int) $b["id"] ?>">
              <input type="hidden" name="action" value="reschedule">
              <input type="date" name="new_date" required>
              <input type="time" name="new_time" required>
              <button type="submit">Reschedule</button>
            </form>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
<?php endif; ?>
</body>
</html>
