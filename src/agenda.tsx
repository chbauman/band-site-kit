"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import {
  DateData,
  EventList as EventListType,
  fetchAgenda,
} from "./agenda-data";

export function parseMarkdownLinks(text: string) {
  const parts = [];
  let lastIndex = 0;
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [, linkText, url] = match;

    // Push the text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Push the actual Next.js Link component
    parts.push(
      <Link
        key={match.index}
        href={url}
        className="text-brand hover:text-brand-dark font-medium hover:underline"
      >
        {linkText}
      </Link>,
    );

    lastIndex = regex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

const AgendaContext = createContext<DateData | null>(null);

/**
 * Provides agenda data to FutureEvents / PastEvents, seeded from a
 * build-time fetch so the tables are present in the static HTML, then
 * refreshed client-side on mount to pick up sheet changes without a rebuild.
 *
 * `initialData` should come from calling `fetchAgenda(sheetId)` in a server
 * component (e.g. an async page component) and passing the result down.
 */
export function AgendaProvider({
  sheetId,
  metaSheetId,
  initialData,
  children,
}: Readonly<{
  sheetId: string;
  /** Optional second sheet for a custom empty-agenda message; see
   * `fetchAgenda`'s `metaSheetId` parameter. */
  metaSheetId?: string;
  initialData: DateData;
  children: React.ReactNode;
}>) {
  const [data, setData] = useState<DateData>(initialData);

  useEffect(() => {
    fetchAgenda(sheetId, metaSheetId)
      .then(setData)
      .catch((err) => console.error("Error fetching sheet:", err));
  }, [sheetId, metaSheetId]);

  return (
    <AgendaContext.Provider value={data}>{children}</AgendaContext.Provider>
  );
}

function useAgendaData() {
  const data = useContext(AgendaContext);
  if (!data) {
    throw new Error("Agenda components must be used within AgendaProvider");
  }
  return data;
}

interface TableSurfaceProps {
  /** Background for the table body, e.g. `"bg-surface"` to use a
   * site-defined token instead of the plain white/near-black default. */
  surfaceClassName?: string;
  /** Background for odd rows (the striping), e.g. `"odd:bg-surface-alt"`.
   * Keep the `odd:` prefix in the value passed in. */
  stripeClassName?: string;
}

export function FutureEvents({
  surfaceClassName,
  stripeClassName,
}: Readonly<TableSurfaceProps> = {}) {
  const data = useAgendaData();
  return (
    <EventList
      data={data.future}
      noGigText={data.noGigText}
      surfaceClassName={surfaceClassName}
      stripeClassName={stripeClassName}
    />
  );
}

export function PastEvents({
  surfaceClassName,
  stripeClassName,
}: Readonly<TableSurfaceProps> = {}) {
  const data = useAgendaData();
  return (
    <EventList
      data={data.past}
      noGigText={data.noGigText}
      surfaceClassName={surfaceClassName}
      stripeClassName={stripeClassName}
    />
  );
}

const EventList = ({
  data,
  noGigText,
  surfaceClassName = "bg-white dark:bg-gray-900",
  stripeClassName = "odd:bg-gray-50 dark:odd:bg-gray-800/50",
}: {
  data: EventListType;
  noGigText?: string;
} & TableSurfaceProps) => {
  if (data.length == 0) {
    return (
      <p className="text-center">
        {noGigText ?? "No upcoming gigs planned yet."}
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-brand">
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                className="px-4 py-3 text-left font-heading font-semibold text-white first:rounded-tl-xl last:rounded-tr-xl"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={surfaceClassName}>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`${stripeClassName} hover:bg-brand/10 dark:hover:bg-brand/20 transition-colors`}
            >
              {Object.entries(row).map((keyAndCell) => (
                <td
                  key={keyAndCell[0]}
                  className="px-4 py-3 border-t border-gray-200 dark:border-gray-700"
                >
                  {parseMarkdownLinks(keyAndCell[1])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
