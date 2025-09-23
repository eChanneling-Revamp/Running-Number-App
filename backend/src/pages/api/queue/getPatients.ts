import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address?: string;
  email?: string;
  createdAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection<Patient>("patients");

    // Fetch all patients sorted by creation date (newest first)
    const patients = await collection.find().sort({ createdAt: -1 }).toArray();

    res.status(200).json(patients);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to fetch patients", error: error.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
}
