import { TCalData, generateCalendarLink } from "@/lib/utils";
import { Button, Divider, Grid, Text } from "@geist-ui/core";
import { Calendar } from "@geist-ui/icons";

interface IProps {
  calData: TCalData;
  disabled?: boolean;
}

export const ShiftActions = ({ calData, disabled }: IProps) => {
  const onCalClick = () => {
    window.open(generateCalendarLink(calData));
  };

  if (disabled) return null;

  return (
    <>
      <Divider my={3} />
      <Grid.Container justify="space-between" alignItems="center">
        <Grid>
          <Text b p>
            הוספה ליומן
          </Text>
        </Grid>
        <Grid>
          <Button
            onClick={onCalClick}
            iconRight={<Calendar />}
            height="50px"
            width="50px"
            padding={0}
            disabled={disabled}
          />
        </Grid>
      </Grid.Container>
    </>
  );
};
