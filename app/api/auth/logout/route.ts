import { cookies } from "next/headers";

export async function POST() {
  const cookieStore =  cookies();

 (await cookieStore).delete("userId");

  return Response.json({ message: "Logged out" });
}