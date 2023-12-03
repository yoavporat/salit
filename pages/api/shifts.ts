import { Notion } from "@/lib/notion";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  shifts: (
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse
  )[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = req.query.uid as string;
  if (userId) {
    res.status(200).json({ shifts: await new Notion().getUserShifts(userId) });
  } else {
    res.status(200).json({ shifts: await new Notion().getAllFutureShifts() });
  }
}
