import { prisma } from "@/services/database";
import { getUser } from "@/services/getUser";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const currentUser = await getUser();

  if (!currentUser) return new Response("User is not authenticated", { status: 401 });

  const { searchParams } = req.nextUrl;
  const searchTerm = searchParams.get("search") ?? "";
  const users = await prisma.user.findMany({
    where: {
      OR: [{ name: { contains: searchTerm } }, { email: { contains: searchTerm } }],
      NOT: { email: currentUser?.email }
    },
    select: { id: true, name: true, picture: true }
  });

  return Response.json({ data: { users } });
};
