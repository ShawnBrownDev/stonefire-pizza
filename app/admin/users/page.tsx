import { getUserRole } from "../../../lib/auth";
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>
      <UsersTable />
    </div>
  );
}

