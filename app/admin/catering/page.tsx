import { getUserRole } from "../../../lib/auth";
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Catering Requests</h1>
      <CateringTable />
    </div>
  );
}

