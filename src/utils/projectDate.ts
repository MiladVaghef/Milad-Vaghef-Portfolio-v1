/**
 * Relative-age label for the project dates stored in `src/data/projects.ts`
 * (ISO year-month strings like "2025-04").
 *
 * Comparison runs at MONTH granularity on purpose: the label only flips when
 * the project's month comes around (never mid-month), and parsing via
 * split() avoids the UTC pitfalls of `new Date("YYYY-MM")`.
 */
const MONTHS_PER_YEAR = 12;

export const formatProjectAge = (date: string): string => {
  const [year, month] = date.split("-").map(Number);

  // Malformed date — render nothing meaningful rather than NaN.
  if (!year || !month) return "";

  const now = new Date();
  const monthsPassed =
    (now.getFullYear() - year) * MONTHS_PER_YEAR + (now.getMonth() + 1 - month);

  // Brand-new projects (or dates still in the future) read as "just now".
  if (monthsPassed < 1) return "just now";

  if (monthsPassed < MONTHS_PER_YEAR) {
    return `${monthsPassed} month${monthsPassed === 1 ? "" : "s"} ago`;
  }

  const yearsPassed = Math.floor(monthsPassed / MONTHS_PER_YEAR);

  return `${yearsPassed} year${yearsPassed === 1 ? "" : "s"} ago`;
};
