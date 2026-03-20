import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./components/LogoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PGMS",
  description:
    "Parking Garage Management System built with Next.js, Prisma, and Tailwind CSS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  let user = null;

  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="bg-white shadow p-4 flex justify-between">
          <h1 className="font-bold">PGMS</h1>

          <div className="space-x-4">
            {/* Always visible */}
            <a href="/" className="text-blue-600">
              Home
            </a>

            {/* MEMBER */}
            {user?.role === "MEMBER" && (
              <>
                <a href="/member/reserve">Reserve</a>
                <a href="/member/vehicle" className="bg-green-500 text-white px-3 py-1 rounded">+ Add Vehicle</a>
              </>
            )}

            {/* ATTENDANT */}
            {user?.role === "ATTENDANT" && (
              <>
                <a href="/attendent/checkin">CheckIn</a>
                <a href="/attendent/checkout">Checkout</a>
              </>
            )}

            {/* MANAGER */}
            {user?.role === "MANAGER" && <a href="/manager/setup">Setup</a>}

            {userId ? (
              <LogoutButton />
            ) : (
              <a href="/login" className="text-blue-600">
                Login
              </a>
            )}
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
