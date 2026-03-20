import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.parkingSession.findMany({
    where: {
      checkOut: null, 
    },
    include: {
      vehicle: true,
      space: true,
    },
  });

  return Response.json(sessions);
}