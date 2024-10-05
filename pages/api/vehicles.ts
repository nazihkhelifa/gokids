import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await query(`
      SELECT v.id, v.name, v.seats, v.price, 
             d.id AS driver_id, d.name AS driver_name, d.rating AS driver_rating, d.bio AS driver_bio
      FROM vehicles v
      JOIN drivers d ON v.driver_id = d.id
    `);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No vehicles found" });
    }

    const vehicles = result.map((row: any) => ({
      id: row.id,
      name: row.name,
      seats: row.seats,
      price: row.price,
      driver: {
        id: row.driver_id,
        name: row.driver_name,
        rating: row.driver_rating,
        bio: row.driver_bio,
      },
    }));

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
