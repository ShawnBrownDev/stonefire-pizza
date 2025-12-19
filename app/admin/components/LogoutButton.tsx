"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/admin/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
    >
      Logout
    </button>
  );
}

