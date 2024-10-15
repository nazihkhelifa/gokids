"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaHome,
  FaSchool,
  FaCalendarAlt,
  FaClock,
  FaCar,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUser,
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
  image_url: string;
  available_rides: number;
}

interface PickupTimes {
  morning: string | null;
  afternoon: string | null;
}

interface DateSelection {
  date: Date;
  pickupTimes: PickupTimes;
}

export default function Schedule() {
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateSelection[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [useAlternativeHomeAddress, setUseAlternativeHomeAddress] = useState<boolean>(false);
  const [alternativeHomeAddress, setAlternativeHomeAddress] = useState<string>("");
  const [useAlternativeClassAddress, setUseAlternativeClassAddress] = useState<boolean>(false);
  const [alternativeClassAddress, setAlternativeClassAddress] = useState<string>("");
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);

  const datePickerRef = useRef<HTMLDivElement>(null);

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
        console.log("Vehicles data:", data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchUserData();
    fetchVehicles();

    // Initialize visible dates
    const today = new Date();
    setVisibleDates(getDateRange(today, 14));
  }, []);

  const getDateRange = (startDate: Date, days: number) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  const scrollDates = (direction: 'left' | 'right') => {
    const firstDate = visibleDates[0];
    const lastDate = visibleDates[visibleDates.length - 1];
    const newDates = direction === 'left'
      ? getDateRange(new Date(firstDate.setDate(firstDate.getDate() - 7)), 14)
      : getDateRange(new Date(lastDate.setDate(lastDate.getDate() + 1)), 14);
    setVisibleDates(newDates);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDates((prevDates) => {
      const existingDateIndex = prevDates.findIndex(
        (d) => d.date.toDateString() === date.toDateString()
      );
      if (existingDateIndex > -1) {
        // If date is already selected, remove it
        return prevDates.filter((_, index) => index !== existingDateIndex);
      } else {
        // If date is not selected, add it
        return [...prevDates, { date, pickupTimes: { morning: null, afternoon: null } }];
      }
    });
  };

  const handlePickupTimeChange = (date: Date, period: 'morning' | 'afternoon', time: string | null) => {
    setSelectedDates((prevDates) => {
      return prevDates.map((d) => {
        if (d.date.toDateString() === date.toDateString()) {
          return {
            ...d,
            pickupTimes: {
              ...d.pickupTimes,
              [period]: time,
            },
          };
        }
        return d;
      });
    });
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const isConfirmDisabled = () => {
    return (
      selectedDates.length === 0 ||
      selectedDates.some((d) => !d.pickupTimes.morning && !d.pickupTimes.afternoon) ||
      !selectedVehicle
    );
  };

  const handleConfirm = () => {
    const selectedVehicleDetails = vehicles.find(
      (vehicle) => vehicle.id === selectedVehicle
    );
    console.log("Selected vehicle details:", selectedVehicleDetails);
    const totalRides = selectedDates.reduce((total, d) => {
      return total + (d.pickupTimes.morning ? 1 : 0) + (d.pickupTimes.afternoon ? 1 : 0);
    }, 0);
    const overviewData = {
      vehicle: selectedVehicleDetails,
      dates: selectedDates,
      address: {
        home: useAlternativeHomeAddress
          ? alternativeHomeAddress
          : userData?.user_home_address || "",
        class: useAlternativeClassAddress
          ? alternativeClassAddress
          : userData?.user_child_class_address || "",
      },
      totalRides: totalRides,
    };
    localStorage.setItem("overviewData", JSON.stringify(overviewData));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans text-gray-900 pb-24">
      {/* User ID Display */}
      <div className="mb-12 text-center flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schedule</h1>
          <p className="text-xl text-gray-500">Hello, {userData?.user_name}</p>
        </div>
        {userData?.image_url && (
          <img
            src={userData.image_url}
            alt={`${userData.user_name}'s profile`}
            className="w-12 h-12 rounded-full ml-4 border-2 border-gray-300"
          />
        )}
      </div>
  
      {/* Address section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FaHome className="mr-3 text-gray-400" /> Address
        </h2>
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <p className="font-semibold mb-2">Home</p>
          <p className="text-gray-600">
            {useAlternativeHomeAddress ? (
              <input
                type="text"
                value={alternativeHomeAddress}
                onChange={(e) => setAlternativeHomeAddress(e.target.value)}
                placeholder="Enter alternative home address"
                className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              userData?.user_home_address
            )}
          </p>
        </div>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={useAlternativeHomeAddress}
            onChange={(e) => setUseAlternativeHomeAddress(e.target.checked)}
            className="mr-3 form-checkbox h-5 w-5 text-blue-500 rounded-md"
          />
          <label className="text-gray-700">Use an alternative home address</label>
        </div>
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <p className="font-semibold mb-2">Class</p>
          <p className="text-gray-600">
            {useAlternativeClassAddress ? (
              <input
                type="text"
                value={alternativeClassAddress}
                onChange={(e) => setAlternativeClassAddress(e.target.value)}
                placeholder="Enter alternative class address"
                className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              userData?.user_child_class_address
            )}
          </p>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={useAlternativeClassAddress}
            onChange={(e) => setUseAlternativeClassAddress(e.target.checked)}
            className="mr-3 form-checkbox h-5 w-5 text-blue-500 rounded-md"
          />
          <label className="text-gray-700">Use an alternative class address</label>
        </div>
      </div>
  
      {/* Calendar View */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FaCalendarAlt className="mr-3 text-gray-400" /> Select Dates
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollDates('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>
          <div
            ref={datePickerRef}
            className="flex overflow-x-auto hide-scrollbar py-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {visibleDates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                className={`flex-shrink-0 w-20 h-20 mx-2 rounded-full flex flex-col items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  selectedDates.some((d) => d.date.toDateString() === date.toDateString())
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span>{date.getDate()}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollDates('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
  
      {/* Pickup Time section */}
      {selectedDates.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaClock className="mr-3 text-gray-400" /> Pickup Times
          </h2>
          {selectedDates.map((dateSelection) => (
            <div key={dateSelection.date.toISOString()} className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <h3 className="font-semibold text-lg mb-4">{formatDate(dateSelection.date)}</h3>
              <div className="mb-4">
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={dateSelection.pickupTimes.morning !== null}
                    onChange={() => handlePickupTimeChange(
                      dateSelection.date,
                      'morning',
                      dateSelection.pickupTimes.morning ? null : "07:30"
                    )}
                    className="mr-3 form-checkbox h-5 w-5 text-blue-500 rounded-md"
                  />
                  <span className="text-gray-700 font-medium">Morning Pickup</span>
                </label>
                {dateSelection.pickupTimes.morning !== null && (
                  <input
                    type="time"
                    value={dateSelection.pickupTimes.morning || "07:30"}
                    onChange={(e) => handlePickupTimeChange(dateSelection.date, 'morning', e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
              <div>
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={dateSelection.pickupTimes.afternoon !== null}
                    onChange={() => handlePickupTimeChange(
                      dateSelection.date,
                      'afternoon',
                      dateSelection.pickupTimes.afternoon ? null : "15:30"
                    )}
                    className="mr-3 form-checkbox h-5 w-5 text-blue-500 rounded-md"
                  />
                  <span className="text-gray-700 font-medium">Afternoon Pickup</span>
                </label>
                {dateSelection.pickupTimes.afternoon !== null && (
                  <input
                    type="time"
                    value={dateSelection.pickupTimes.afternoon || "15:30"}
                    onChange={(e) => handlePickupTimeChange(dateSelection.date, 'afternoon', e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* Vehicle section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FaCar className="mr-3 text-gray-400" /> Vehicle
        </h2>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`bg-white rounded-2xl p-6 mb-4 transition-all duration-200 ${
              selectedVehicle === vehicle.id
                ? "border-2 border-blue-500 shadow-md"
                : "hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold text-lg">{vehicle.name}</p>
                <p className="text-gray-500">
                  {vehicle.seats} seats - {vehicle.price}
                </p>
              </div>
              <button
                onClick={() => handleVehicleSelect(vehicle.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedVehicle === vehicle.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedVehicle === vehicle.id ? "Selected" : "Select"}
              </button>
            </div>
            <Link
              href={`/driver/${vehicle.driver.id}`}
              className="text-blue-500 text-sm hover:underline"
            >
              View Driver Details
            </Link>
          </div>
        ))}
      </div>
  
      {/* Confirmation section */}
      {isConfirmDisabled() && (
        <div className="mb-6 p-4 bg-yellow-100 rounded-lg flex items-center">
          <FaExclamationTriangle className="text-yellow-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            Please select at least one date with pickup times and a vehicle.
          </p>
        </div>
      )}
  
      {/* New Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center space-x-3">
          <Link 
            href="/account" 
            className="bg-black p-4 rounded-full flex items-center justify-center" 
            style={{ width: '55px', height: '55px' }}
          >
            <FaUser className="text-white text-xl" />
          </Link>
          <Link 
            href={isConfirmDisabled() ? "#" : "/overview"}
            onClick={isConfirmDisabled() ? undefined : handleConfirm}
            className={`bg-black rounded-full text-white font-bold flex items-center justify-between px-4 ${
              isConfirmDisabled() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ width: '280px', height: '55px' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <span className="text-lg">
                {isConfirmDisabled() ? "Complete all selections" : "Confirm Schedule"}
              </span>
            </div>
            <span className="absolute right-4 text-xl">&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}