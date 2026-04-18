import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  const session = await prisma.parkingSession.findUnique({
    where: { id: sessionId },
    include: {
      vehicle: {
        include: {
          user: true,
        },
      },
      space: {
        include: {
          zone: true,
        },
      },
    },
  });

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }


  if (session.checkOut) {
    return Response.json(
      { error: "Session already checked out" },
      { status: 400 }
    );
  }

  const endTime = new Date();

  const durationMs =
    endTime.getTime() - new Date(session.checkIn).getTime();

  const durationHours = durationMs / (1000 * 60 * 60);

  const space = session.space;
  const basePrice = space?.zone?.basePrice || 20;

 
  const pass = await prisma.pass.findFirst({
    where: {
      userId: session.vehicle.user.id,
      zoneId: space.zoneId,
      validFrom: { lte: new Date() },
      validTo: { gte: new Date() },
    },
  });

  let price = 0;

  if (!pass) {
   
    const totalHours = Math.ceil(durationHours);

    let current = new Date(session.checkIn);

    for (let i = 0; i < totalHours; i++) {
      const hour = current.getHours();

      const isPeak = hour >= 9 && hour < 18;

      const rate = isPeak ? basePrice * 1.5 : basePrice;

      price += rate;

      current.setHours(current.getHours() + 1);
    }
  }

  
  await prisma.parkingSession.update({
    where: { id: sessionId },
    data: {
      checkOut: endTime,
      totalCost: price,
    },
  });

 
  await prisma.space.update({
    where: { id: session.spaceId },
    data: { isOccupied: false },
  });

 
  if (session.vehicle.user.email) {
    await sendEmail(
      session.vehicle.user.email,
      "Parking Receipt",
      `<h2>Checkout Successful</h2>
       <p>Vehicle: ${session.vehicle.plateNumber}</p>
       <p>Space: ${space.number}</p>
       <p>Duration: ${durationHours.toFixed(2)} hours</p>
       <p>Total Cost: ₹${price}</p>`
    );
  }

  return Response.json({
    message: pass ? "Covered by pass" : "Checked out successfully",
    durationHours: durationHours.toFixed(2),
    price,
  });
}