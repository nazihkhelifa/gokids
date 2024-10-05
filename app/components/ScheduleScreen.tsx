"use client";

import React, { useState } from "react";
import Link from "next/link";

const AddressInput: React.FC<{ label: string; address: string }> = ({
  label,
  address,
}) => (
  <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{label}</h3>
        <p className="text-gray-500 text-sm">{address}</p>
      </div>
      <span className="text-blue-500">Edit</span>
    </div>
  </div>
);

const DaySelector: React.FC<{
  selectedDays: string[];
  onToggleDay: (day: string) => void;
}> = ({ selectedDays, onToggleDay }) => {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex justify-between mb-6">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onToggleDay(day)}
          className={`w-10 h-10 rounded-full ${
            selectedDays.includes(day)
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          } transition-colors duration-200`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

interface VehicleOptionProps {
  name: string;
  seats: number;
  price: string;
  selected: boolean;
  onSelect: () => void;
}

const VehicleOption: React.FC<VehicleOptionProps> = ({
  name,
  seats,
  price,
  selected,
  onSelect,
}) => (
  <div
    className={`mb-4 p-4 rounded-2xl shadow-sm ${
      selected ? "bg-blue-50 border border-blue-500" : "bg-white"
    } transition-colors duration-200`}
    onClick={onSelect}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{seats} seats</p>
      </div>
      <p className="font-semibold">{price}/month</p>
    </div>
  </div>
);

export default function ScheduleScreen() {
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "M",
    "T",
    "W",
    "T",
    "F",
  ]);
  const [dayPickupTimes, setDayPickupTimes] = useState<{
    [key: string]: string;
  }>({
    M: "17:30",
    T: "17:30",
    W: "17:30",
    T1: "17:30",
    F: "17:30",
  });
  const [selectedVehicle, setSelectedVehicle] = useState<string>("Uber Van");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handlePickupTimeChange = (day: string, time: string) => {
    setDayPickupTimes((prevTimes) => ({
      ...prevTimes,
      [day]: time,
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Schedule</h2>

      <AddressInput label="Home" address="A5/1104, The Lake District, Pune" />

      <AddressInput
        label="Class"
        address="D55, Gera Junction, Bibwewadi, Pune"
      />

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Frequency</h3>
        <DaySelector selectedDays={selectedDays} onToggleDay={toggleDay} />
      </div>

      {selectedDays.map((day) => (
        <div key={day} className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Pickup Time for {day}</h3>
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
            <input
              type="time"
              value={dayPickupTimes[day]}
              onChange={(e) => handlePickupTimeChange(day, e.target.value)}
              className="bg-transparent w-full"
            />
          </div>
        </div>
      ))}

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Vehicle</h3>
        <VehicleOption
          name="Uber Van"
          seats={6}
          price="₹2400.00"
          selected={selectedVehicle === "Uber Van"}
          onSelect={() => setSelectedVehicle("Uber Van")}
        />
        <VehicleOption
          name="UberAuto"
          seats={3}
          price="₹800.00"
          selected={selectedVehicle === "UberAuto"}
          onSelect={() => setSelectedVehicle("UberAuto")}
        />
      </div>

      <Link href="/overview">
        <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
          Confirm {selectedVehicle}
        </button>
      </Link>
    </div>
  );
}
