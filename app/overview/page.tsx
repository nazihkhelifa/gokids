"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Overview() {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [availableRides, setAvailableRides] = useState<number>(0);
  const router = useRouter();
  const userId = 1; // This should come from your authentication system or context

  useEffect(() => {
    // Fetch the overview data from localStorage
    const data = localStorage.getItem("overviewData");
    if (data) {
      setOverviewData(JSON.parse(data));
    }

    // Fetch the user data, including available rides, from the API
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

    const requiredRides = overviewData.days.length;

    if (availableRides >= requiredRides) {
      const newAvailableRides = availableRides - requiredRides;

      try {
        // Update available rides in the backend
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

        // Add the ride to the rides table
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
            days: overviewData.days,
            pickupTimes: overviewData.pickupTimes,
            pickupAddress: overviewData.address.home,
            dropAddress: overviewData.address.class,
            driverName: overviewData.vehicle.driver.name,
          }),
        });

        if (!addRideRes.ok) {
          throw new Error(`Failed to add ride: ${addRideRes.statusText}`);
        }

        // Redirect to the ride history page
        router.push("/history");
      } catch (error) {
        console.error("Error updating available rides:", error);
        alert("There was an error processing your payment. Please try again.");
      }
    } else {
      // Redirect to wallet page to purchase more rides
      alert(
        "You don't have enough available rides. Redirecting to wallet to purchase more."
      );
      router.push("/wallet");
    }
  };

  if (!overviewData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold">{overviewData.vehicle.name}</h2>
        <p>{overviewData.vehicle.seats} seats</p>
        <p className="font-bold">{overviewData.vehicle.price}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Trip Details</h2>
        <p>
          <strong>Pickup:</strong> {overviewData.address.home}
        </p>
        <p>
          <strong>Drop:</strong> {overviewData.address.class}
        </p>
        <p>
          <strong>Time:</strong>{" "}
          {overviewData.days.map((day: string) => (
            <span key={day}>
              {day.charAt(0)}: {overviewData.pickupTimes[day]}{" "}
            </span>
          ))}
        </p>
        <p>
          <strong>Days:</strong>{" "}
          {overviewData.days.map((day: string) => day.charAt(0)).join(" ")}
        </p>
        <p>
          <strong>Driver:</strong> {overviewData.vehicle.driver.name}
        </p>
      </div>
      <Link
        href={`/driver/${overviewData.vehicle.driver.id}`}
        className="block w-full bg-gray-300 text-center py-2 rounded-lg mb-2"
      >
        View Driver Details
      </Link>
      <Link
        href="/schedule"
        className="block w-full bg-gray-500 text-white text-center py-2 rounded-lg mb-2"
      >
        Go Back to Edit
      </Link>
      <button
        onClick={handleProceedToPayment}
        className="block w-full bg-blue-500 text-white text-center py-2 rounded-lg"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
