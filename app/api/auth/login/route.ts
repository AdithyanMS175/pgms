import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  
  const cookieStore = await cookies();
  cookieStore.set("userId", user.id);

  return Response.json({ message: "Login successful" });
}