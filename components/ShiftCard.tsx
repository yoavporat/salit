import styles from "@/styles/ShiftCard.module.css";
import {
  TCalData,
  getPageIcon,
  getPageTitle,
  identifyShift,
  toRelativeTime,
  toTime,
} from "@/lib/utils";
import { Card, Divider, Text } from "@geist-ui/core";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Participents } from "./Participants";
import { ShiftActions } from "./ShiftActions";

interface IProps {
  shift: PageObjectResponse;
  userId: string;
  allUsers: Array<any>;
}

export const ShiftCard = ({ shift, userId, allUsers }: IProps) => {
  const time =
    shift.properties["זמן"].type == "date" && shift.properties["זמן"].date;
  if (!time) {
    return null;
  }

  const type = identifyShift(shift, userId);
  const isLive = new Date(time.start) < new Date();
  const end = time.end as string;
  const timeString = `${toTime(end)} - ${toTime(time.start)} (${toRelativeTime(
    isLive ? end : time.start
  )})`;
  const title = isLive ? "המשמרת הנוכחית" : "המשמרת הבאה";

  const calData: TCalData = {
    title: `${type.name} ${type.emoji}`,
    startDate: new Date(time.start),
    endDate: new Date(end),
  };

  return (
    <Card type={isLive ? "violet" : "success"}>
      <Card.Content className={`${styles.cardHeader}`}>
        <Text b my={0}>
          {title}
        </Text>
        <Text>
          {type.type === "event" ? getPageIcon(shift, type.emoji) : type.emoji}
        </Text>
      </Card.Content>
      <Divider h="1px" my={0} />
      <Card.Content pb={2}>
        {type.name && (
          <Text h3>
            {type.type === "event" ? getPageTitle(shift) : type.name}
          </Text>
        )}
        <Text h5>{timeString}</Text>
        <Participents shift={shift} allUsers={allUsers} />
      </Card.Content>
      <Card.Footer disableAutoMargin>
        <ShiftActions calData={calData} />
      </Card.Footer>
    </Card>
  );
};
