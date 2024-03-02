import { TUser, UserType } from "@/lib/utils";
import { Tag } from "@geist-ui/core";
import styled from "styled-components";

const UserTag = ({ user }: { user: TUser }) => {
  const type = user?.type === UserType.SQUAD ? "lite" : "warning";
  const username = user.isDroneOperator ? `${user.username} 🚁` : user.username;
  if (user.phone) {
    return (
      <Tag type={type} invert={user.type !== UserType.SQUAD}>
        <UserLink href={`tel:${user.phone}`}>{username}</UserLink>
      </Tag>
    );
  } else {
    return (
      <Tag type={type} invert={user.type !== UserType.SQUAD}>
        {username}
      </Tag>
    );
  }
};

const UserLink = styled.a`
  color: inherit;
`;

export default UserTag;
