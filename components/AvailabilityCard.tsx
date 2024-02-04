import { TUser } from "@/lib/utils";
import { Card, Grid, Text, Toggle, Spinner, useTheme } from "@geist-ui/core";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

interface IProps {
  userId: string;
}

export const AvailabilityCard = ({ userId }: IProps) => {
  const [user, setUser] = useState<TUser>();

  useEffect(() => {
    fetch(`/api/users?uid=${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data.users.pop()));
  }, [userId]);

  const onAvailabilityToggle = (ev: any) => {
    setUser(undefined);
    fetch(`/api/availability?uid=${userId}`, {
      method: "POST",
      body: JSON.stringify({
        available: ev.target.checked,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedUser = user as TUser;
        updatedUser.status = data.status;
        setUser(updatedUser);
      });
  };

  return (
    <Card>
      <Grid.Container gap={2} justify="space-between" alignItems="center">
        <Grid xs={16}>
          {Boolean(user) ? <Text b>{user?.status}</Text> : <Spinner />}
        </Grid>
        <Grid direction="row-reverse" xs={8}>
          <Toggle
            checked={user?.status === "זמין"}
            scale={2}
            onChange={onAvailabilityToggle}
          />
        </Grid>
      </Grid.Container>
    </Card>
  );
};

const AvailabilityGuage = ({ data }: { data: TUser[] }) => {
  const [squadMembers, setSquadMembers] = useState<TUser[]>([]);
  const available = data.filter((user) => user.status === "זמין");
  const theme = useTheme();

  // useEffect(() => {
  //   fetch("/api/users")
  //     .then((res) => res.json())
  //     .then((data) => setSquadMembers(getSquadMembers(data.users)));
  // }, [user]);

  return (
    <GaugeComponent
      value={Math.round((available.length / 23) * 100)}
      type="semicircle"
      arc={{
        nbSubArcs: 2,
        subArcs: [
          { limit: 50, color: theme.palette.alert },
          { limit: 100, color: theme.palette.success },
        ],
        padding: 0.02,
        width: 0.12,
      }}
      labels={{
        tickLabels: {
          type: "inner",
          hideMinMax: true,
        },
        valueLabel: {
          style: {
            textShadow: "unset",
            fill: "unset",
          },
        },
      }}
      pointer={{
        type: "blob",
      }}
    />
  );
};
