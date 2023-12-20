import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type TShift = {
  type: "patrol" | "east" | "flowers" | "gate" | "drone" | "event" | "unknown";
  name: string;
  emoji: string;
};

export type TCalData = {
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
};

export enum Positions {
  PATROL = "סיור",
  EAST = "מזרחי",
  FLOWERS = "פרחים",
  GATE = "ש״ג",
  DRONE = "רחפן",
  EVENT = "אירוע",
}

export type TShiftParticipents = TShift & Array<string>;
export type TUser = {
  username: string;
  id: string;
  status: string;
  type: string;
  phone: string;
};

function parseDate(date: Date) {
  return date.toISOString().replace(/-|:|\.\d+/g, "");
}

export function toDate(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "long",
    day: "numeric",
  };
  return Intl.DateTimeFormat("he-IL", options).format(new Date(date));
}

export function toTime(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return Intl.DateTimeFormat("he-IL", options).format(new Date(date));
}

export function toRelativeTime(date: string) {
  const rtf = new Intl.RelativeTimeFormat("he-IL", { numeric: "auto" });
  const elapsed = (new Date(date).getTime() - Date.now()) / 1000;
  const elapsedHours = Math.round(elapsed / 60 / 60);
  return elapsedHours > 24
    ? rtf.format(Math.round(elapsed / 60 / 60 / 24), "day")
    : rtf.format(Math.round(elapsedHours), "hour");
}

export function identifyShift(
  shift: PageObjectResponse,
  userId: string
): TShift {
  if (
    shift.properties["סיור"].type == "relation" &&
    shift.properties["סיור"].relation.some((user) => user.id === userId)
  ) {
    return { type: "patrol", name: "סיור", emoji: "🚔" };
  }
  if (
    shift.properties["מזרחי"].type == "relation" &&
    shift.properties["מזרחי"].relation.some((user) => user.id === userId)
  ) {
    return { type: "east", name: "מזרחי", emoji: "🕌" };
  }
  if (
    shift.properties["פרחים"].type == "relation" &&
    shift.properties["פרחים"].relation.some((user) => user.id === userId)
  ) {
    return { type: "flowers", name: "פרחים", emoji: "🌷" };
  }
  if (
    shift.properties["רחפן"].type == "relation" &&
    shift.properties["רחפן"].relation.some((user) => user.id === userId)
  ) {
    return { type: "drone", name: "רחפן", emoji: "✈️" };
  }
  if (
    shift.properties["אירוע"].type == "relation" &&
    shift.properties["אירוע"].relation.some((user) => user.id === userId)
  ) {
    return { type: "event", name: "אירוע", emoji: "✨" };
  }
  if (
    shift.properties["ש״ג"].type == "relation" &&
    shift.properties["ש״ג"].relation.some((user) => user.id === userId)
  ) {
    return { type: "gate", name: "ש״ג", emoji: "🚧" };
  }
  return { type: "unknown", name: "", emoji: "" };
}

export function getShiftParticipents(
  shift: PageObjectResponse,
  type: string,
  allUsers: TUser[]
) {
  const relation = shift.properties[type];
  if (relation.type === "relation") {
    return relation.relation.map((p) =>
      allUsers.find((u) => u.id === p.id)
    ) as Array<TUser>;
  } else {
    return [];
  }
}

export function getSquadMembers(users: TUser[]) {
  return users.filter((user) => user.type === "כיתת כוננות");
}

export function getPageTitle(page: PageObjectResponse) {
  if (page.properties["משמרת"].type === "title") {
    return page.properties["משמרת"].title[0].plain_text;
  }
  return "";
}

export function getPageIcon(page: PageObjectResponse, fallback: string) {
  if (page.icon && page.icon.type === "emoji") {
    return page.icon.emoji;
  }
  return fallback;
}

export function generateGoogleCalendarLink({
  title,
  startDate,
  endDate,
  description,
}: TCalData) {
  const url = new URL("https://www.google.com/calendar/render");

  url.searchParams.append("action", "TEMPLATE");
  url.searchParams.append("text", title);
  url.searchParams.append(
    "dates",
    `${parseDate(startDate)}/${parseDate(endDate)}`
  );
  description && url.searchParams.append("details", description);
  url.searchParams.append("location", "סלעית");
  url.searchParams.append("sf", "true");
  url.searchParams.append("output", "xml");
  return url.toString();
}

export function generateOutlookCalendarLink({
  title,
  startDate,
  endDate,
  description,
}: TCalData) {
  const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose");

  url.searchParams.append("rru", "addevent");
  url.searchParams.append("subject", title);
  url.searchParams.append("startdt", parseDate(startDate));
  url.searchParams.append("enddt", parseDate(endDate));
  description && url.searchParams.append("body", description);
  url.searchParams.append("location", "סלעית");
  return url.toString();
}
