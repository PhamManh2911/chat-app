import { prisma } from "@/services/database";
import { getUser } from "@/services/getUser";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { chatId: string } }) => {
  const currentUser = await getUser();

  if (!currentUser) return new Response("User is not authenticated", { status: 401 });
  const chatId = +params.chatId;

  if (!chatId) return new Response("Chat not found", { status: 404 });

  const chatHistory = await prisma.message.findMany({
    where: { chatId },
    select: { id: true, createdAt: true, updatedAt: true, value: true, userToChat: { select: {  } } }
  });

  return Response.json({});
};
