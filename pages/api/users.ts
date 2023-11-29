import { Notion } from "@/lib/notion";
import { TUser } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  users: TUser[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const users = await new Notion().getAllUsers();
  res.status(200).json({ users });
}
