import Papa from "papaparse";

export const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day);
};

/** Converts a "DD.MM.YYYY" date to "YYYY-MM-DD", without going through a
 * Date/timezone conversion that could shift the calendar day. */
export const toISODate = (dateStr: string) => {
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/** The sheet's columns are entirely free-form except one rule: the first
 * column must be a `DD.MM.YYYY` date, used for sorting into past/future.
 * Whatever that column (and every other one) is named is read from the
 * sheet's own header row and rendered as-is. */
export type Event = Record<string, string>;
export type EventList = Event[];
export type DateData = { past: EventList; future: EventList };

export function stripMarkdownLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\(https?:\/\/[^\s)]+\)/g, "$1");
}

/**
 * Parse Google Sheet CSV into dictionary.
 * @param text Raw text.
 */
function parseCSV(text: string): DateData {
  // Parse csv into objects
  const events = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  }).data as unknown as EventList;

  if (events.length === 0) {
    return { past: [], future: [] };
  }

  // Whichever column comes first in the sheet holds the date.
  const dateColumn = Object.keys(events[0])[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() - 1); // Also keep yesterday's events in the future list

  const pastEvents: typeof events = [];
  const futureEvents: typeof events = [];

  // Separate by past / future
  for (const event of events) {
    const eventDate = parseDate(event[dateColumn]);
    if (eventDate < today) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  }

  // Sort each list by date ascending
  pastEvents.sort(
    (a, b) =>
      parseDate(b[dateColumn]).getTime() - parseDate(a[dateColumn]).getTime(),
  );
  futureEvents.sort(
    (a, b) =>
      parseDate(a[dateColumn]).getTime() - parseDate(b[dateColumn]).getTime(),
  );

  return { past: pastEvents, future: futureEvents };
}

/**
 * Fetches and parses a band's agenda from its public Google Sheet
 * (File > Share > Publish to web, CSV format).
 * Safe to call both at build time (static export) and client-side.
 */
export async function fetchAgenda(sheetId: string): Promise<DateData> {
  const res = await fetch(sheetId);
  const text = await res.text();
  return parseCSV(text);
}
