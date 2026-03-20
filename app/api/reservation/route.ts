import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const { spaceId, startTime, endTime } = await req.json();

  if (!userId) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.role !== "MEMBER") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    include: { zone: true },
  });

  if (!space) {
    return Response.json({ error: "Space not found" }, { status: 404 });
  }

  
  const pass = await prisma.pass.findFirst({
    where: {
      userId,
      zoneId: space.zoneId,
      validFrom: { lte: new Date() },
      validTo: { gte: new Date() },
    },
  });

  const hasPass = !!pass;

  
  const existing = await prisma.reservation.findFirst({
    where: {
      spaceId,
      AND: [
        { startTime: { lte: new Date(endTime) } },
        { endTime: { gte: new Date(startTime) } },
      ],
    },
  });

  if (existing) {
    return Response.json(
      { error: "Space already booked for this time" },
      { status: 400 },
    );
  }

  
  const reservation = await prisma.reservation.create({
    data: {
      userId,
      spaceId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: "ACTIVE",
    },
  });

  return Response.json({
    reservation,
    hasPass, 
  });
}
