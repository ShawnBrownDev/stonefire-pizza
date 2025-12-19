import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

/**
 * User authentication for admin dashboard
 * Uses secure HTTP-only cookies for session management
 * Stores user email in session and fetches role from Convex
 */

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(convexUrl);

/**
 * Create session with user email
 */
export async function login(email: string): Promise<boolean> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
  return true;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return !!session?.value;
}

/**
 * Get authenticated user email from session
 */
export async function getAuthenticatedEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value || null;
}

/**
 * Logout and clear session
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

/**
 * Get user role from session
 * Fetches the user from Convex based on email stored in session
 */
export async function getUserRole(): Promise<"admin" | "jobs" | "catering" | "both" | null> {
  const email = await getAuthenticatedEmail();
  if (!email) {
    return null;
  }
  
  try {
    const user = await convex.query(api.admin.getUserByEmail, { email });
    return user?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

