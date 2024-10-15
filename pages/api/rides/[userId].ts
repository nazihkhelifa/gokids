import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  try {
    const userId = 1; // Example user ID
    const result = await query(
      `SELECT * FROM ride WHERE user_id = ${userId}`,
     
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No rides found for this user" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
