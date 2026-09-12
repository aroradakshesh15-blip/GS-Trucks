-- GS Trucks — Annual Inspection bookings
--
-- Single normalized table with a rolling "cycle" instead of ever-growing
-- current_year_*/next_year_* columns: current_cycle_date is whichever
-- inspection date reminders are currently tracked against (the date just
-- booked, or the most recent annual recurrence), and cycle_number tells
-- the reminder cron whether this cycle gets 2 reminders (first booking,
-- cycle 1: 1-day + 8-hour) or 3 (every later annual cycle: 3-day + 1-day
-- + 8-hour). When a cycle's appointment time passes, the cron advances
-- current_cycle_date by one leap-safe year, bumps cycle_number, and
-- resets the three "sent" flags — so there is always exactly one row
-- per booking, never a growing table of future reminder jobs.
--
-- Run this once in Hostinger's phpMyAdmin (or `mysql < schema.sql`)
-- against the database you create for this site.

CREATE TABLE IF NOT EXISTS inspection_bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(190) NOT NULL,
  vehicle_type VARCHAR(40) NOT NULL,
  services_json TEXT NOT NULL,           -- JSON array of selected service labels
  notes TEXT NULL,

  inspection_date DATE NOT NULL,         -- date originally booked by the customer
  inspection_time VARCHAR(8) NOT NULL,   -- "HH:MM" 24-hour, local to `timezone`
  timezone VARCHAR(60) NOT NULL DEFAULT 'America/Toronto',

  status ENUM('upcoming', 'completed', 'cancelled', 'rescheduled') NOT NULL DEFAULT 'upcoming',

  -- Rolling annual reminder cycle
  current_cycle_date DATE NOT NULL,      -- date the active reminder cycle targets
  cycle_number INT UNSIGNED NOT NULL DEFAULT 1,
  next_annual_inspection_date DATE NOT NULL, -- current_cycle_date + 1 year (leap-safe), informational

  reminder_3_day_sent TINYINT(1) NOT NULL DEFAULT 0,
  reminder_1_day_sent TINYINT(1) NOT NULL DEFAULT 0,
  reminder_8_hour_sent TINYINT(1) NOT NULL DEFAULT 0,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status_cycle (status, current_cycle_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
