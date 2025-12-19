import { getUserRole } from "../../lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const userRole = await getUserRole();

  const canSeeJobs = userRole === "admin" || userRole === "jobs" || userRole === "both";
  const canSeeCatering = userRole === "admin" || userRole === "catering" || userRole === "both";
  const canSeeUsers = userRole === "admin";

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canSeeJobs && (
          <Link
            href="/admin/jobs"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Applications</h2>
            <p className="text-gray-600">View and manage job applications</p>
          </Link>
        )}

        {canSeeCatering && (
          <Link
            href="/admin/catering"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Catering Requests</h2>
            <p className="text-gray-600">View and manage catering requests</p>
          </Link>
        )}

        {canSeeUsers && (
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
            <p className="text-gray-600">Manage admin users and roles</p>
          </Link>
        )}
      </div>
    </div>
  );
}

