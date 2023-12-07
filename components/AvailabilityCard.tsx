import { TUser } from "@/lib/utils";
import { Card, Grid, Text, Toggle, Spinner, useTheme } from "@geist-ui/core";
import dynamic from "next/dynamic";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

interface IProps {
  user?: TUser | null;
  onToggle: (ev: any) => void;
  squadData: TUser[];
}

export const AvailabilityCard = ({ user, onToggle, squadData }: IProps) => {
  return (
    <Card>
      <Grid.Container direction="column">
        <Grid>
          {user === undefined ? (
            <Text h3 style={{ textAlign: "center" }}>
              זמינות
            </Text>
          ) : (
            <Grid.Container gap={2} justify="space-between" alignItems="center">
              <Grid xs={16}>
                {user === null ? <Spinner /> : <Text b>{user?.status}</Text>}
              </Grid>
              <Grid direction="row-reverse" xs={8}>
                <Toggle
                  checked={user?.status === "זמין"}
                  scale={2}
                  onChange={onToggle}
                />
              </Grid>
            </Grid.Container>
          )}
        </Grid>
        <Grid style={{ alignSelf: "center" }}>
          {squadData && <AvailabilityGuage data={squadData} />}
        </Grid>
      </Grid.Container>
    </Card>
  );
};

const AvailabilityGuage = ({ data }: { data: TUser[] }) => {
  const available = data.filter((user) => user.status === "זמין");
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 500;
  const theme = useTheme();

  return (
    <GaugeComponent
      value={Math.round((available.length / 23) * 100)}
      type="semicircle"
      style={{
        width: windowWidth <= 375 ? "90%" : "100%",
        pointerEvents: "none",
      }}
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
