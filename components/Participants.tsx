import { Positions, TUser, UserType, getShiftParticipents } from "@/lib/utils";
import { Grid, Tag, Text, User } from "@geist-ui/core";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import styled from "styled-components";
import UserTag from "./UserTag";

interface IProps {
  shift: PageObjectResponse;
  allUsers: Array<TUser>;
}

const ActivePositions = [
  Positions.PATROL,
  Positions.FLOWERS,
  Positions.GATE,
  Positions.DRONE,
  Positions.EVENT,
  Positions.ONCALL,
  Positions.EAST,
];

export const Participents = ({ shift, allUsers }: IProps) => (
  <Grid.Container direction="column" gap={1}>
    {ActivePositions.map((position) => {
      const participents = getShiftParticipents(shift, position, allUsers);
      if (participents.length === 0) {
        return null;
      }

      if (position === Positions.EVENT) {
        return (
          <Grid.Container
            key={position}
            gap={1}
            style={{ padding: "0 8px" }}
            alignItems="center"
          >
            {participents.map((participent) => (
              <Grid key={participent.id}>
                <UserTag user={participent} />
              </Grid>
            ))}
            <Grid>
              <Text b>{`(${participents.length})`}</Text>
            </Grid>
          </Grid.Container>
        );
      }

      return (
        <Grid key={position} padding={0}>
          <Wrapper>
            <Grid>
              <Text b>{position}</Text>
            </Grid>
            <Grid>
              {participents.length > 1 ? (
                <Grid.Container gap={1} justify="flex-end">
                  {participents.map((participent) => {
                    return (
                      <Grid key={participent.id}>
                        <UserTag user={participent} />
                      </Grid>
                    );
                  })}
                </Grid.Container>
              ) : (
                <UserTag user={participents[0]} />
              )}
            </Grid>
          </Wrapper>
        </Grid>
      );
    })}
  </Grid.Container>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
