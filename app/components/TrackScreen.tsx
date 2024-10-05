// File: app/components/TrackScreen.tsx
import IOSButton from "./IOSButton";

export default function TrackScreen() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Track</h2>
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <h3 className="font-semibold text-lg mb-2">Live Location</h3>
        <div className="bg-gray-200 h-64 rounded-xl mb-4 flex items-center justify-center">
          Map View
        </div>
        <p className="text-gray-600 mb-2">ETA: 10 minutes to class</p>
        <p className="text-gray-600">Speed: 30km/h</p>
      </div>
      <IOSButton onClick={() => {}}>Contact Driver</IOSButton>
      <IOSButton onClick={() => {}} variant="secondary" className="mt-4">
        Send a Message
      </IOSButton>
    </div>
  );
}
