import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, newAvailableRides } = req.body;

  if (!userId || newAvailableRides === undefined) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const result = await query(
      `UPDATE users SET available_rides = ${newAvailableRides} WHERE user_id = ${userId}`,
   
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Available rides updated successfully" });
  } catch (error) {
    console.error("Error updating available rides:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
