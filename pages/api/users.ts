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
  const userId = req.query.uid as string;
  const draftedOnly = req.query.drafted as string;
  if (userId) {
    const user = await new Notion().getUser(userId);
    if (user) {
      res.status(200).json({ users: [user] });
    } else {
      res.status(404).json({ users: [] });
    }
  } else {
    const notion = new Notion();
    const users = await (Boolean(draftedOnly) ? notion.getAllDraftedUsers() : notion.getAllUsers());
    res.status(200).json({ users });
  }
}
