import { prisma } from "@/services/database";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

async function getChatHistory(chatId: number) {
  const sessionUser = (await getSession())?.user;

  if (!sessionUser) redirect("/login");
  const currentUser = await prisma.user.findUnique({
    where: { email: sessionUser.email }
  });

  if (!currentUser) redirect("/login");
  return await prisma.chat.findUnique({ where: { id: chatId } });
}

export default async function Page({ params }: { params: { id: string } }) {
  const chatHistory = await getChatHistory(+params.id);

  console.log(chatHistory);
  return <div>My posts {params.id}</div>;
}
