import prisma from "@/lib/prisma";
import * as crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req, res) {
  const poem = req.body.poem;
  const ts: Date = new Date();
  const prevBlock = await prisma.block.findFirst({ orderBy: { ts: "desc" } });
  console.log(prevBlock);
  let prevHash: string = "";
  if (prevBlock !== null) {
    const str = JSON.stringify({
      poem: prevBlock.poem,
      ts: prevBlock.ts,
      prevHash: prevBlock.prevHash,
    });
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    prevHash = hash.digest("hex");
  }
  const block = await prisma.block.create({
    data: { poem, ts, prevHash: prevHash },
  });
  res.send(block);
}
