"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FaHome, FaCar, FaCreditCard } from 'react-icons/fa';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface User {
  user_id: number;
  user_name: string;
  available_rides: number;
}

interface RidePackage {
  name: string;
  rides: number;
  price: string;
}

const RidePackageSelector: React.FC<{
  packages: RidePackage[];
  selectedPackage: RidePackage | null;
  onSelect: (packageName: RidePackage) => void;
}> = ({ packages, selectedPackage, onSelect }) => {
  return (
    <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between mb-2">
        <span className="font-bold">Economy</span>
        <span className="font-bold">Premium</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedPackage?.name === pkg.name
                ? 'bg-black text-white'
                : 'bg-white hover:bg-gray-200'
            }`}
            onClick={() => onSelect(pkg)}
          >
            <div className="flex items-center justify-between mb-2">
              <FaCar className={`text-2xl ${selectedPackage?.name === pkg.name ? 'text-white' : 'text-gray-600'}`} />
              <span className="text-xs font-semibold">{pkg.rides} rides</span>
            </div>
            <div className="text-lg font-bold">{pkg.name}</div>
            <div className="text-sm">${pkg.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentMethodInput: React.FC = () => {
  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-800 font-bold">Payment</span>
        <FaCreditCard className="text-gray-600" />
      </div>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-gray-600 text-sm">Change</span>
        <span className="text-gray-800 text-sm">↑↓</span>
      </div>
    </div>
  );
};

const CheckoutForm: React.FC<{
  selectedPackage: RidePackage | null;
  clientSecret: string | null;
  userId: number;
  currentRides: number;
  onPaymentComplete: () => void;
  onProcessingChange: (isProcessing: boolean) => void;
}> = ({ selectedPackage, clientSecret, userId, currentRides, onPaymentComplete, onProcessingChange }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!stripe || !elements || !clientSecret || !selectedPackage) {
      return;
    }

    onProcessingChange(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message || "Payment failed");
      onProcessingChange(false);
    } else if (paymentIntent?.status === "succeeded") {
      try {
        const newAvailableRides = currentRides + selectedPackage.rides;
        const response = await fetch("/api/updateRides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            newAvailableRides,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update available rides.");
        }

        onPaymentComplete();
        router.push("/wallet/success");
      } catch (error) {
        console.error("Error updating available rides:", error);
        setError("Payment succeeded, but failed to update available rides.");
      }
    }
    onProcessingChange(false);
  };

  return (
    <div>
      <PaymentMethodInput />
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      <button onClick={handleSubmit} className="hidden">Pay</button>
    </div>
  );
};

export default function Wallet() {
  const [selectedPackage, setSelectedPackage] = useState<RidePackage | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const ridePackages: RidePackage[] = [
    { name: 'Go Pool', rides: 10, price: '4.00' },
    { name: 'GoX', rides: 25, price: '5.10' },
    { name: 'Go SELECT', rides: 50, price: '7.50' },
    { name: 'Go BLACK', rides: 100, price: '8.50' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError("Error fetching user data. Please try again later.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (selectedPackage) {
        try {
          const amount = Math.round(parseFloat(selectedPackage.price) * 100);
          console.log(`Creating payment intent for ${selectedPackage.name} with amount: ${amount}`);
          const response = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
          });
          const data = await response.json();
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error("No client secret received");
          }
        } catch (error) {
          console.error("Error creating payment intent:", error);
          setError(`Failed to initiate payment for ${selectedPackage.name}. Please try again.`);
        }
      }
    };

    createPaymentIntent();
  }, [selectedPackage]);

  const handlePackageSelect = (pkg: RidePackage) => {
    console.log(`Selected package: ${pkg.name} with price: ${pkg.price}`);
    setSelectedPackage(pkg);
    setError(null);
  };

  const handlePaymentComplete = () => {
    setSelectedPackage(null);
    setClientSecret(null);
    fetchUserData();
  };

  const handlePayButtonClick = () => {
    if (selectedPackage) {
      const payButton = document.querySelector('button.hidden') as HTMLButtonElement;
      if (payButton) {
        payButton.click();
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  if (loading) return <div className="p-6 text-center font-semibold text-gray-600">Loading user data...</div>;
  if (error) return <div className="p-6 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="p-6 bg-white min-h-screen font-sans pb-24">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Wallet</h1>
      {userData && (
        <div className="bg-gradient-to-r from-gray-700 to-black p-6 rounded-3xl mb-8 shadow-lg text-white">
          <p className="font-semibold text-lg">Current Available Rides</p>
          <p className="text-4xl font-bold mt-2">{userData.available_rides}</p>
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Select a Ride Package</h2>
      <RidePackageSelector
        packages={ridePackages}
        selectedPackage={selectedPackage}
        onSelect={handlePackageSelect}
      />
      
      {selectedPackage && clientSecret && userData && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            selectedPackage={selectedPackage}
            clientSecret={clientSecret}
            userId={userData.user_id}
            currentRides={userData.available_rides}
            onPaymentComplete={handlePaymentComplete}
            onProcessingChange={setProcessing}
          />
        </Elements>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center space-x-3 bg-black p-2 rounded-full shadow-lg">
          <Link href="/" className="bg-black p-4 rounded-full flex items-center justify-center" style={{ width: '55px', height: '55px' }}>
            <FaHome className="text-white text-xl" />
          </Link>
          <button
            onClick={handlePayButtonClick}
            disabled={!selectedPackage || processing}
            className={`bg-yellow-600 text-white rounded-full font-bold px-8 py-4 transition-all duration-300 ${
              !selectedPackage || processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-800'
            }`}
          >
            {processing ? 'Processing...' : `Pay $${selectedPackage?.price || '0.00'}`}
          </button>
        </div>
      </div>
    </div>
  );
}