// File: app/components/AccountScreen.tsx
import IOSButton from "./IOSButton";

const MenuItem: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200">
    <span>{name}</span>
    <span className="text-gray-400">›</span>
  </div>
);

export default function AccountScreen() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-blue-500 text-white p-6 rounded-2xl mb-8">
        <h2 className="text-3xl font-bold mb-2">Hello</h2>
        <p className="text-xl mb-1">Sourabh</p>
        <p className="mb-4">4.41 ★</p>
        <IOSButton onClick={() => {}}>Messages ›</IOSButton>
        <p className="mt-4">
          Booking a cab for yourself?
          <br />
          Open Uber App
        </p>
      </div>

      <nav className="mb-8">
        {["Home", "Wallet", "Help", "Settings", "Legal"].map((item) => (
          <MenuItem key={item} name={item} />
        ))}
      </nav>

      <IOSButton onClick={() => {}} variant="secondary">
        Logout
      </IOSButton>

      <p className="text-center text-gray-500 mt-8">v.3.433.10004</p>
    </div>
  );
}
