// src/pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 

// Define the Nurse type (how the data will be stored in DB)
interface Nurse {
  _id?: string;
  username: string; 
  password: string;
  createdAt: Date;
}

// Define the response structure
interface LoginResponse {
  message: string;
  token?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const nursesCollection = db.collection<Nurse>("nurses");

    // Check if nurse exists in DB
    const nurse = await nursesCollection.findOne({ username });
    if (!nurse) {
      // Unauthorized login attempt
      console.warn(`Unauthorized login attempt with username: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, nurse.password);
    if (!isPasswordValid) {
      // Unauthorized login attempt
      console.warn(`Invalid password attempt for username: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for the session
    const token = jwt.sign(
      { id: nurse._id, username: nurse.username, role: "nurse" }, // payload
      process.env.JWT_SECRET as string, // secret from .env file
      { expiresIn: "8h" } // session duration
    );

    // Send success response with token
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }
}
