import { getUserRole } from "../lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const userRole = await getUserRole();

  const canSeeJobs = userRole === "admin" || userRole === "jobs" || userRole === "both";
  const canSeeCatering = userRole === "admin" || userRole === "catering" || userRole === "both";
  const canSeeUsers = userRole === "admin";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the admin dashboard. Manage your operations from here.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canSeeJobs && (
          <Link
            href="/admin/jobs"
            className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">💼</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
              Job Applications
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              View and manage incoming job applications from candidates
            </p>
            <div className="mt-4 text-sm text-blue-600 font-medium group-hover:text-blue-700">
              View all →
            </div>
          </Link>
        )}

        {canSeeCatering && (
          <Link
            href="/admin/catering"
            className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
              Catering Requests
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Review and process catering requests from customers
            </p>
            <div className="mt-4 text-sm text-blue-600 font-medium group-hover:text-blue-700">
              View all →
            </div>
          </Link>
        )}

        {canSeeUsers && (
          <Link
            href="/admin/users"
            className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
              User Management
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage admin users, roles, and access permissions
            </p>
            <div className="mt-4 text-sm text-blue-600 font-medium group-hover:text-blue-700">
              View all →
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

