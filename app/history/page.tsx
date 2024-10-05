"use client";

import { useEffect, useState } from "react";
import {
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

export default function RideHistory() {
  const [scheduledRides, setScheduledRides] = useState<any[]>([]);
  const userId = 1; // Replace with dynamic user ID from your authentication system

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`/api/rides/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch rides");
        }
        const ridesData = await res.json();
        setScheduledRides(ridesData);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, [userId]);

  if (scheduledRides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600">No scheduled rides available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Scheduled Rides</h2>
      {scheduledRides.map((ride, index) => (
        <div
          key={index}
          className="bg-blue-500 text-white p-6 rounded-2xl mb-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-2">{ride.vehicle_name}</h2>
          <p className="text-blue-100 mb-4">
            {ride.seats} seats • {ride.price}
          </p>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Trip Details</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span className="font-semibold mr-2">Pickup:</span>{" "}
                {ride.pickup_address}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span className="font-semibold mr-2">Drop:</span>{" "}
                {ride.drop_address}
              </p>
              <p className="flex items-center">
                <FaClock className="mr-2" />
                <span className="font-semibold mr-2">Time:</span>
                {Object.entries(ride.pickup_times).map(([day, time]) => (
                  <span key={day} className="inline-block mr-2">
                    {day}: {time}
                  </span>
                ))}
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span className="font-semibold mr-2">Days:</span>{" "}
                {ride.days.join(", ")}
              </p>
              <p className="flex items-center">
                <FaUser className="mr-2" />
                <span className="font-semibold mr-2">Driver:</span>{" "}
                {ride.driver_name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
