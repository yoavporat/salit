import { TUser } from "@/lib/utils";
import {
  Card,
  Grid,
  Text,
  Toggle,
  Spinner,
  Capacity,
  useTheme,
} from "@geist-ui/core";

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
  const threshold = 12;
  const theme = useTheme();

  return (
    <Grid.Container justify="space-between" alignItems="center">
      <Grid>
        <Text b> במושב כרגע</Text>
      </Grid>
      <Grid>
        <Text p>{`(23 / ${available.length})`}</Text>
      </Grid>
      <Grid>
        <Capacity
          value={available.length}
          limit={23}
          scale={3}
          color={
            available.length < threshold
              ? theme.palette.errorLight
              : theme.palette.cyan
          }
        />
      </Grid>
    </Grid.Container>
  );
};
