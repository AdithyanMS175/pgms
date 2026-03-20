import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { number, zoneId, size } = await req.json();

  const space = await prisma.space.create({
    data: { number, zoneId, size }
  });

  return Response.json(space);
}



export async function GET() {
  const now = new Date();

  const spaces = await prisma.space.findMany({
    include: {
      zone: true,
      reservations: {
        where: {
          startTime: { lte: now },
          endTime: { gte: now },
        },
      },
    },
  });

  const formatted = spaces.map((space) => ({
    ...space,
    isReservedNow: space.reservations.length > 0,
  }));

  return Response.json(formatted);
}