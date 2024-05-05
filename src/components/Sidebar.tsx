"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MessageChat = Prisma.ChatGetPayload<{
  select: {
    id: true;
    name: true;
    messages: {
      select: {
        id: true;
        createdAt: true;
        updatedAt: true;
        value: true;
        userToChat: {
          select: { nickname: true; user: { select: { name: true } } };
        };
      };
    };
    userToChats: {
      select: {
        lastSeen: true;
        user: { select: { email: true; picture: true } };
      };
    };
  };
}>;

function ChatItem({ chat }: { chat: MessageChat }) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  console.log(chat);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return null;

  const firstMessage = chat.messages[0];
  const userSent = firstMessage?.userToChat?.nickname ?? firstMessage?.userToChat?.user.name;
  const userLastSeen = chat.userToChats.find(
    (userToChat) => userToChat.user.email === user.email
  )?.lastSeen;

  console.log(userLastSeen);
  console.log(firstMessage?.updatedAt);

  return (
    <div
      className='h-16 w-full flex justify-center items-center hover:bg-neutral-800 rounded-lg'
      onClick={() => router.push(`/chat/${chat.id}`)}
    >
      <div className='w-16 h-16 flex justify-center items-center p-1 relative'>
        <Image
          width={56}
          height={56}
          alt='user image'
          src={
            chat.userToChats.find((userToChat) => userToChat.user.email !== user.email)?.user
              ?.picture ?? "/images/dummy.png"
          }
          className='rounded-full'
        />
      </div>
      <div className='flex flex-col items-center justify-start h-full max-w-full flex-1'>
        <span>{userSent}</span>
        <span>{firstMessage?.value}</span>
      </div>
      <div className='w-2 h-full'></div>
    </div>
  );
}

export default function Sidebar({ allChat }: { allChat: Array<MessageChat> }) {
  return (
    <div className='flex flex-col min-w-96 border-r-2 border-r-slate-800 h-full'>
      <div className='flex flex-col h-full items-center justify-start'>
        {allChat.map((chat) => (
          <ChatItem chat={chat} key={chat.id} />
        ))}
      </div>
    </div>
  );
}
