import { ProfileServer, SearchUser, SideBar } from "@/components";
import { prisma } from "@/services/database";
import { getSession } from "@auth0/nextjs-auth0";

async function getAllChat() {
  const session = await getSession();
  const user = session?.user;
  const email = user?.email;

  return await prisma.chat.findMany({
    where: {
      userToChats: { some: { user: { email } } },
      NOT: { messages: { none: {} } }
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      messages: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          value: true,
          userToChat: {
            select: {
              nickname: true,
              user: { select: { name: true } }
            }
          }
        },
        orderBy: { updatedAt: "desc" },
        take: 1
      },
      userToChats: {
        select: {
          lastSeen: true,
          user: { select: { email: true, picture: true } }
        }
      }
    }
  });
}

export default async function ChatLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allChat = await getAllChat();

  console.log(allChat);

  return (
    <main className='flex min-h-screen flex-col items-center font-mono'>
      <div className='flex w-full items-center justify-between text-sme py-6 border-b-2 border-b-slate-800 px-16'>
        <p>Chat App</p>
        <SearchUser />
        <ProfileServer />
      </div>
      <div className='flex w-full h-[calc(100vh-106px)]'>
        <SideBar allChat={allChat} />
        {children}
      </div>
    </main>
  );
}
