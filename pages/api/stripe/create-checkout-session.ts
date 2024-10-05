import type { NextApiRequest, NextApiResponse } from "next";

// Dynamically load Stripe when needed
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { packageId, userId } = req.body;

  if (!packageId || !userId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const packageDetails = {
    10: { price: 50 * 100, description: "10 Rides Package" }, // €50 for 10 rides
    25: { price: 80 * 100, description: "25 Rides Package" }, // €80 for 25 rides
  };

  if (!packageDetails[packageId]) {
    return res.status(400).json({ message: "Invalid package selected" });
  }

  const selectedPackage = packageDetails[packageId];

  try {
    // Create Checkout Session using Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: selectedPackage.description,
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/wallet/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}&packageId=${packageId}`,
      cancel_url: `${req.headers.origin}/wallet`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
