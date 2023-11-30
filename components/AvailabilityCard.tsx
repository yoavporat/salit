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
    <Card width="80%">
      <Grid.Container direction="column">
        <Grid>
          <Grid.Container gap={2} justify="space-between" alignItems="center">
            <Grid>
              {user === null ? <Spinner /> : <Text b>{user?.status}</Text>}
            </Grid>
            <Grid direction="row-reverse">
              <Toggle
                checked={user?.status === "זמין"}
                scale={2}
                onChange={onToggle}
              />
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid>{squadData && <AvailabilityStatus data={squadData} />}</Grid>
      </Grid.Container>
    </Card>
  );
};

const AvailabilityStatus = ({ data }: { data: TUser[] }) => {
  const available = data.filter((user) => user.status === "זמין");
  const theme = useTheme();

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
      }}
      labels={{
        tickLabels: {
          type: "inner",
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
