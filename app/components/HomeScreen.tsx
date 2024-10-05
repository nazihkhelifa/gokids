// File: app/components/HomeScreen.tsx
import IOSButton from "./IOSButton";
import Link from "next/link";

export default function HomeScreen() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Home</h2>
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <h3 className="font-semibold text-lg mb-2">Current Ride</h3>
        <p className="text-gray-600">10 minutes to class</p>
      </div>
      <Link href="/track">
        <IOSButton onClick={() => {}}>Track Current Ride</IOSButton>
      </Link>
      <Link href="/schedule">
        <IOSButton onClick={() => {}} variant="secondary" className="mt-4">
          Schedule New Ride
        </IOSButton>
      </Link>
    </div>
  );
}
