import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { hash } from 'bcryptjs';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Checking if the user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: 'User already exists' }),
        { status: 400 }
      );
    }

    // Hashing the password before storing
    const hashedPassword = await hash(password, 12);

    // Creating the user in Sanity
    const user = await client.create({
      _type: 'user',
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
