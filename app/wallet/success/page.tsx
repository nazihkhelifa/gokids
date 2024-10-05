"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessOverlay() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/schedule");
    }, 2000); // 2 seconds delay before redirect

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-500 z-50">
      <h1 className="text-white text-3xl font-bold">Payment Successful</h1>
    </div>
  );
}
