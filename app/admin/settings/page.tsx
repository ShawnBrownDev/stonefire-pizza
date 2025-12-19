import { getUserRole } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import FormConfigPanel from "@/app/admin/settings/FormConfigPanel";

export default async function AdminSettingsPage() {
  const userRole = await getUserRole();
  
  // Only admin can access settings page
  if (userRole !== "admin") {
    redirect("/admin");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Settings</h1>
        <p className="text-gray-600">Configure job application form options and visibility</p>
      </div>
      <FormConfigPanel />
    </div>
  );
}

