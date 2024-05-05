import { prisma } from "@/services/database";
import { getUser } from "@/services/getUser";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const currentUser = await getUser();

  if (!currentUser) return new Response("User is not authenticated", { status: 401 });
  const { searchParams } = req.nextUrl;
  const userId = +(searchParams.get("userId") ?? "");

  if (!userId) return new Response("User id is not allowed to be empty", { status: 404 });
  let chat;
  chat = await prisma.chat.findFirst({
    where: { userToChats: { every: { userId: { in: [userId, currentUser.id] } } } }
  });

  if (!chat)
    chat = await prisma.chat.create({
      data: {
        numberOfMember: 2,
        userToChats: {
          create: [
            { userId: currentUser.id, lastSeen: new Date() },
            { userId: userId, lastSeen: new Date() }
          ]
        }
      }
    });

  return Response.json({ data: { chat } });
};
