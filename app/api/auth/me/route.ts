import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return Response.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return Response.json({ user });
}