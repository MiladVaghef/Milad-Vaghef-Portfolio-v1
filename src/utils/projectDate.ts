/**
 * Relative-age labels for the project dates stored in `src/data/projects.ts`.
 *
 * Accepted formats (`-` and `/` separators both work):
 *   "2025-04"    — year + month only; the day was never submitted
 *   "2025-04-12" — year + month + day
 *
 * Day-qualified dates get day-level precision: "just now" ONLY while the
 * submitted day is today (less than a day old), then "N days ago" until a
 * full calendar month has gone by. Month-only dates never claim day
 * precision ("just now" would be a guess — no day was ever submitted); they
 * read "this month" while the project's month is current, then fall back to
 * the month/year labels.
 *
 * Month comparisons run at MONTH granularity on purpose: those labels only
 * flip when the project's month comes around (never mid-month), and parsing
 * via split() avoids the UTC pitfalls of `new Date("2025-04")`.
 */
const MONTHS_PER_YEAR = 12;
// Day labels only appear below a full calendar month — a same-calendar-month
// gap can never exceed 30 days, so past this the month labels take over.
const DAY_LABEL_LIMIT = 31;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Numeric parts of a project date, or null when the year/month are unusable.
 * The day is null unless a real calendar day (1–31) was submitted, which is
 * what lets callers tell "2025-04" from "2025-04-12".
 */
const parseProjectDate = (
  date: string,
): { year: number; month: number; day: number | null } | null => {
  const [year, month, day] = date.split(/[-/]/).map(Number);

  // Malformed date — callers render nothing meaningful rather than NaN.
  if (!year || !month) return null;

  // A junk day ("2025-04-", "2025-04-abc") just downgrades to month-only.
  const hasDay = Number.isInteger(day) && day >= 1 && day <= 31;

  return { year, month, day: hasDay ? day : null };
};

/**
 * Sortable numeric value for a project date: milliseconds since the epoch of
 * that day (bigger = more recent). Day-qualified dates therefore sort by
 * their exact day; month-only ones sort as their month's 1st. Malformed
 * dates return 0 so they sink to the oldest end instead of poisoning the
 * comparator with NaN.
 */
export const projectDateValue = (date: string): number => {
  const parsed = parseProjectDate(date);

  if (!parsed) return 0;

  return Date.UTC(parsed.year, parsed.month - 1, parsed.day ?? 1);
};

export const formatProjectAge = (date: string): string => {
  const parsed = parseProjectDate(date);

  if (!parsed) return "";

  const { year, month, day } = parsed;
  const now = new Date();

  // Calendar-month distance; the month/year labels flip on the project's
  // month boundary (never mid-month) — same behaviour they always had.
  const monthsPassed =
    (now.getFullYear() - year) * MONTHS_PER_YEAR + (now.getMonth() + 1 - month);

  if (day === null) {
    // Day never submitted — "this month" is the only sub-month label that
    // stays truthful ("just now" would pretend to know a day that wasn't
    // given).
    if (monthsPassed < 1) return "this month";
  } else {
    // Whole calendar days between the submitted day and today (both at
    // midnight — the submission's time of day is unknown, so "less than a
    // day old" means "added today").
    const daysPassed = Math.round(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
        new Date(year, month - 1, day).getTime()) /
        MS_PER_DAY,
    );

    // The ONLY case that reads "just now": added today. (Future-dated
    // projects land here too, matching the old behaviour.)
    if (daysPassed < 1) return "just now";

    // Still inside the first month → day precision.
    if (daysPassed < DAY_LABEL_LIMIT) {
      return `${daysPassed} day${daysPassed === 1 ? "" : "s"} ago`;
    }
  }

  if (monthsPassed < MONTHS_PER_YEAR) {
    return `${monthsPassed} month${monthsPassed === 1 ? "" : "s"} ago`;
  }

  const yearsPassed = Math.floor(monthsPassed / MONTHS_PER_YEAR);

  return `${yearsPassed} year${yearsPassed === 1 ? "" : "s"} ago`;
};
