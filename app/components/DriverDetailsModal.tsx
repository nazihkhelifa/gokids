interface DriverDetailsModalProps {
  driver: {
    name: string;
    rating: number;
    bio: string;
  };
  onClose: () => void;
}

export default function DriverDetailsModal({
  driver,
  onClose,
}: DriverDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{driver.name}</h2>
        <p className="mb-2">Rating: {driver.rating} ⭐</p>
        <p className="mb-4">{driver.bio}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
