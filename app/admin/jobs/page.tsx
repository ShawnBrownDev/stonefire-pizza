import { getUserRole } from "../../lib/auth";
import { redirect } from "next/navigation";
import JobsTable from "./JobsTable";

export default async function AdminJobsPage() {
  const userRole = await getUserRole();
  
  // Check if user has access to jobs
  const canSeeJobs = userRole === "admin" || userRole === "jobs" || userRole === "both";
  if (!canSeeJobs) {
    redirect("/admin");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Job Applications</h1>
      <JobsTable />
    </div>
  );
}

