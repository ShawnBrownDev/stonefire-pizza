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
      className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all border border-gray-200 hover:border-gray-300"
    >
      <span className="mr-2">🚪</span>
      Logout
    </button>
  );
}

