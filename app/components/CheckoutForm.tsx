// components/CheckoutForm.tsx
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export const CheckoutForm: React.FC<{ selectedPackage: number }> = ({
  selectedPackage,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

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

    const { error, paymentIntent } = await stripe.confirmCardPayment(
        stripePromise 
      {
        payment_method: {
          card: cardElement,
        },
      }
   
