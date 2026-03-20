import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, zoneId, validFrom, validTo } = await req.json();

  const pass = await prisma.pass.create({
    data: {
      userId,
      zoneId,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
    },
  });

  return Response.json(pass);
}