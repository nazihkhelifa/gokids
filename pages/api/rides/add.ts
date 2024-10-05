import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    userId,
    vehicleName,
    seats,
    price,
    days,
    pickupTimes,
    pickupAddress,
    dropAddress,
    driverName,
  } = req.body;

  // Validate that all necessary fields are provided
  if (
    !userId ||
    !vehicleName ||
    !seats ||
    !price ||
    !days ||
    !pickupTimes ||
    !pickupAddress ||
    !dropAddress ||
    !driverName
  ) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // Format the days as a PostgreSQL array and pickupTimes as a JSON string
    const formattedDays = `{${days.join(",")}}`;
    const formattedPickupTimes = JSON.stringify(pickupTimes);

    // Insert ride into the database
    const result = await query(`
      INSERT INTO rides 
      (user_id, vehicle_name, seats, price, days, pickup_times, pickup_address, drop_address, driver_name)
      VALUES 
      (${userId}, '${vehicleName}', ${seats}, '${price}', '${formattedDays}', '${formattedPickupTimes}', '${pickupAddress}', '${dropAddress}', '${driverName}')
    `);

    res.status(201).json({ message: "Ride added successfully" });
  } catch (error) {
    console.error("Error adding ride:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
