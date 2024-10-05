"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaHome,
  FaSchool,
  FaCalendarAlt,
  FaClock,
  FaCar,
} from "react-icons/fa";

interface Vehicle {
  id: string;
  name: string;
  seats: number;
  price: string;
  driver: {
    id: string;
    name: string;
    rating: number;
    bio: string;
  };
}

interface User {
  user_id: number;
  user_name: string;
  user_age: number;
  user_child_name: string;
  user_child_age: number;
  user_home_address: string;
  user_child_class_address: string;
  user_note: number;
  available_rides: number;
}

export default function Schedule() {
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayPickupTimes, setDayPickupTimes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [useAlternativeHomeAddress, setUseAlternativeHomeAddress] =
    useState<boolean>(false);
  const [alternativeHomeAddress, setAlternativeHomeAddress] =
    useState<string>("");
  const [useAlternativeClassAddress, setUseAlternativeClassAddress] =
    useState<boolean>(false);
  const [alternativeClassAddress, setAlternativeClassAddress] =
    useState<string>("");

  useEffect(() => {
    // Fetching user data
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUserData(data);
        console.log("User data:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetching vehicle data
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles");
        if (!res.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await res.json();
        setVehicles(data);
        console.log("Vehicles data:", data); // Debugging log
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchUserData();
    fetchVehicles();

    const data = localStorage.getItem("overviewData");
    if (data) {
      const parsedData = JSON.parse(data);

      if (parsedData.vehicle) {
        setSelectedVehicle(parsedData.vehicle.id);
      }

      setSelectedDays(parsedData.days || []);
      setDayPickupTimes(parsedData.pickupTimes || {});
    }
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

    // Initialize the pickup time for the day when selected
    if (!selectedDays.includes(day)) {
      setDayPickupTimes((prevTimes) => ({
        ...prevTimes,
        [day]: "17:30", // Default time
      }));
    } else {
      setDayPickupTimes((prevTimes) => {
        const newTimes = { ...prevTimes };
        delete newTimes[day]; // Remove the time if the day is deselected
        return newTimes;
      });
    }
  };

  const handlePickupTimeChange = (day: string, time: string) => {
    setDayPickupTimes((prevTimes) => ({
      ...prevTimes,
      [day]: time,
    }));
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const handleConfirm = () => {
    const selectedVehicleDetails = vehicles.find(
      (vehicle) => vehicle.id === selectedVehicle
    );
    console.log("Selected vehicle details:", selectedVehicleDetails); // Debugging log
    const overviewData = {
      vehicle: selectedVehicleDetails,
      days: selectedDays,
      pickupTimes: dayPickupTimes,
      address: {
        home: useAlternativeHomeAddress
          ? alternativeHomeAddress
          : userData?.user_home_address || "",
        class: useAlternativeClassAddress
          ? alternativeClassAddress
          : userData?.user_child_class_address || "",
      },
    };
    localStorage.setItem("overviewData", JSON.stringify(overviewData));
  };

  const isConfirmDisabled = !selectedVehicle || selectedDays.length === 0;

  return (
    <div className="p-6">
      {/* User ID Display */}
      <div className="mb-4">
        <p className="text-xl font-semibold">User: {userData?.user_name}</p>
      </div>

      {/* Address section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 flex items-center">
          <FaHome className="mr-2" /> Address
        </h2>
        <div className="bg-gray-100 p-3 rounded-lg mb-2">
          <p className="font-semibold">Home</p>
          <p className="text-sm text-gray-600">
            {useAlternativeHomeAddress ? (
              <input
                type="text"
                value={alternativeHomeAddress}
                onChange={(e) => setAlternativeHomeAddress(e.target.value)}
                placeholder="Enter alternative home address"
                className="bg-gray-100 p-2 rounded-lg w-full"
              />
            ) : (
              userData?.user_home_address
            )}
          </p>
        </div>
        <div className="flex items-center mt-2 mb-2">
          <input
            type="checkbox"
            checked={useAlternativeHomeAddress}
            onChange={(e) => setUseAlternativeHomeAddress(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Use an alternative home address</label>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="font-semibold">Class</p>
          <p className="text-sm text-gray-600">
            {useAlternativeClassAddress ? (
              <input
                type="text"
                value={alternativeClassAddress}
                onChange={(e) => setAlternativeClassAddress(e.target.value)}
                placeholder="Enter alternative class address"
                className="bg-gray-100 p-2 rounded-lg w-full"
              />
            ) : (
              userData?.user_child_class_address
            )}
          </p>
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={useAlternativeClassAddress}
            onChange={(e) => setUseAlternativeClassAddress(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Use an alternative class address</label>
        </div>
      </div>

      {/* Frequency section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 flex items-center">
          <FaCalendarAlt className="mr-2" /> Frequency
        </h2>
        <div className="flex justify-between">
          {["M", "T", "W", "T1", "F", "S", "S1"].map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`w-10 h-10 rounded-full ${
                selectedDays.includes(day)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {day.charAt(0)}
            </button>
          ))}
        </div>
      </div>

      {/* Pickup Time section */}
      {selectedDays.map((day) => (
        <div key={day} className="mb-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <FaClock className="mr-2" /> Pickup Time for {day.charAt(0)}
          </h3>
          <div className="bg-gray-100 p-3 rounded-lg">
            <input
              type="time"
              value={dayPickupTimes[day]}
              onChange={(e) => handlePickupTimeChange(day, e.target.value)}
              className="bg-transparent w-full"
            />
          </div>
        </div>
      ))}

      {/* Vehicle section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 flex items-center">
          <FaCar className="mr-2" /> Vehicle
        </h2>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`p-3 rounded-lg mb-2 ${
              selectedVehicle === vehicle.id
                ? "bg-blue-100 border border-blue-500"
                : "bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{vehicle.name}</p>
                <p className="text-sm text-gray-600">
                  {vehicle.seats} seats - {vehicle.price}
                </p>
              </div>
              <button
                onClick={() => handleVehicleSelect(vehicle.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              >
                Select
              </button>
            </div>
            <Link
              href={`/driver/${vehicle.driver.id}`}
              className="text-blue-500 text-sm underline"
            >
              View Driver Details
            </Link>
          </div>
        ))}
      </div>

      <Link href="/overview">
        <button
          onClick={handleConfirm}
          className={`block w-full text-white text-center py-2 rounded-lg ${
            isConfirmDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
          }`}
          disabled={isConfirmDisabled}
        >
          {selectedVehicle
            ? `Confirm ${vehicles.find((v) => v.id === selectedVehicle)?.name}`
            : "Select a vehicle"}
        </button>
      </Link>
    </div>
  );
}
