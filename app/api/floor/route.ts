import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { number, garageId } = await req.json();

    if (!number || !garageId) {
      return Response.json(
        { error: "Missing number or garageId" },
        { status: 400 }
      );
    }

    const floor = await prisma.floor.create({
      data: {
        number,
        garageId,
      },
    });

    return Response.json(floor);
  } catch (error) {
    console.error("FLOOR ERROR:", error);

    return Response.json(
      { error: "Failed to create floor" },
      { status: 500 }
    );
  }
}