import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name) {
    return Response.json({ error: "Name required" }, { status: 400 });
  }

  const garage = await prisma.garage.create({
    data: {
      name: body.name,
      location: body.location || null
    }
  });

  return Response.json(garage);
}

export async function GET() {
  const garages = await prisma.garage.findMany({
    include: {
      floors: {
        include: {
          zones: {
            include: {
              spaces: true,
            },
          },
        },
      },
    },
  });

  return Response.json(garages);
}