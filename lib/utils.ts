import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type TShift = {
  type: "patrol" | "east" | "flowers" | "gate" | "drone";
  name: string;
  emoji: string;
};

export type TShiftParticipents = TShift & Array<string>;
export type TUser = {
  username: string;
  id: string;
};

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
  return { type: "gate", name: "ש״ג", emoji: "🚧" };
}

export function getShiftParticipents(
  shift: PageObjectResponse,
  type: string,
  allUsers: TUser[]
) {
  const relation = shift.properties[type];
  return (
    relation.type === "relation" &&
    (relation.relation.map(
      (p) => allUsers.find((u) => u.id === p.id)?.username
    ) as Array<string>)
  );
}
