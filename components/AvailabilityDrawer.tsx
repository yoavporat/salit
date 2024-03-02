import { TUser, getSquadMembers } from "@/lib/utils";
import { Divider, Spinner, useTheme, Text, Grid, Spacer } from "@geist-ui/core";
import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";
import styled from "styled-components";
import UserTag from "./UserTag";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

const AvailabilityDrawer = () => {
  const [squadMembers, setSquadMembers] = useState<TUser[]>([]);
  const [available, setavailable] = useState<TUser[]>([]);
  const [unavailable, setUnavailable] = useState<TUser[]>([]);
  const theme = useTheme();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setSquadMembers(getSquadMembers(data.users)));
  }, []);

  useEffect(() => {
    setavailable(squadMembers.filter((user) => user.status === "זמין"));
    setUnavailable(squadMembers.filter((user) => user.status !== "זמין"));
  }, [squadMembers]);

  if (squadMembers.length === 0) {
    return (
      <Loader>
        <Spinner scale={2} />
      </Loader>
    );
  }

  return (
    <>
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
      <Divider />
      <Grid.Container gap={2} direction="column" alignItems="flex-start">
        <Grid>
          <Text b>זמינים</Text>
          <Text b>{` (${available.length})`}</Text>
        </Grid>
        <Grid>
          <Grid.Container gap={1}>
            {available.map((user) => (
              <Grid key={user.id}>
                <UserTag user={user} />
              </Grid>
            ))}
          </Grid.Container>
        </Grid>
        <Grid>
          <Text b>לא זמינים</Text>
          <Text b>{` (${unavailable.length})`}</Text>
        </Grid>
        <Grid>
          <Grid.Container gap={1}>
            {unavailable.map((user) => (
              <Grid key={user.id}>
                <UserTag user={user} />
              </Grid>
            ))}
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </>
  );
};

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default AvailabilityDrawer;
