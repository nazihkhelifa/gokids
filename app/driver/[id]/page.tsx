"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function RidePage() {
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

  if (error) {
    return <div className="p-6 text-red-600 text-center">Error: {error}</div>;
  }

  return (
    <div className="bg-white min-h-screen relative">
      {/* Header with circular back button */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition duration-300 ease-in-out z-10"
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold text-gray-800">Driver Details</h1>
        </div>
      </div>

      {/* Driver Details */}
      {!loading && (
        <div className="p-6">
          {/* Driver Info */}
          <div className="flex items-center mb-6">
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold text-gray-900">{driver.name}</h2>
              <div className="text-yellow-400">
                {"★".repeat(Math.round(driver.rating))}
                <span className="text-gray-300">
                  {"★".repeat(5 - Math.round(driver.rating))}
                </span>
              </div>
            </div>
            <Image
              src={driver.image}
              alt={driver.name}
              width={80}
              height={80}
              className="rounded-full shadow-md"
            />
          </div>

          {/* Driver Bio */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
            <p className="text-gray-600 leading-relaxed">{driver.bio}</p>
          </div>

          {/* Reviews Section */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Parent's Review</h3>

          {/* Reviews Scrollable Section */}
          <div className="overflow-x-auto whitespace-nowrap pb-6">
            <div className="inline-flex space-x-4">
              {driver.reviews.map((review: any, index: number) => (
                <div
                  key={index}
                  className="inline-block w-64 bg-black p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
                >
                  <div className="flex items-center mb-2">
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-2"
                    />
                    <div>
                      <p className="font-medium text-white">{review.name}</p>
                      <p className="text-xs text-gray-400">User Since: {review.since}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-normal break-words leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-50">
          <div className="mb-8 text-xl font-semibold">Loading</div>
          <div className="flex flex-col items-center mb-8">
            <div className="w-2 h-2 bg-gray-600 rounded-full mb-2"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full mb-2"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full mb-2"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="text-4xl font-bold">GoKids</div>
        </div>
      )}
    </div>
  );
}