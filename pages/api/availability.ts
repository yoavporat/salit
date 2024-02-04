import { Notion } from "@/lib/notion";
import { Status } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: Status;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.uid as string;
  let status: Status;

  if (req.method === "GET") {
    status = await new Notion().getUserStatus(userId);
    res.status(200).json({ status });
  } else if (req.method === "POST") {
    const isAvailable = JSON.parse(req.body).available;
    status = await new Notion().setUserStatus(
      userId,
      isAvailable ? Status.AVAILABLE : Status.OUTSIDE
    );
    res.status(200).json({ status });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
