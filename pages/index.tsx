import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import styles from "@/styles/Home.module.css";
import { Notion } from "@/lib/notion";
import {
  Button,
  Collapse,
  Grid,
  Select,
  Spacer,
  Spinner,
  Text,
} from "@geist-ui/core";
import { useEffect, useState } from "react";
import {
  TShift,
  TUser,
  getSquadMembers,
  identifyShift,
  toDate,
  toTime,
} from "@/lib/utils";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Participents } from "@/components/Participants";
import { ShiftCard } from "@/components/ShiftCard";
import { AvailabilityCard } from "@/components/AvailabilityCard";
import { Eye } from "@geist-ui/icons";

export default function Home(props: { users: Array<any> }) {
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<TUser | null>();
  const [shifts, setShifts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<Array<any>>(props.users);

  const { data: session } = useSession();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`/api/shifts?uid=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("salit-uid", userId);
          setShifts(data.shifts);
          setUser(allUsers.find((user) => user.id === userId));
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    const uid = localStorage.getItem("salit-uid");
    if (uid) {
      setUserId(uid);
      setUser(allUsers.find((user) => user.id === userId));
    } else {
      onClear();
    }
  }, [allUsers]);

  const onAvailabilityToggle = (ev: any) => {
    setUser(null);
    fetch(`/api/availability?uid=${userId}`, {
      method: "POST",
      body: JSON.stringify({
        available: ev.target.checked,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedUser = allUsers.find((user) => user.id === userId);
        updatedUser.status = data.status;
        fetch("/api/users")
          .then((res) => res.json())
          .then((data) => setAllUsers(data.users));
      });
  };

  const onClear = () => {
    setUserId("");
    setLoading(true);
    fetch(`/api/shifts`)
      .then((res) => res.json())
      .then((data) => {
        setShifts(data.shifts);
        setLoading(false);
      });
    setUser(undefined);
  };

  const Shifts = (props: { shifts: Array<PageObjectResponse> }) => {
    if (props.shifts.length === 0) {
      return <NoShifts />;
    }
    return (
      <Grid.Container direction="column" alignItems="stretch" width="90%">
        <Grid xs={24} padding="40px">
          <ShiftCard shift={shifts[0]} userId={userId} allUsers={allUsers} />
        </Grid>
        <Grid>
          <Collapse.Group>
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
        </Grid>
      </Grid.Container>
    );
  };

  const Shift = (props: { shift: PageObjectResponse; type: TShift }) => {
    const time =
      props.shift.properties["זמן"].type == "date" &&
      props.shift.properties["זמן"].date;

    if (!time) {
      return null;
    }

    const subtitle = `${toDate(time.start)} @ ${toTime(
      time.end as string
    )} - ${toTime(time.start)}`;
    const title =
      props.type.type === "unknown"
        ? subtitle
        : `${props.type.emoji} ${props.type.name}`;

    return (
      <Collapse
        title={title}
        subtitle={props.type.type !== "unknown" && subtitle}
      >
        <Participents shift={props.shift} allUsers={allUsers} />
      </Collapse>
    );
  };

  return (
    <>
      <Head>
        <title>סלעית | רשימת שמירה</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main}`}>
        <Text h2>רשימת שמירה</Text>
        {session ? (
          <Grid.Container
            gap={1}
            justify="center"
            direction="column"
            alignItems="center"
          >
            <Grid.Container gap={1} justify="center">
              <Grid xs={16}>
                <Select
                  placeholder="שם"
                  onChange={(e) => setUserId(e as string)}
                  height="50px"
                  width="100%"
                  value={userId}
                >
                  {props.users.map((user) => (
                    <Select.Option key={user.id} value={user.id} font={2}>
                      {user.username}
                    </Select.Option>
                  ))}
                </Select>
              </Grid>
              <Grid xs={4}>
                <Button
                  iconRight={<Eye />}
                  height="50px"
                  width="100%"
                  padding={0}
                  onClick={onClear}
                  disabled={!userId}
                />
              </Grid>
            </Grid.Container>
            {loading ? (
              <Grid>
                <Loader />
              </Grid>
            ) : (
              <>
                <Grid xs={24}>
                  <AvailabilityCard
                    user={user}
                    onToggle={onAvailabilityToggle}
                    squadData={getSquadMembers(allUsers)}
                  />
                </Grid>
                <Shifts shifts={shifts} />
              </>
            )}
          </Grid.Container>
        ) : (
          <Unauthorized />
        )}
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

const Unauthorized = () => {
  return (
    <Grid.Container
      gap={1}
      justify="center"
      alignContent="center"
      direction="column"
    >
      <Grid>
        <Text h1 style={{ textAlign: "center" }}>
          🤐
        </Text>
      </Grid>
      <Grid>
        <Text h3 style={{ textAlign: "center" }}>
          כניסה לא מאושרת
        </Text>
      </Grid>
      <Grid>
        <Button
          type="secondary"
          scale={1.5}
          onClick={() => signIn()}
          style={{ margin: "auto" }}
        >
          <Text b>כניסה</Text>
        </Button>
      </Grid>
    </Grid.Container>
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
