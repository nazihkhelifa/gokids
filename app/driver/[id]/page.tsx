"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function DriverDetails() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.id as string;

  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
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

    fetchDriverDetails();
  }, [driverId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }

  if (!driver) {
    return <div className="p-6">Driver not found</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-gray-600">
            &lt;
          </button>
          <h1 className="text-xl font-semibold text-red-500">GoKids Drivers</h1>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold">{driver.name}</h2>
            <div className="text-yellow-400">
              {"★".repeat(Math.round(driver.rating))}
              <span className="text-gray-400">
                {"★".repeat(5 - Math.round(driver.rating))}
              </span>
            </div>
          </div>
          <Image
            src={driver.image} // The driver's image URL
            alt={driver.name}
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Bio</h3>
          <p className="text-gray-600">{driver.bio}</p>
        </div>

        <h3 className="text-xl font-semibold mb-2">Parent's Review</h3>
      </div>

      <div className="overflow-x-auto whitespace-nowrap pb-6 px-6">
        <div className="inline-flex space-x-4">
          {driver.reviews.map((review: any, index: number) => (
            <div
              key={index}
              className="inline-block w-64 bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center mb-2">
                <Image
                  src={review.image} // Use the user's image URL
                  alt={review.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-2"
                />
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-gray-500">
                    User Since: {review.since}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-normal break-words">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
