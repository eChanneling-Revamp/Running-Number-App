import type { NextApiRequest, NextApiResponse } from "next";

// In-memory storage (reset every restart)
let queue: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { patientName, phone, source = "manual", sessionId = "default" } = req.body;

    if (!patientName || !phone) {
      return res.status(400).json({ error: "Patient name and phone are required" });
    }

    const newPatient = {
      id: Date.now().toString(),
      patientName,
      phone,
      source,
      sessionId,
      createdAt: new Date().toISOString(),
    };

    queue.push(newPatient);
    return res.status(201).json({ message: "Patient added", patient: newPatient });
  }

  if (req.method === "GET") {
    return res.status(200).json(queue);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
