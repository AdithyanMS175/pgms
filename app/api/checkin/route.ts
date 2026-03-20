import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { vehicleId, spaceId } = await req.json();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      user: true,
    },
  });

  const space = await prisma.space.findUnique({
    where: { id: spaceId },
  });

  if (space?.isOccupied) {
    return Response.json({ error: "Space already occupied" }, { status: 400 });
  }

  if (!vehicle || !space) {
    return Response.json(
      { error: "Invalid vehicle or space" },
      { status: 400 },
    );
  }

  if (vehicle.type === "LARGE" && space.size !== "LARGE") {
    return Response.json(
      { error: "Vehicle too large for this space" },
      { status: 400 },
    );
  }

  if (vehicle.type === "MEDIUM" && space.size === "SMALL") {
    return Response.json(
      { error: "Vehicle too large for this space" },
      { status: 400 },
    );
  }

  const now = new Date();

  const activeReservation = await prisma.reservation.findFirst({
    where: {
      spaceId,
      startTime: { lte: now },
      endTime: { gte: now },
      status: "ACTIVE",
    },
  });

  if (activeReservation) {
    return Response.json(
      { error: "Space reserved, cannot check-in" },
      { status: 400 },
    );
  }

  const session = await prisma.parkingSession.create({
    data: {
      vehicleId,
      spaceId,
      checkIn: new Date(),
    },
  });

  if (vehicle?.user?.email) {
    await sendEmail(
      vehicle.user.email,
      "Vehicle Checked In",
      `<h2>Check-In Successful</h2>
     <p>Vehicle: ${vehicle.plateNumber}</p>
     <p>Space: ${space.number}</p>
     <p>Time: ${new Date().toLocaleString()}</p>`,
    );
  }

  await prisma.space.update({
    where: { id: spaceId },
    data: { isOccupied: true },
  });

  return Response.json({
    message: "Checked in successfully",
    sessionId: session.id,
  });
}
