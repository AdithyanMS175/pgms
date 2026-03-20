import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  // Get full user 
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Parking Garage System
      </h1>

      <p className="text-gray-600 mb-2 text-center">
        Welcome,{}{" "}
        <span className="font-bold">{user.name}</span> ({user.role})
        {}{" "}
      </p>

      <p className="text-gray-500 mb-10 text-center">
        Manage parking operations efficiently
      </p>

      <div className="grid grid-cols-2 gap-6">

        {/*  MANAGER */}
        {user.role === "MANAGER" && (
          <a href="/setup" className="card">
            Setup Garage
          </a>
        )}

        {/*  MEMBER */}
        {user.role === "MEMBER" && (
          <a href="/member/reserve" className="card">
            Reserve
          </a>
        )}

        {/* ATTENDANT */}
        {user.role === "ATTENDANT" && (
          <>
            <a href="/attendent/checkin" className="card">
              Check-In
            </a>
            <a href="/attendent/checkout" className="card">
              Check-Out
            </a>
          </>
        )}

      </div>
    </div>
  );
}