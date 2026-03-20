import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password,role } = await req.json();
  
 
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return Response.json({ message: "Signup successful", user });
}