import {
  TCalData,
  generateGoogleCalendarLink,
  generateOutlookLink,
} from "@/lib/utils";
import { Button, Grid, Text } from "@geist-ui/core";
import Image from "next/image";

interface IProps {
  calData: TCalData;
  transparent?: boolean;
}

export const ShiftActions = ({ calData, transparent }: IProps) => {
  return (
    <>
      <Grid.Container justify="space-between" alignItems="center" w="100%">
        <Grid>
          <Text b>הוספה ליומן</Text>
        </Grid>
        <Grid.Container w="auto" gap={1}>
          <Grid>
            <Button
              onClick={() => window.open(generateOutlookLink(calData))}
              icon={
                <Image
                  src={"outlook.svg"}
                  alt="outlook"
                  width={24}
                  height={24}
                />
              }
              height="50px"
              width="50px"
              padding={0}
              type={transparent ? "success" : "default"}
            />
          </Grid>
          <Grid>
            <Button
              onClick={() => window.open(generateGoogleCalendarLink(calData))}
              icon={
                <Image
                  src={"gcal.svg"}
                  alt="google calendar"
                  width={24}
                  height={24}
                />
              }
              height="50px"
              width="50px"
              padding={0}
              type={transparent ? "success" : "default"}
            />
          </Grid>
        </Grid.Container>
      </Grid.Container>
    </>
  );
};
