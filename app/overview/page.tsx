"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHome, FaSchool, FaCalendarAlt, FaClock, FaCar, FaUser, FaChevronLeft } from "react-icons/fa";

interface PickupTimes {
  morning: string | null;
  afternoon: string | null;
}

interface DateSelection {
  date: Date;
  pickupTimes: PickupTimes;
}

interface OverviewData {
  vehicle: {
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
  };
  dates: DateSelection[];
  address: {
    home: string;
    class: string;
  };
  totalRides: number;
}

export default function Overview() {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [availableRides, setAvailableRides] = useState<number>(0);
  const router = useRouter();
  const userId = 1; // This should come from your authentication system or context

  useEffect(() => {
    const data = localStorage.getItem("overviewData");
    if (data) {
      setOverviewData(JSON.parse(data));
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await res.json();
        setAvailableRides(userData.available_rides);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProceedToPayment = async () => {
    if (!overviewData) {
      console.error("No overview data available to proceed to payment.");
      return;
    }

    const requiredRides = overviewData.totalRides;

    if (availableRides >= requiredRides) {
      const newAvailableRides = availableRides - requiredRides;

      try {
        const res = await fetch("/api/updateRides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            newAvailableRides,
          }),
        });

        if (!res.ok) {
          throw new Error(
            `Failed to update available rides: ${res.statusText}`
          );
        }

        const addRideRes = await fetch("/api/rides/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            vehicleName: overviewData.vehicle.name,
            seats: overviewData.vehicle.seats,
            price: parseFloat(overviewData.vehicle.price.replace("€", "")),
            dates: overviewData.dates,
            pickupAddress: overviewData.address.home,
            dropAddress: overviewData.address.class,
            driverName: overviewData.vehicle.driver.name,
            totalRides: overviewData.totalRides,
          }),
        });

        if (!addRideRes.ok) {
          throw new Error(`Failed to add ride: ${addRideRes.statusText}`);
        }

        router.push("/history");
      } catch (error) {
        console.error("Error updating available rides:", error);
        alert("There was an error processing your payment. Please try again.");
      }
    } else {
      alert(
        "You don't have enough available rides. Redirecting to wallet to purchase more."
      );
      router.push("/wallet");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (!overviewData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 pb-24">
      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold flex items-center">
          <FaCar className="mr-2" /> {overviewData.vehicle.name}
        </h2>
        <p>{overviewData.vehicle.seats} seats</p>
        <p className="font-bold">{overviewData.vehicle.price}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Trip Details</h2>
        <p className="flex items-center">
          <FaHome className="mr-2" />
          <strong>Pickup:</strong> {overviewData.address.home}
        </p>
        <p className="flex items-center">
          <FaSchool className="mr-2" />
          <strong>Drop:</strong> {overviewData.address.class}
        </p>
        <div className="flex items-start">
          <FaClock className="mr-2 mt-1" />
          <div>
            <strong>Time:</strong>
            {overviewData.dates.map((dateSelection) => (
              <p key={dateSelection.date.toString()}>
                {formatDate(dateSelection.date)}: 
                {dateSelection.pickupTimes.morning && `Morning: ${dateSelection.pickupTimes.morning}`}
                {dateSelection.pickupTimes.morning && dateSelection.pickupTimes.afternoon && ', '}
                {dateSelection.pickupTimes.afternoon && `Afternoon: ${dateSelection.pickupTimes.afternoon}`}
              </p>
            ))}
          </div>
        </div>
        <p className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          <strong>Dates:</strong> {overviewData.dates.map(d => formatDate(d.date)).join(", ")}
        </p>
        <p className="flex items-center">
          <FaUser className="mr-2" />
          <strong>Driver:</strong> {overviewData.vehicle.driver.name}
        </p>
        <p className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          <strong>Total Rides:</strong> {overviewData.totalRides}
        </p>
      </div>
      <Link
        href={`/driver/${overviewData.vehicle.driver.id}`}
        className="block w-full bg-gray-300 text-center py-2 rounded-lg mb-2"
      >
        View Driver Details
      </Link>

      {/* New Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center space-x-3">
          <Link 
            href="/schedule"
            className="bg-black p-4 rounded-full flex items-center justify-center" 
            style={{ width: '55px', height: '55px' }}
          >
            <FaChevronLeft className="text-white text-xl" />
          </Link>
          <button 
            onClick={handleProceedToPayment}
            className="bg-black rounded-full text-white font-bold flex items-center justify-between px-4"
            style={{ width: '280px', height: '55px' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <span className="text-lg">
                Confirm ({overviewData.totalRides} ride{overviewData.totalRides > 1 ? 's' : ''})
              </span>
            </div>
            <span className="absolute right-4 text-xl">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}