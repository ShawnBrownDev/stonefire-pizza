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
  
  // Only require auth if not on login page
  if (!isLoginPage) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      redirect("/admin/login");
    }
  }
  
  // Get user role for navigation filtering (null if not authenticated)
  const authenticated = await isAuthenticated();
  const userRole = authenticated ? await getUserRole() : null;

  // Don't show navbar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar userRole={userRole} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

