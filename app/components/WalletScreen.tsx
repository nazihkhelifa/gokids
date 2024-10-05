import IOSButton from "./IOSButton";

const PaymentMethod: React.FC<{ name: string; details?: string }> = ({
  name,
  details,
}) => (
  <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm mb-4">
    <div>
      <h3 className="font-semibold">{name}</h3>
      {details && <p className="text-sm text-gray-500">{details}</p>}
    </div>
    <span className="text-blue-500">›</span>
  </div>
);

const RidePackage: React.FC<{ rides: number; price: string }> = ({
  rides,
  price,
}) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
    <h3 className="font-semibold text-lg mb-2">{rides} Rides</h3>
    <p className="text-gray-600">Price</p>
    <p className="font-bold text-xl">{price}</p>
  </div>
);

export default function WalletScreen() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Wallet</h2>

      <h3 className="font-semibold text-lg mb-4">Ride Packages</h3>
      <RidePackage rides={10} price="₹500.00" />
      <RidePackage rides={25} price="₹1200.00" />

      <h3 className="font-semibold text-lg mt-8 mb-4">Payment methods</h3>
      <PaymentMethod name="Paytm" />
      <PaymentMethod name="Mastercard" details="**** 5981" />
      <PaymentMethod name="Cash" />

      <IOSButton onClick={() => {}} variant="secondary">
        Add payment method or redeem gift card
      </IOSButton>

      <h3 className="font-semibold text-lg mt-6 mb-4">Credits</h3>
      <PaymentMethod name="Uber Cash" />

      <IOSButton onClick={() => {}} className="mt-6">
        Proceed to Payment
      </IOSButton>
    </div>
  );
}
