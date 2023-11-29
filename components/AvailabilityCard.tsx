import { TUser } from "@/lib/utils";
import { Card, Grid, Text, Toggle, Spinner } from "@geist-ui/core";

interface IProps {
  user?: TUser | null;
  onToggle: (ev: any) => void;
}

export const AvailabilityCard = ({ user, onToggle }: IProps) => {
  return (
    <Card width="80%">
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
    </Card>
  );
};
