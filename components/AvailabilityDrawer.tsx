import { TUser } from "@/lib/utils";
import { Spinner, useTheme, Grid, Collapse } from "@geist-ui/core";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styled from "styled-components";
import UserTag from "./UserTag";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

const AvailabilityDrawer = () => {
  const [squadMembers, setSquadMembers] = useState<TUser[]>([]);
  const [available, setAvailable] = useState<TUser[]>([]);
  const [unavailable, setUnavailable] = useState<TUser[]>([]);
  const theme = useTheme();

  useEffect(() => {
    fetch("/api/users?drafted=true")
      .then((res) => res.json())
      .then((data) => setSquadMembers(data.users));
  }, []);

  useEffect(() => {
    setAvailable(squadMembers.filter((user) => user.status === "זמין"));
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
        value={Math.round((available.length / squadMembers.length) * 100)}
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
      <Collapse.Group>
        <Collapse title={`זמינים (${available.length})`}>
          <Grid.Container gap={1}>
            {available.map((user) => (
              <Grid key={user.id}>
                <UserTag user={user} />
              </Grid>
            ))}
          </Grid.Container>
        </Collapse>
        <Collapse title={`לא זמינים (${unavailable.length})`}>
          <Grid.Container gap={1}>
            {unavailable.map((user) => (
              <Grid key={user.id}>
                <UserTag user={user} />
              </Grid>
            ))}
          </Grid.Container>
        </Collapse>
      </Collapse.Group>
    </>
  );
};

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default AvailabilityDrawer;
