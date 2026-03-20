import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, type, floorId, basePrice } = await req.json();

  const zone = await prisma.zone.create({
    data: { name, type, floorId, basePrice }
  });

  return Response.json(zone);
}