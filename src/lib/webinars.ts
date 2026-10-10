// Webinar dates ("YYYY-MM-DD") and times ("HH:MM") are entered in Bangladesh
// time, which is UTC+6 all year. Everything here is pinned to that offset so
// the result is the same whatever timezone the server or the visitor is in.
const BANGLADESH_OFFSET_MS = 6 * 60 * 60 * 1000;

/** A webinar stays on the public page this long after it starts, so late joiners still find the link. */
export const WEBINAR_VISIBLE_AFTER_START_MS = 6 * 60 * 60 * 1000;

/** The instant a webinar starts. Invalid when the date or time is not a real one. */
export function webinarStart(date: string, time: string): Date {
    return new Date(`${date}T${time}:00+06:00`);
}

/** Today's date in Bangladesh as "YYYY-MM-DD", comparable with a webinar's date. */
export function bangladeshToday(): string {
    return new Date(Date.now() + BANGLADESH_OFFSET_MS).toISOString().split("T")[0];
}
