import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = 1; // Expecting userId from the request query
    const result = await query(
      `SELECT home_address AS home, class_address AS class FROM users 
      WHERE user_id = ${userId}`
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
