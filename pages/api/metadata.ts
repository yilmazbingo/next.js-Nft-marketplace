import { NextApiRequest, NextApiResponse } from "next";

export default async function meta(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const tokenURI = JSON.parse(req.body);
    const metaRes = await fetch(tokenURI);
    const data = await metaRes.json();
    return res.json(data);
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
