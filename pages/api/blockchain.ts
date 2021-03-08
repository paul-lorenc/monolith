import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function (req, res) {
  const chain = await prisma.block.findMany({ orderBy: { ts: "desc" } });
  res.send(chain);
}
