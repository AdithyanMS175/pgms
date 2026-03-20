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
    },
  });

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  if (!session?.vehicle?.user?.email) {
    return Response.json({ error: "User email not found" }, { status: 400 });
  }

  const endTime = new Date();

  const durationMs = endTime.getTime() - new Date(session?.checkIn).getTime();
  const durationHours = durationMs / (1000 * 60 * 60);

  let price = 0;

  let current = new Date(session?.checkIn);

  while (current < endTime) {
    const hour = current.getHours();

    const isPeak = hour >= 9 && hour < 18;

    const rate = isPeak ? 40 : 20;

    price += rate;

    current.setHours(current.getHours() + 1);
  }

  const updated = await prisma.parkingSession.update({
    where: { id: sessionId },
    data: {
      checkOut: endTime,
      totalCost: price,
    },
  });

  await sendEmail(
    session?.vehicle?.user?.email,
    "Parking Receipt",
    `<h2>Checkout Successful</h2>
   <p>Total Cost: ₹${price}</p>`,
  );

  return Response.json({
    message: "Checked out successfully",
    durationHours: durationHours.toFixed(2),
    price,
  });
}
