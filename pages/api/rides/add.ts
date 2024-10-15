import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

interface DateSelection {
  date: string;
  pickupTimes: {
    morning: string | null;
    afternoon: string | null;
  };
}

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
    dates,
    pickupAddress,
    dropAddress,
    driverName,
    totalRides,
  } = req.body;

  if (
    !userId ||
    !vehicleName ||
    !seats ||
    !price ||
    !dates ||
    !pickupAddress ||
    !dropAddress ||
    !driverName ||
    !totalRides
  ) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const formattedDates = dates.map((dateSelection: DateSelection) => ({
      date: new Date(dateSelection.date).toISOString().split('T')[0],
      morning: dateSelection.pickupTimes.morning,
      afternoon: dateSelection.pickupTimes.afternoon,
    }));

    const result = await query(`
      INSERT INTO ride
      (user_id, vehicle_name, seats, price, dates, pickup_address, drop_address, driver_name, total_rides)
      VALUES 
      (${userId}, '${vehicleName}',${seats},${price},'${JSON.stringify(formattedDates)}','${pickupAddress}','${dropAddress}','${driverName}',${totalRides})
    `);

    res.status(201).json({ message: "Ride added successfully" });
  } catch (error) {
    console.error("Error adding ride:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}