import { redirect } from "next/navigation";
import { isAuthenticated, login } from "../../lib/auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  // If already authenticated, redirect to admin dashboard
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}

