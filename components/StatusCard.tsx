import { Status } from "@/lib/utils";
import { Button, Dot, Grid, Text, useTheme } from "@geist-ui/core";

interface IProps {
  status: Status;
  onToggle: (ev: any) => void;
}

export const StatusCard = ({ status }: IProps) => {
  const theme = useTheme();
  let type: "success" | "warning" | "error";

  if (status === Status.ONCALL) {
    type = "success";
  } else if (status === Status.AVAILABLE) {
    type = "warning";
  } else {
    type = "error";
  }

  return (
    <Grid.Container direction="column" style={{ gap: "30px" }}>
      <Grid.Container alignItems="center" justify="center">
        <Grid>
          <Dot type={type} />
        </Grid>
        <Grid>
          <Text h3 margin={0}>
            {status}
          </Text>
        </Grid>
      </Grid.Container>
      <Grid.Container justify="space-between">
        <Grid xs={7}>
          <Button
            scale={1.5}
            width="100%"
            type="success"
            ghost={status !== Status.ONCALL}
          >
            {Status.ONCALL}
          </Button>
        </Grid>
        <Grid xs={7}>
          <Button
            scale={1.5}
            width="100%"
            type="warning"
            ghost={status !== Status.AVAILABLE}
          >
            {Status.AVAILABLE}
          </Button>
        </Grid>
        <Grid xs={7}>
          <Button
            scale={1.5}
            width="100%"
            type="error"
            ghost={status !== Status.UNAVAILABLE}
          >
            לא זמין
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
