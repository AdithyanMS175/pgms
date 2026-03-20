import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { number, garageId } = await req.json();

  const floor = await prisma.floor.create({
    data: { number, garageId }
  });

  return Response.json(floor);
}