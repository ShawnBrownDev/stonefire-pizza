import { redirect } from "next/navigation";
import { isAuthenticated } from "../../lib/auth";
import LoginForm from "./LoginForm";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export default async function AdminLoginPage() {
  // If already authenticated, redirect to admin dashboard
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/admin");
  }

  // Check if any users exist, if not redirect to setup
  if (convex) {
    try {
      // Check if the function exists in the API
      if (api.admin && "hasUsers" in api.admin) {
        const hasUsers = await convex.query(api.admin.hasUsers);
        if (!hasUsers) {
          redirect("/admin/setup");
        }
      }
    } catch {
      // If Convex is not configured or function doesn't exist, show login anyway
      // This can happen if Convex dev hasn't been run yet or functions aren't deployed
      // The setup page will handle checking if users exist
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600 text-sm">Sign in to access the admin dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

