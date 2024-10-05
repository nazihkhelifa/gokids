"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaComment,
  FaChevronUp,
  FaChevronDown,
  FaTachometerAlt,
} from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

interface Driver {
  id: string;
  name: string;
  rating: number;
  bio: string;
  image: string;
}

export default function TrackPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [eta, setEta] = useState("10 minutes to the class");
  const [speed, setSpeed] = useState(30);
  const [isDriverInfoVisible, setIsDriverInfoVisible] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const customIcon = new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(
      renderToStaticMarkup(<FaMapMarkerAlt style={{ color: "#007AFF" }} />)
    )}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
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
        setDriver(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDriverData();

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!userLocation || !driver) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Driver not found
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative bg-gray-100">
      {/* Map container - bottommost layer */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={userLocation}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={userLocation} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Content overlay - middle layer */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="flex-grow flex flex-col justify-between p-4">
          {/* Top section with speed info - now in top right corner */}
          <div className="pointer-events-auto self-end">
            <div className="bg-white p-3 rounded-2xl shadow-md flex items-center space-x-2">
              <FaTachometerAlt className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Speed</p>
                <p className="text-lg font-semibold">{speed} km/h</p>
              </div>
            </div>
          </div>

          {/* Bottom section with ETA and driver info */}
          <div className="pointer-events-auto">
            <div className="bg-white shadow-md rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold flex items-center text-gray-800">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" /> Live
                  Location
                </p>
                <p className="text-lg font-semibold text-gray-700">{eta}</p>
              </div>
              <button
                onClick={() => setIsDriverInfoVisible(!isDriverInfoVisible)}
                className="w-full py-3 px-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="font-semibold text-gray-800">
                  Driver Details
                </span>
                {isDriverInfoVisible ? (
                  <FaChevronDown className="text-gray-600" />
                ) : (
                  <FaChevronUp className="text-gray-600" />
                )}
              </button>
              {isDriverInfoVisible && (
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center mb-4">
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold">{driver.name}</h2>
                      <div className="text-yellow-400">
                        {"★".repeat(Math.round(driver.rating))}
                        <span className="text-gray-400">
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
                  <p className="text-sm text-gray-600 mb-4">{driver.bio}</p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl flex items-center justify-center transition-colors duration-150">
                      <FaPhoneAlt className="w-4 h-4 mr-2" />
                      Contact Driver
                    </button>
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl flex items-center justify-center transition-colors duration-150">
                      <FaComment className="w-4 h-4 mr-2" />
                      Send a Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
