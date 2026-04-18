import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { number, zoneId, size } = await req.json();

    const space = await prisma.space.create({
      data: { number, zoneId, size },
    });

    return Response.json(space);
  } catch (error) {
    console.error("POST SPACE ERROR:", error);
    return Response.json({ error: "Failed to create space" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const now = new Date();

    const spaces = await prisma.space.findMany({
      include: {
        zone: true,
        reservations: true, // ✅ no filtering here (prevents crash)
      },
    });

    const formatted = spaces.map((space) => ({
      ...space,
      isReservedNow:
        space.reservations?.some(
          (r) =>
            r.startTime &&
            r.endTime &&
            new Date(r.startTime) <= now &&
            new Date(r.endTime) >= now
        ) || false,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("GET SPACE ERROR:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}