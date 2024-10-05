import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId parameter" });
  }

  try {
    const userId = 1;
    const result = await query(
      `SELECT ride_id, vehicle_name, seats, price, days, pickup_times, pickup_address, drop_address, driver_name 
       FROM rides 
       WHERE user_id = ${userId}`
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No scheduled rides found for this user" });
    }

    // Convert the result into a format similar to your mock data
    const rides = result.map((ride: any) => ({
      id: ride.ride_id,
      vehicleName: ride.vehicle_name,
      seats: ride.seats,
      price: `${ride.price}€`,
      days: ride.days.split(","), // Convert comma-separated string back to an array
      pickupTimes: ride.pickup_times,
      pickup: ride.pickup_address,
      drop: ride.drop_address,
      driverName: ride.driver_name,
    }));

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
