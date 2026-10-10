// Webinar dates ("YYYY-MM-DD") and times ("HH:MM") are entered in Bangladesh
// time, which is UTC+6 all year. Everything here is pinned to that offset so
// the result is the same whatever timezone the server or the visitor is in.

/** A webinar stays on the public page this long after it starts, so late joiners still find the link. */
export const WEBINAR_VISIBLE_AFTER_START_MS = 6 * 60 * 60 * 1000;

/** The instant a webinar starts. Invalid when the date or time is not a real one. */
export function webinarStart(date: string, time: string): Date {
    return new Date(`${date}T${time}:00+06:00`);
}

/**
 * True once a webinar has started, as of `now` (ms since the epoch). A date or time that
 * cannot be read counts as started, so a broken row is never advertised as upcoming.
 */
export function webinarHasStarted(date: string, time: string, now: number): boolean {
    const start = webinarStart(date, time).getTime();
    return isNaN(start) || start <= now;
}
