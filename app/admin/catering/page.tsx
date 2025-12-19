import { getUserRole } from "../../lib/auth";
import { redirect } from "next/navigation";
import CateringTable from "./CateringTable";

export default async function AdminCateringPage() {
  const userRole = await getUserRole();
  
  // Check if user has access to catering
  const canSeeCatering = userRole === "admin" || userRole === "catering" || userRole === "both";
  if (!canSeeCatering) {
    redirect("/admin");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catering Requests</h1>
        <p className="text-gray-600">Review and process catering requests from customers</p>
      </div>
      <CateringTable />
    </div>
  );
}

