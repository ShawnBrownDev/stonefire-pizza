"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

type UserRole = "admin" | "jobs" | "catering" | "both" | null;

interface AdminNavbarProps {
  userRole: UserRole;
}

export default function AdminNavbar({ userRole }: AdminNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine which links to show based on role
  const canSeeJobs = userRole === "admin" || userRole === "jobs" || userRole === "both";
  const canSeeCatering = userRole === "admin" || userRole === "catering" || userRole === "both";
  const canSeeUsers = userRole === "admin";

  const isActive = (path: string) => pathname === path;

  const NavLinks = () => (
    <>
      <Link
        href="/admin"
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
          isActive("/admin")
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <span className="mr-3 text-gray-400">📊</span>
        Dashboard
      </Link>
      
      {canSeeJobs && (
        <Link
          href="/admin/jobs"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isActive("/admin/jobs")
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="mr-3 text-gray-400">💼</span>
          Job Applications
        </Link>
      )}
      
      {canSeeCatering && (
        <Link
          href="/admin/catering"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isActive("/admin/catering")
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="mr-3 text-gray-400">🍽️</span>
          Catering Requests
        </Link>
      )}
      
      {canSeeUsers && (
        <>
          <Link
            href="/admin/users"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive("/admin/users")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-3 text-gray-400">👥</span>
            User Management
          </Link>
          
          <Link
            href="/admin/locations"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive("/admin/locations")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-3 text-gray-400">📍</span>
            Locations
          </Link>
          
          <Link
            href="/admin/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive("/admin/settings")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-3 text-gray-400">⚙️</span>
            Settings
          </Link>
          
          <Link
            href="/admin/jobs/form"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive("/admin/jobs/form")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-3 text-gray-400">📝</span>
            Form Configuration
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50 flex items-center justify-between px-4">
        <Link href="/admin" className="text-lg font-bold text-gray-900">
          Admin
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NavLinks()}
        </nav>
        <div className="px-4 py-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col z-50 hidden lg:flex">
      {/* Logo/Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <Link
          href="/admin"
          className="block"
        >
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Stonefire Pizza</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NavLinks()}
      </nav>

      {/* Footer with Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </aside>
    </>
  );
}

