/**
 * src/utils/format.ts
 *
 * MotorSphere display formatting utilities.
 *
 * ZAR price format: R 150 000
 * - Space as thousand separator (South African standard)
 * - No comma separator
 * - Prices stored as ZAR cents (integer) — divide by 100 for display
 */

/**
 * Format a ZAR price for display.
 *
 * @param cents - Price in ZAR cents (e.g., 15000000 for R 150 000)
 * @param options.showCents - Show cents if non-zero (default: false)
 * @returns Formatted string: "R 150 000" or "R 1 500 000"
 *
 * @example
 * formatZAR(15000000)   // "R 150 000"
 * formatZAR(15000050)   // "R 150 000" (cents hidden by default)
 * formatZAR(15000050, { showCents: true })  // "R 150 000.50"
 */
export function formatZAR(
  cents: number,
  options: { showCents?: boolean } = {},
): string {
  const { showCents = false } = options;
  const rand = cents / 100;

  const formatted = new Intl.NumberFormat('en-ZA', {
    style:                 'currency',
    currency:              'ZAR',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(rand);

  // Intl formats ZAR as "R 150 000" on en-ZA locale (with narrow no-break space)
  // Normalise the space to a regular space for consistent rendering
  return formatted.replace(/ /g, ' ').replace(/ /g, ' ');
}

/**
 * Parse a formatted ZAR string back to cents.
 * Strips "R", spaces, and commas, then converts to cents.
 *
 * @example
 * parseZARtoCents("R 150 000")  // 15000000
 */
export function parseZARtoCents(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  return Math.round(parseFloat(cleaned) * 100);
}

/**
 * Format a mileage number with km suffix.
 *
 * @example
 * formatMileage(125000)  // "125 000 km"
 */
export function formatMileage(km: number): string {
  return new Intl.NumberFormat('en-ZA').format(km) + ' km';
}

/**
 * Format a Firestore Timestamp or ISO string as a short date.
 *
 * @example
 * formatDate("2026-05-27T10:00:00.000Z")  // "27 May 2026"
 */
export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('en-ZA', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });
}

/**
 * Format a Firestore Timestamp or ISO string as a relative time.
 *
 * @example
 * formatRelative("2026-05-26T10:00:00.000Z")  // "1 day ago"
 */
export function formatRelative(value: string | Date): string {
  const date  = typeof value === 'string' ? new Date(value) : value;
  const now   = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHrs  = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1)    return 'Just now';
  if (diffMins < 60)   return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHrs  < 24)   return `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`;
  if (diffDays < 30)   return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return formatDate(date);
}

/**
 * Truncate a string to a max length with ellipsis.
 *
 * @example
 * truncate("A very long description...", 100)
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trimEnd() + '…';
}

/**
 * Generate a URL-safe slug from a vehicle make/model/year.
 *
 * @example
 * vehicleSlug("Toyota", "Hilux", 2019)  // "toyota-hilux-2019"
 */
export function vehicleSlug(make: string, model: string, year: number): string {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
