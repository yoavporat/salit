import { TUser } from "@/lib/utils";
import { Card, Grid, Text, Toggle, Spinner, Button } from "@geist-ui/core";
import { useEffect, useState } from "react";

interface IProps {
  userId: string;
  openDrawer: () => void;
}

export const AvailabilityCard = ({ userId, openDrawer }: IProps) => {
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
        <Grid xs={8}>
          {Boolean(user) ? <Text b>{user?.status}</Text> : <Spinner />}
        </Grid>
        <Grid xs={8}>
          <Button auto onClick={openDrawer}>
            G
          </Button>
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
