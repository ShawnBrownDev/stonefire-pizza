import { isAuthenticated, getUserRole } from "../lib/auth";
import AdminNavbar from "./components/AdminNavbar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login";
  const isSetupPage = pathname === "/admin/setup";
  const isTestUserPage = pathname === "/admin/test-user";
  const isPublicPage = isLoginPage || isSetupPage || isTestUserPage;
  
  // Only require auth if not on login or setup page
  if (!isPublicPage) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      redirect("/admin/login");
    }
  }
  
  // Get user role for navigation filtering (null if not authenticated)
  const authenticated = await isAuthenticated();
  const userRole = authenticated ? await getUserRole() : null;

  // Don't show navbar on login or setup page
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar userRole={userRole} />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

