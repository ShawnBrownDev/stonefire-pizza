"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

type UserRole = "admin" | "jobs" | "catering" | "both" | null;

interface AdminNavbarProps {
  userRole: UserRole;
}

export default function AdminNavbar({ userRole }: AdminNavbarProps) {
  const pathname = usePathname();

  // Determine which links to show based on role
  const canSeeJobs = userRole === "admin" || userRole === "jobs" || userRole === "both";
  const canSeeCatering = userRole === "admin" || userRole === "catering" || userRole === "both";
  const canSeeUsers = userRole === "admin";

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/admin"
              className={`text-lg font-semibold ${
                isActive("/admin") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Admin Dashboard
            </Link>
            
            <div className="flex items-center space-x-4">
              {canSeeJobs && (
                <Link
                  href="/admin/jobs"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/jobs")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Jobs
                </Link>
              )}
              
              {canSeeCatering && (
                <Link
                  href="/admin/catering"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/catering")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Catering
                </Link>
              )}
              
              {canSeeUsers && (
                <Link
                  href="/admin/users"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/users")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Users
                </Link>
              )}
            </div>
          </div>
          
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

