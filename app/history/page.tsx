"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
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
  driver_image: string;
  total_rides: number;
  created_at: string;
  updated_at: string;
}

export default function RideHistory() {
  const [scheduledRides, setScheduledRides] = useState<Ride[]>([]);
  const [expandedRide, setExpandedRide] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'past' | 'upcoming'>('upcoming');

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
      return `$${price.toFixed(2)}`;
    }
    if (typeof price === 'string') {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        return `$${parsedPrice.toFixed(2)}`;
      }
      return price;
    }
    return 'Price not available';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const toggleRideDetails = (rideId: number) => {
    setExpandedRide(expandedRide === rideId ? null : rideId);
  };

  if (scheduledRides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <p className="text-xl">No scheduled rides available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6 text-black pb-24">
      <h2 className="text-2xl font-bold mb-6">My child trips</h2>
      {scheduledRides.map((ride) => (
        <div
          key={ride.id}
          className="bg-gray-100 p-4 rounded-xl mb-4 cursor-pointer"
          onClick={() => toggleRideDetails(ride.id)}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">{formatDate(ride.dates[0].date)}</div>
             {/* <div className="font-bold">{formatPrice(ride.price)}</div>*/}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-1">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                <span className="text-sm">{ride.pickup_address}</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                <span className="text-sm">{ride.drop_address}</span>
              </div>
            </div>
            <img
              src={ride.driver_image}
              alt={ride.driver_name}
              className="w-10 h-10 rounded-full"
            />
          </div>
          {expandedRide === ride.id && (
            <div className="mt-4 text-sm">
              <p className="mb-2">
                <FaUser className="inline mr-2" />
                Driver: {ride.driver_name}
              </p>
              <p className="mb-2">
                <FaClock className="inline mr-2" />
                Time: {ride.dates[0].morning || ride.dates[0].afternoon || 'Not specified'}
              </p>
              <p className="mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Total Rides: {ride.total_rides}
              </p>
              <p>Vehicle: {ride.vehicle_name} ({ride.seats} seats)</p>
            </div>
          )}
        </div>
      ))}

      {/* Centered Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center space-x-3">
          {/* Home button on the left */}
          <Link
            href="/"
            className="bg-black rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ width: '55px', height: '55px' }}
          >
            <FaHome className="text-white text-xl" />
          </Link>

          {/* Past and Upcoming buttons on the right */}
          <div className="bg-black rounded-full flex items-center space-x-2 px-4" style={{ height: '55px' }}>
            <button
              onClick={() => setViewMode('past')}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                viewMode === 'past' ? 'bg-white text-black' : 'text-white'
              }`}
            >
              <FaChevronLeft className="inline mr-1" />
              PAST
            </button>
            <button
              onClick={() => setViewMode('upcoming')}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                viewMode === 'upcoming' ? 'bg-white text-black' : 'text-white'
              }`}
            >
              UPCOMING
              <FaChevronRight className="inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}