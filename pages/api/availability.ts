import { Notion } from "@/lib/notion";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.uid as string;
  const isAvailable = JSON.parse(req.body).available;
  const status = await new Notion().setUserStatus(
    userId,
    isAvailable ? "זמין" : "מחוץ למושב"
  );
  res.status(200).json({ status });
}
