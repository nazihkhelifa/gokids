
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Define the User interface
interface User {
  user_id: number;
  user_name: string;
  available_rides: number;
}

// RidePackage component
const RidePackage: React.FC<{
  rides: number;
  price: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ rides, price, selected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-6 rounded-3xl shadow-lg mb-4 cursor-pointer transition-all duration-300 ${
      selected ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' : 'bg-white text-gray-800'
    } flex justify-between items-center`}
  >
    <div>
      <h3 className="font-semibold text-lg">{rides} Rides</h3>
      <p className="font-bold text-3xl mt-2">{price}</p>
    </div>
    {selected && (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
);

// CheckoutForm component
const CheckoutForm: React.FC<{
  selectedPackage: number;
  clientSecret: string;
  userId: number;
  currentRides: number;
}> = ({ selectedPackage, clientSecret, userId, currentRides }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    // Confirm the payment using the client secret
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message || "Payment failed");
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      setPaymentSuccess(true);

      // Update the user's available rides after successful payment
      try {
        const newAvailableRides = currentRides + selectedPackage;
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

        // After updating the rides, navigate to the success page
        router.push("/wallet/success");
      } catch (error) {
        console.error("Error updating available rides:", error);
        setError("Payment succeeded, but failed to update available rides.");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="bg-gray-100 p-4 rounded-xl mb-4">
        <CardElement className="p-2" />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-full font-semibold text-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
      >
        {processing ? 'Processing...' : 'Pay'}
      </button>
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      {paymentSuccess && <div className="mt-4 text-green-500 text-center">Payment successful!</div>}
    </form>
  );
};

// Main Wallet component
export default function Wallet() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [proceedToPayment, setProceedToPayment] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
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

  const handleProceedToPayment = async () => {
    if (selectedPackage !== null) {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: selectedPackage * 100, // The amount must be in cents
          }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center font-semibold text-gray-600">Loading user data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Wallet</h1>
      {userData && (
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-3xl mb-8 shadow-lg text-white">
          <p className="font-semibold text-lg">Current Available Rides</p>
          <p className="text-4xl font-bold mt-2">
            {userData.available_rides}
          </p>
        </div>
      )}
      {!proceedToPayment ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Select a Ride Package
          </h2>
          <RidePackage
            rides={10}
            price="50.00 €"
            selected={selectedPackage === 10}
            onSelect={() => setSelectedPackage(10)}
          />
          <RidePackage
            rides={25}
            price="80.00 €"
            selected={selectedPackage === 25}
            onSelect={() => setSelectedPackage(25)}
          />

          <button
            onClick={() => {
              setProceedToPayment(true);
              handleProceedToPayment();
            }}
            className={`w-full py-4 rounded-full mt-8 text-lg font-semibold transition-all duration-300 ${
              selectedPackage === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800'
            }`}
            disabled={selectedPackage === null}
          >
            Go to Payment
          </button>
        </>
      ) : (
        <>
          {clientSecret && stripePromise && userData && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                selectedPackage={selectedPackage!}
                clientSecret={clientSecret}
                userId={userData.user_id}
                currentRides={userData.available_rides}
              />
            </Elements>
          )}
        </>
      )}
    </div>
  );
}