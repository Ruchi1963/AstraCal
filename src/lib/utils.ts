export const cls = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ')
export function minutesSinceMidnight(d: Date) { return d.getHours() * 60 + d.getMinutes() }
