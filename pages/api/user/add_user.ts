import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from "@neondatabase/serverless";
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Get Clerk user data
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user details from Clerk
    const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());

    // Extract Clerk-provided data
    const user_name = `${clerkUser.first_name} ${clerkUser.last_name}`;
    const user_email = clerkUser.email_addresses[0].email_address;
    const clerk_id = clerkUser.id;

    // Extract other data from request body
    const {
      user_age,
      user_child_name,
      user_child_age,
      user_home_address,
      user_child_class_address,
      user_note,
      available_rides,
      since,
      image_url
    } = req.body;

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE clerk_id = ${clerk_id}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Insert new user
    const response = await sql`
      INSERT INTO users (
        user_name,
        user_email,
        clerk_id
      )
      VALUES (
        ${user_name},
        ${user_email},
        ${clerk_id}
      )
      RETURNING *;
    `;

    return res.status(201).json({ data: response[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}