import { getUserRole } from "../../lib/auth";
import { redirect } from "next/navigation";
import UsersTable from "./UsersTable";

export default async function AdminUsersPage() {
  const userRole = await getUserRole();
  
  // Only admin can access users page
  if (userRole !== "admin") {
    redirect("/admin");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage admin users, roles, and access permissions</p>
      </div>
      <UsersTable />
    </div>
  );
}

