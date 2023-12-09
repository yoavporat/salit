import { Positions, getShiftParticipents } from "@/lib/utils";
import { Grid, Tag, Text } from "@geist-ui/core";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface IProps {
  shift: PageObjectResponse;
  allUsers: Array<any>;
}

const ActivePositions = [
  Positions.PATROL,
  Positions.FLOWERS,
  Positions.GATE,
  Positions.DRONE,
  Positions.EVENT,
];

export const Participents = ({ shift, allUsers }: IProps) => (
  <Grid.Container direction="column" gap={1}>
    {ActivePositions.map((position) => {
      const participents = getShiftParticipents(shift, position, allUsers);
      if (participents.length === 0) return null;

      if (position === Positions.EVENT) {
        return (
          <Grid.Container key={position} gap={1} style={{ padding: "0 8px" }}>
            {participents.map((participent) => (
              <Grid key={participent}>
                <Tag type="lite">{participent}</Tag>
              </Grid>
            ))}
          </Grid.Container>
        );
      }

      return (
        <Grid key={position}>
          <Grid.Container justify="space-between" alignItems="center">
            <Grid>
              <Text b>{position}</Text>
            </Grid>
            <Grid>
              {participents.length > 1 ? (
                <Grid.Container gap={1}>
                  <Grid>
                    <Tag type="lite">{participents[0]}</Tag>
                  </Grid>
                  <Grid>
                    <Tag type="lite">{participents[1]}</Tag>
                  </Grid>
                </Grid.Container>
              ) : (
                <Tag type="lite">{participents[0]}</Tag>
              )}
            </Grid>
          </Grid.Container>
        </Grid>
      );
    })}
  </Grid.Container>
);
