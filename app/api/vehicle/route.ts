import { prisma } from "@/lib/prisma";

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
