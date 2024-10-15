"use client";

import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

interface DateSelection {
  date: string;
  morning: string | null;
  afternoon: string | null;
}

interface Ride {
  id: number;
  user_id: number;
  vehicle_name: string;
  seats: number;
  price: number | string;
  dates: DateSelection[];
  pickup_address: string;
  drop_address: string;
  driver_name: string;
  driver_image: string; // Add this field for driver image
  total_rides: number;
  created_at: string;
  updated_at: string;
}

export default function RideHistory() {
  const [scheduledRides, setScheduledRides] = useState<Ride[]>([]);
  const [expandedRide, setExpandedRide] = useState<number | null>(null); // Track which ride is expanded

  const userId = 1; // Replace with dynamic user ID from your authentication system

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`/api/rides/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch rides");
        }
        const ridesData: Ride[] = await res.json();
        setScheduledRides(ridesData);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, [userId]);

  const formatPrice = (price: number | string): string => {
    if (typeof price === 'number') {
      return `€${price.toFixed(2)}`;
    }
    if (typeof price === 'string') {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        return `€${parsedPrice.toFixed(2)}`;
      }
      return price;
    }
    return 'Price not available';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const toggleRideDetails = (rideId: number) => {
    setExpandedRide(expandedRide === rideId ? null : rideId); // Toggle the ride details
  };

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
      {scheduledRides.map((ride) => (
        <div
          key={ride.id}
          className="bg-blue-500 text-white p-6 rounded-2xl mb-6 shadow-lg cursor-pointer"
          onClick={() => toggleRideDetails(ride.id)} // Toggle details on click
        >
          <div className="flex items-center">
            {/* Driver's image */}
            <img
              src={ride.driver_image}
              alt={ride.driver_name}
              className="w-12 h-12 rounded-full mr-4" // Style for rounded image
            />
            <div className="flex-grow">
              {/* Driver's name */}
              <h2 className="text-2xl font-semibold">{ride.driver_name}</h2>
              {/* Dates on a separate line */}
              <p className="text-sm text-blue-200">{ride.dates.map(d => formatDate(d.date)).join(", ")}</p>
            </div>
          </div>

          {expandedRide === ride.id && ( // Show details if ride is expanded
            <div className="mt-4">
              <p className="text-blue-100 mb-4">
                {ride.seats} seats • {formatPrice(ride.price)}
              </p>
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
                <div className="flex items-start">
                  <FaClock className="mr-2 mt-1" />
                  <div>
                    <span className="font-semibold mr-2">Time:</span>
                    {ride.dates.map((dateSelection) => (
                      <p key={dateSelection.date}>
                        {formatDate(dateSelection.date)}:
                        {dateSelection.morning && ` Morning: ${dateSelection.morning}`}
                        {dateSelection.morning && dateSelection.afternoon && ','}
                        {dateSelection.afternoon && ` Afternoon: ${dateSelection.afternoon}`}
                        {!dateSelection.morning && !dateSelection.afternoon && ' No pickup times specified'}
                      </p>
                    ))}
                  </div>
                </div>
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span className="font-semibold mr-2">Total Rides:</span>{" "}
                  {ride.total_rides}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
