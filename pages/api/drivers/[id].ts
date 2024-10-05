import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    // Fetch driver information
    const driverResult = await query(
      `SELECT id, name, rating, bio, image FROM drivers WHERE id = ${id}`
    );
    if (driverResult.length === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const driver = driverResult[0];

    // Fetch reviews for this driver
    const reviewsResult = await query(
      `SELECT u.user_name AS name, u.since AS since, r.comment, r.image 
      FROM reviews r 
      JOIN users u ON r.user_id = u.user_id 
      WHERE r.driver_id = ${id}`
    );

    // Attach reviews to the driver object
    driver.reviews = reviewsResult;

    res.status(200).json(driver);
  } catch (error) {
    console.error("Error fetching driver data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
