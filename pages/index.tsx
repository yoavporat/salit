import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Notion } from "@/lib/notion";
import {
  Card,
  Collapse,
  Divider,
  Select,
  Spacer,
  Spinner,
  Tag,
  Text,
} from "@geist-ui/core";
import { useEffect, useState } from "react";
import {
  TShift,
  getShiftParticipents,
  identifyShift,
  toDate,
  toRelativeTime,
  toTime,
} from "@/lib/utils";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default function Home(props: { users: Array<any> }) {
  const [userId, setUserId] = useState<string>("");
  const [shifts, setShifts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<Array<any>>(props.users);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`/api/shifts?uid=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("salit-uid", userId);
          setShifts(data.shifts);
          setLoading(false);
        });
    } else {
      setShifts([]);
    }
  }, [userId]);

  useEffect(() => {
    const uid = localStorage.getItem("salit-uid");
    if (uid) {
      setUserId(uid);
    }
  }, []);

  const Shifts = (props: { shifts: Array<PageObjectResponse> }) => {
    if (props.shifts.length === 0) {
      return <NoShifts />;
    }
    return (
      <>
        <NextShift />
        <Collapse.Group className={styles.shiftsContainer}>
          {props.shifts &&
            props.shifts
              .slice(1)
              .map((shift) => (
                <Shift
                  key={shift.id}
                  shift={shift}
                  type={identifyShift(shift, userId)}
                />
              ))}
        </Collapse.Group>
      </>
    );
  };

  const Shift = (props: { shift: PageObjectResponse; type: TShift }) => {
    const time =
      props.shift.properties["זמן"].type == "date" &&
      props.shift.properties["זמן"].date;
    const subtitle =
      time &&
      `${toDate(time.start)} @ ${toTime(time.end as string)} - ${toTime(
        time.start
      )} (${toRelativeTime(time.start)})`;
    const title = `${props.type.emoji} ${props.type.name}`;

    return (
      <Collapse title={title} subtitle={subtitle}>
        <Participents shift={props.shift} />
      </Collapse>
    );
  };

  const NextShift = () => {
    const shift: PageObjectResponse = shifts[0];
    const time =
      shift.properties["זמן"].type == "date" && shift.properties["זמן"].date;
    const type = identifyShift(shift, userId);
    const timeString =
      time &&
      `${toTime(time.end as string)} - ${toTime(time.start)} (${toRelativeTime(
        time.start
      )})`;

    return (
      <Card width="80%" type="success">
        <Card.Content className={`${styles.cardHeader}`}>
          <Text b my={0}>
            המשמרת הבאה
          </Text>
          <Text>{type.emoji}</Text>
        </Card.Content>
        <Divider h="1px" my={0} />
        <Card.Content>
          <Text h3>{type.name}</Text>
          <Text h5>{timeString}</Text>
          <Participents shift={shift} />
        </Card.Content>
      </Card>
    );
  };

  const Participents = (props: { shift: PageObjectResponse }) => {
    const patrol = getShiftParticipents(props.shift, "סיור", allUsers);
    const flowers = getShiftParticipents(props.shift, "פרחים", allUsers);
    const east = getShiftParticipents(props.shift, "מזרחי", allUsers);
    const gate = getShiftParticipents(props.shift, "ש״ג", allUsers);
    const school = getShiftParticipents(props.shift, "בית ספר", allUsers);
    const drone = getShiftParticipents(props.shift, "רחפן", allUsers);

    return (
      <>
        {patrol && patrol.length > 0 && (
          <div className={`${styles.shiftEntry}`}>
            <Text p b>
              סיור
            </Text>
            <div className={`${styles.tagsWrapper}`}>
              <Tag type="lite">{patrol[0]}</Tag>
              <Tag type="lite">{patrol[1]}</Tag>
            </div>
          </div>
        )}
        {east && east.length > 0 && (
          <div className={`${styles.shiftEntry}`}>
            <Text p b>
              מזרחי
            </Text>
            <div className={`${styles.tagsWrapper}`}>
              <Tag type="lite">{east[0]}</Tag>
              <Tag type="lite">{east[1]}</Tag>
            </div>
          </div>
        )}
        {flowers && flowers.length > 0 && (
          <div className={`${styles.shiftEntry}`}>
            <Text p b>
              פרחים
            </Text>
            <div className={`${styles.tagsWrapper}`}>
              <Tag type="lite">{flowers[0]}</Tag>
              {flowers[1] && <Tag type="lite">{flowers[1]}</Tag>}
            </div>
          </div>
        )}
        {gate && gate.length > 0 && (
          <div className={`${styles.shiftEntry}`}>
            <Text p b>
              ש״ג
            </Text>
            <div className={`${styles.tagsWrapper}`}>
              <Tag type="lite">{gate[0]}</Tag>
              {gate[1] && <Tag type="lite">{gate[1]}</Tag>}
            </div>
          </div>
        )}
        {school && school.length > 0 && (
          <div className={`${styles.shiftEntry}`}>
            <Text p b>
              בית ספר
            </Text>
            <Tag type="lite">{school[0]}</Tag>
          </div>
        )}
        {drone && drone.length > 0 && (
          <div className={`${styles.shiftEntry}`}>
            <Text p b>
              רחפן
            </Text>
            <Tag type="lite">{drone[0]}</Tag>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>סלעית | רשימת שמירה</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Text h2>רשימת שמירה</Text>
        <Select
          placeholder="שם"
          onChange={(e) => setUserId(e as string)}
          width="75%"
          height="40px"
          value={userId}
          clearable
        >
          {props.users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.username}
            </Select.Option>
          ))}
        </Select>
        {loading ? <Loader /> : <Shifts shifts={shifts} />}
      </main>
    </>
  );
}

const Loader = () => {
  return (
    <>
      <Spacer h={2} />
      <Spinner scale={5} />
    </>
  );
};

const NoShifts = () => {
  return (
    <>
      <Text h1>🏝️</Text>
      <Text h3>אין משמרות</Text>
    </>
  );
};

export const getServerSideProps = async () => {
  const allUsers = await new Notion().getAllUsers();
  return {
    props: {
      users: allUsers,
    },
  };
};
