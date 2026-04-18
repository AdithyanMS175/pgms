import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { vehicleId, spaceId } = await req.json();

  
    if (!vehicleId || !spaceId) {
      return Response.json(
        { error: "vehicleId and spaceId are required" },
        { status: 400 }
      );
    }


    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { user: true },
    });


    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!vehicle || !space) {
      return Response.json(
        { error: "Invalid vehicle or space" },
        { status: 400 }
      );
    }


    const existingSession = await prisma.parkingSession.findFirst({
      where: {
        vehicleId,
        checkOut: null,
      },
    });

    if (existingSession) {
      return Response.json(
        { error: "Vehicle already checked in" },
        { status: 400 }
      );
    }


    if (space.isOccupied) {
      return Response.json(
        { error: "Space already occupied" },
        { status: 400 }
      );
    }


    if (vehicle.type === "LARGE" && space.size !== "LARGE") {
      return Response.json(
        { error: "Vehicle too large for this space" },
        { status: 400 }
      );
    }

    if (vehicle.type === "MEDIUM" && space.size === "SMALL") {
      return Response.json(
        { error: "Vehicle too large for this space" },
        { status: 400 }
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
        { status: 400 }
      );
    }


    const session = await prisma.$transaction(async (tx) => {
      const session = await tx.parkingSession.create({
        data: {
          vehicleId,
          spaceId,
          checkIn: now,
        },
      });

      await tx.space.update({
        where: { id: spaceId },
        data: { isOccupied: true },
      });

      return session;
    });


    if (vehicle.user?.email) {
      try {
        await sendEmail(
          vehicle.user.email,
          "Vehicle Checked In",
          `
          <h2>Check-In Successful</h2>
          <p><b>Vehicle:</b> ${vehicle.plateNumber}</p>
          <p><b>Space:</b> ${space.number}</p>
          <p><b>Time:</b> ${now.toLocaleString()}</p>
          `
        );
      } catch (err) {
        console.error("Email failed:", err);
      }
    }

    return Response.json({
      message: "Checked in successfully",
      sessionId: session.id,
    });

  } catch (error) {
    console.error("CHECKIN ERROR:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}