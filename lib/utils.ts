import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type TShift = {
  type:
    | "patrol"
    | "oncall"
    | "flowers"
    | "east"
    | "gate"
    | "drone"
    | "event"
    | "unknown";
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
  ONCALL = "כוננות",
  FLOWERS = "פרחים",
  GATE = "ש״ג",
  DRONE = "רחפן",
  EAST = "מזרחי",
  EVENT = "אירוע",
}

export enum Status {
  AVAILABLE = "זמין",
  UNAVAILABLE = "לא זמין",
  OUTSIDE = "מחוץ למושב",
  ONCALL = "כונן",
}

export enum UserType {
  SQUAD = "כיתת כוננות",
  BAR = "בר שמירה",
  DRONE = "רחפן",
}

export type TShiftParticipents = TShift & Array<string>;
export type TUser = {
  username: string;
  id: string;
  status: string;
  type: UserType;
  phone: string;
  isDroneOperator: boolean;
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
  return elapsedHours > 48
    ? rtf.format(Math.round(elapsedHours / 24), "day")
    : rtf.format(Math.round(elapsedHours), "hour");
}

export function identifyShift(
  shift: PageObjectResponse,
  userId: string
): TShift {
  if (
    shift.properties[Positions.PATROL].type == "relation" &&
    shift.properties[Positions.PATROL].relation.some(
      (user) => user.id === userId
    )
  ) {
    return { type: "patrol", name: Positions.PATROL, emoji: "🚔" };
  }
  if (
    shift.properties[Positions.ONCALL].type == "relation" &&
    shift.properties[Positions.ONCALL].relation.some(
      (user) => user.id === userId
    )
  ) {
    return { type: "oncall", name: Positions.ONCALL, emoji: "🐴" };
  }
  if (
    shift.properties[Positions.FLOWERS].type == "relation" &&
    shift.properties[Positions.FLOWERS].relation.some(
      (user) => user.id === userId
    )
  ) {
    return { type: "flowers", name: Positions.FLOWERS, emoji: "🌷" };
  }
  if (
    shift.properties[Positions.EAST].type == "relation" &&
    shift.properties[Positions.EAST].relation.some((user) => user.id === userId)
  ) {
    return { type: "east", name: Positions.EAST, emoji: "🕌" };
  }
  if (
    shift.properties[Positions.DRONE].type == "relation" &&
    shift.properties[Positions.DRONE].relation.some(
      (user) => user.id === userId
    )
  ) {
    return { type: "drone", name: Positions.DRONE, emoji: "✈️" };
  }
  if (
    shift.properties[Positions.EVENT].type == "relation" &&
    shift.properties[Positions.EVENT].relation.some(
      (user) => user.id === userId
    )
  ) {
    return { type: "event", name: Positions.EVENT, emoji: "✨" };
  }
  if (
    shift.properties[Positions.GATE].type == "relation" &&
    shift.properties[Positions.GATE].relation.some((user) => user.id === userId)
  ) {
    return { type: "gate", name: Positions.GATE, emoji: "🚧" };
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
  return users.filter((user) => user.type === UserType.SQUAD);
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

  // in case that there is an overlap, and a shift start in one day and ends in the next day,
  // the endDate got the same day, so we add another day to the endDate
  if (startDate > endDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

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

export function generateOutlookLink({
  title,
  startDate,
  endDate,
  description,
}: TCalData) {
  const url = new URL("https://outlook.live.com/calendar/0/action/compose");
  url.searchParams.append("allday", "false");
  url.searchParams.append("subject", title);
  url.searchParams.append("rru", "addevent");
  url.searchParams.append("path", "/calendar/action/compose");
  url.searchParams.append("location", "סלעית");

  // in case that there is an overlap, and a shift start in one day and ends in the next day,
  // the endDate got the same day, so we add another day to the endDate
  if (startDate > endDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  url.searchParams.append("enddt", `${parseDate(endDate)}`);
  url.searchParams.append("startdt", `${parseDate(endDate)}`);
  description && url.searchParams.append("body", description);
  return url.toString();
}
