"use client";

export default function LogoutButton() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button onClick={logout} className="bg-red-500 text-white p-2 rounded cursor-pointer">
      Logout
    </button>
  );
}