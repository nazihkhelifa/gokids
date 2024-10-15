"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaComment,
  FaChevronUp,
  FaChevronDown,
  FaTachometerAlt,
  FaRoute,
  FaUser,
  FaHome,
} from "react-icons/fa";

import Map from "../components/Map";
import GoogleTextInput from "../components/GoogleTextInput";
import { useLocationStore } from "@/store";
import { icons } from "@/constants";

interface Driver {
  id: string;
  name: string;
  rating: number;
  bio: string;
  image: string;
  location: Location;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export default function TrackPage() {
  const { userLatitude, userLongitude, setUserLocation } = useLocationStore();
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [eta, setEta] = useState("Calculating...");
  const [speed, setSpeed] = useState(30);
  const [isDriverInfoVisible, setIsDriverInfoVisible] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Current Location",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * 10) + 25);
    }, 5000);

    // Fetch driver data
    const fetchDriverData = async () => {
      try {
        const driverId = 3; // Replace with actual driver ID when available
        const res = await fetch(`/api/drivers/${driverId}`);
        if (!res.ok) {
          throw new Error("Driver not found");
        }
        const data = await res.json();
        setDriver({
          ...data,
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address,
          },
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDriverData();

    return () => clearInterval(interval);
  }, []);

  const handleLocationSelect = (type: 'pickup' | 'destination') => (location: Location) => {
    if (type === 'pickup') {
      setPickupLocation(location);
    } else {
      setEndLocation(location);
    }
    setShowRoute(false);
  };

  const handleShowRoute = () => {
    if (pickupLocation && endLocation) {
      setShowRoute(true);
      // Update driver's location to the pickup location
      if (driver) {
        setDriver({
          ...driver,
          location: pickupLocation
        });
      }
      // Calculate and set ETA (this is a simplified example)
      const distance = calculateDistance(pickupLocation, endLocation);
      const estimatedTime = Math.round(distance / speed * 60);
      setEta(`Estimated arrival in ${estimatedTime} minutes`);
    } else {
      alert("Please select both pickup and destination locations.");
    }
  };

  // Simple distance calculation (this is not accurate for real-world use)
  const calculateDistance = (start: Location, end: Location) => {
    const R = 6371; // Earth's radius in km
    const dLat = (end.latitude - start.latitude) * Math.PI / 180;
    const dLon = (end.longitude - start.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(start.latitude * Math.PI / 180) * Math.cos(end.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 bg-black">
        <div className="animate-pulse text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 bg-black">
        <div className="text-white text-2xl">Error: {error}</div>
      </div>
    );
  }

  if (!userLatitude || !userLongitude || !driver) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 bg-black">
        <div className="text-white text-2xl">Driver not found</div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <div className="h-screen flex flex-col relative bg-black text-white">
        {/* Map container */}
        <div className="absolute inset-0 z-0">
          <Map 
            center={{ lat: userLatitude, lng: userLongitude }} 
            zoom={13}
            pickupLocation={pickupLocation ? { lat: pickupLocation.latitude, lng: pickupLocation.longitude } : undefined}
            endLocation={endLocation ? { lat: endLocation.latitude, lng: endLocation.longitude } : undefined}
            showRoute={showRoute}
            driverLocation={driver.location ? { lat: driver.location.latitude, lng: driver.location.longitude } : undefined}
          />
        </div>

        {/* Speed indicator container */}
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <div className="bg-black bg-opacity-70 p-3 rounded-full shadow-md flex items-center space-x-2">
            <FaTachometerAlt className="text-white" />
            <div>
              <p className="text-xs text-gray-300">Speed</p>
              <p className="text-lg font-semibold">{speed} km/h</p>
            </div>
          </div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          <div className="flex-grow flex flex-col justify-between p-4">
            {/* Top section with location inputs */}
            <div className="pointer-events-auto space-y-2">
            <GoogleTextInput
                icon={icons.search}
                containerStyle="bg-white bg-opacity-10 border border-gray-600 rounded-full"
                handlePress={handleLocationSelect('pickup')}
                placeholder="Enter pickup location"
              />
              <GoogleTextInput
                icon={icons.search}
                containerStyle="bg-white bg-opacity-10 border border-gray-600 rounded-full"
                handlePress={handleLocationSelect('destination')}
                placeholder="Enter destination"
              />
              <button
                onClick={handleShowRoute}
                className="w-full bg-white text-black py-3 px-4 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-gray-200"
              >
                <FaRoute className="w-4 h-4 mr-2" />
                Show Route
              </button>
            </div>
          </div>
        </div>

        {/* New Bottom Section with Driver Details, Live Location, and Navigation */}
        <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center z-30">
          {/* Driver Details and Live Location */}
          <div className="bg-black bg-opacity-70 rounded-t-3xl overflow-hidden mb-2" style={{ width: '340px' }}>
            <div className="p-4 border-b border-gray-700">
              <p className="text-sm font-semibold flex items-center text-gray-300">
                <FaMapMarkerAlt className="mr-2 text-white" /> Live Location
              </p>
              <p className="text-lg font-semibold text-white">{eta}</p>
            </div>
            <button
              onClick={() => setIsDriverInfoVisible(!isDriverInfoVisible)}
              className="w-full py-4 px-4 flex justify-between items-center bg-black bg-opacity-70 hover:bg-opacity-80 transition-colors duration-150"
            >
              <span className="font-semibold text-white">Driver Details</span>
              {isDriverInfoVisible ? (
                <FaChevronDown className="text-white" />
              ) : (
                <FaChevronUp className="text-white" />
              )}
            </button>
            {isDriverInfoVisible && (
              <div className="p-4 bg-black bg-opacity-70">
                <div className="flex items-center mb-4">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-white">{driver.name}</h2>
                    <div className="text-yellow-400">
                      {"★".repeat(Math.round(driver.rating))}
                      <span className="text-gray-600">
                        {"★".repeat(5 - Math.round(driver.rating))}
                      </span>
                    </div>
                  </div>
                  <Image
                    src={driver.image}
                    alt={driver.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-300 mb-4">{driver.bio}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white text-black py-3 px-4 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-gray-200">
                    <FaPhoneAlt className="w-4 h-4 mr-2" />
                    Contact Driver
                  </button>
                  <button className="flex-1 bg-white text-black py-3 px-4 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-gray-200">
                    <FaComment className="w-4 h-4 mr-2" />
                    Send a Message
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center space-x-3">
            <Link href="/account" className="bg-black p-4 rounded-full flex items-center justify-center" style={{ width: '55px', height: '55px' }}>
              <FaUser className="text-white text-xl" />
            </Link>
            <Link 
              href="/" 
              className="bg-black rounded-full text-white font-bold flex items-center justify-between px-4" 
              style={{ width: '280px', height: '55px' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-white rounded-sm"></div>
                <span className="text-lg">Home</span>
              </div>
              <span className="absolute right-4 text-xl">&gt;</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}