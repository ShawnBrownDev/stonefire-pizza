import { getUserRole } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import LocationsTable from "@/app/admin/locations/LocationsTable";

export default async function AdminLocationsPage() {
  const userRole = await getUserRole();
  
  // Only admin can access locations page
  if (userRole !== "admin") {
    redirect("/admin");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Management</h1>
        <p className="text-gray-600">Manage restaurant locations and hiring status</p>
      </div>
      <LocationsTable />
    </div>
  );
}

