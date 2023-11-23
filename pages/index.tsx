import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Notion } from "@/lib/notion";
import { Collapse, Select, Spacer, Spinner, Text } from "@geist-ui/core";
import { useEffect, useState } from "react";
import {
  TShift,
  identifyShift,
  toDate,
  toRelativeTime,
  toTime,
} from "@/lib/utils";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Participents } from "@/components/Participants";
import { ShiftCard } from "@/components/ShiftCard";

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
        <ShiftCard shift={shifts[0]} userId={userId} allUsers={allUsers} />
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
        <Participents shift={props.shift} allUsers={allUsers} />
      </Collapse>
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
          height="50px"
          value={userId}
          clearable
        >
          {props.users.map((user) => (
            <Select.Option key={user.id} value={user.id} font={2}>
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
