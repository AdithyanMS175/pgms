import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    console.log("DELETE GARAGE ID:", id);

    if (!id) {
      return Response.json({ error: "Garage ID required" }, { status: 400 });
    }

    await prisma.garage.delete({
      where: { id },
    });

    return Response.json({ message: "Garage deleted successfully" });
  } catch (error) {
    console.error("DELETE GARAGE ERROR:", error);

    return Response.json({ error: "Failed to delete garage" }, { status: 500 });
  }
}
