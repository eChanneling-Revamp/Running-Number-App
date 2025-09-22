import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Replace with real DB 
  if (username === "nurse" && password === "1234") {
    return res.status(200).json({ success: true, role: "nurse" });
  }

  return res.status(401).json({ success: false, error: "Invalid credentials" });
}

//guys ths is just a dummy. replace it with your codes later :)