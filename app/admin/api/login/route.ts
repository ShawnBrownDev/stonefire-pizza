import { login } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(convexUrl);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify credentials with Convex
    let user;
    try {
      console.log("Attempting to verify credentials for:", email);
      user = await convex.query(api.admin.verifyUserCredentials, {
        email,
        password,
      });
      console.log("Verification result:", user ? "User found" : "User not found or invalid credentials");
    } catch (queryError) {
      console.error("Convex query error:", queryError);
      return NextResponse.json(
        { error: "Authentication service error. Please try again." },
        { status: 500 }
      );
    }

    if (!user) {
      // Check if user exists but has no password
      const userExists = await convex.query(api.admin.getUserByEmail, { email });
      if (userExists && !userExists.passwordHash) {
        return NextResponse.json(
          { error: "This user account has no password set. Please contact an administrator." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session with user email
    const success = await login(email);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

