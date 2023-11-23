import styles from "@/styles/Participants.module.css";
import { getShiftParticipents } from "@/lib/utils";
import { Tag, Text } from "@geist-ui/core";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface IProps {
  shift: PageObjectResponse;
  allUsers: Array<any>;
}

export const Participents = ({ shift, allUsers }: IProps) => {
  const patrol = getShiftParticipents(shift, "סיור", allUsers);
  const flowers = getShiftParticipents(shift, "פרחים", allUsers);
  const east = getShiftParticipents(shift, "מזרחי", allUsers);
  const gate = getShiftParticipents(shift, "ש״ג", allUsers);
  const school = getShiftParticipents(shift, "בית ספר", allUsers);
  const drone = getShiftParticipents(shift, "רחפן", allUsers);

  return (
    <>
      {patrol && patrol.length > 0 && (
        <div className={`${styles.shiftEntry}`}>
          <Text p b>
            סיור
          </Text>
          <div className={`${styles.tagsWrapper}`}>
            <Tag type="lite">{patrol[0]}</Tag>
            <Tag type="lite">{patrol[1]}</Tag>
          </div>
        </div>
      )}
      {east && east.length > 0 && (
        <div className={`${styles.shiftEntry}`}>
          <Text p b>
            מזרחי
          </Text>
          <div className={`${styles.tagsWrapper}`}>
            <Tag type="lite">{east[0]}</Tag>
            <Tag type="lite">{east[1]}</Tag>
          </div>
        </div>
      )}
      {flowers && flowers.length > 0 && (
        <div className={`${styles.shiftEntry}`}>
          <Text p b>
            פרחים
          </Text>
          <div className={`${styles.tagsWrapper}`}>
            <Tag type="lite">{flowers[0]}</Tag>
            {flowers[1] && <Tag type="lite">{flowers[1]}</Tag>}
          </div>
        </div>
      )}
      {gate && gate.length > 0 && (
        <div className={`${styles.shiftEntry}`}>
          <Text p b>
            ש״ג
          </Text>
          <div className={`${styles.tagsWrapper}`}>
            <Tag type="lite">{gate[0]}</Tag>
            {gate[1] && <Tag type="lite">{gate[1]}</Tag>}
          </div>
        </div>
      )}
      {school && school.length > 0 && (
        <div className={`${styles.shiftEntry}`}>
          <Text p b>
            בית ספר
          </Text>
          <Tag type="lite">{school[0]}</Tag>
        </div>
      )}
      {drone && drone.length > 0 && (
        <div className={`${styles.shiftEntry}`}>
          <Text p b>
            רחפן
          </Text>
          <Tag type="lite">{drone[0]}</Tag>
        </div>
      )}
    </>
  );
};
