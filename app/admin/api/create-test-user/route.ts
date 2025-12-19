import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(convexUrl);

/**
 * Simple endpoint to create a test user
 * GET /admin/api/create-test-user?email=test@example.com&password=yourpassword&role=admin
 * Note: All parameters are required for security
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");
    const role = searchParams.get("role") as "admin" | "jobs" | "catering" | "both" | null;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required parameters",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    const userRole = role || "admin";

    // Call the createUser mutation
    await convex.mutation(api.admin.createUser, {
      email,
      password,
      role: userRole,
    });

    return NextResponse.json({
      success: true,
      message: `Test user created successfully!`,
      credentials: {
        email,
        password: "[hidden]",
        role: userRole,
      },
      loginUrl: "/admin/login",
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create test user",
      },
      { status: 500 }
    );
  }
}

