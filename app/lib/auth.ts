import { cookies } from "next/headers";

/**
 * Simple password-based authentication for admin dashboard
 * Uses secure HTTP-only cookies for session management
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Default for dev
const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify admin password and create session
 */
export async function login(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
    });
    return true;
  }
  return false;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === "authenticated";
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
 * For now, we'll use a simple approach: check if authenticated
 * In a real app, you'd store the user email/role in the session
 * 
 * TODO: Enhance to store user email in session and fetch role from Convex
 */
export async function getUserRole(): Promise<"admin" | "jobs" | "catering" | "both" | null> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return null;
  }
  
  // For now, default to admin if authenticated
  // In production, you'd fetch the actual user role from Convex
  // based on the email stored in the session
  return "admin";
}

