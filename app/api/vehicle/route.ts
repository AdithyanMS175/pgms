import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      sessions: {
        none: {
          checkOut: null,
        },
      },
    },
    include: {
      user: true,
    },
  });

  return Response.json(vehicles);
}

export async function POST(req: Request) {
  const { plateNumber, type } = await req.json();

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      plateNumber,
      type,
      userId,
    },
  });

  return Response.json({ message: "Vehicle added successfully" });
}
