const buckets = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS =
  Number(process.env.FORM_RATE_LIMIT_WINDOW_SECONDS ?? 600) * 1000;
const MAX = Number(process.env.FORM_RATE_LIMIT_MAX ?? 5);

export function rateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX - 1 };
  }

  if (entry.count >= MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX - entry.count };
}
