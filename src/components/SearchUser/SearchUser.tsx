"use client";

import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { debounce } from "@/helpers/debounce";

import { useRouter } from "next/navigation";
import "./style.css";

const userWithChat = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true, name: true, picture: true }
});

export default function SearchUser() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Array<Prisma.UserGetPayload<typeof userWithChat>>>([]);

  const fetchUsers = useCallback(async (search: string) => {
    if (!search) setUsers([]);
    else {
      const userData = await (await fetch(`/api/users?search=${search}`)).json();

      setUsers(userData.data.users);
    }
  }, []);

  const debounceFetchUsers = useMemo(() => debounce(fetchUsers, 500), [fetchUsers]);

  const onChangeSearch = (value: string) => {
    setSearchTerm(value);
    debounceFetchUsers(value);
  };

  const onChooseChat = async (id: number) => {
    const user = users.find((user) => user.id === id);

    if (!user?.id) return;
    const res = await (await fetch(`/api/get-create-chat?userId=${user.id}`)).json();

    if (!res?.data?.chat) return;
    const chat = res.data.chat;

    router.push(`/chat/${chat.id}`);
    setSearchTerm("");
    setUsers([]);
  };

  return (
    <div>
      <input
        className='text-black'
        value={searchTerm}
        onChange={(e) => onChangeSearch(e.target.value)}
      />
      <div className='relative'>
        <div
          className={`absolute w-full search-results ${
            users.length > 0 ? "slide-down" : "slide-up"
          }`}
        >
          {users.map((user) => (
            <div
              key={user.id}
              className='flex gap-2 py-2 px-2 bg-slate-800 hover:bg-slate-700 cursor-pointer'
              onClick={() => onChooseChat(user.id)}
            >
              <Image
                alt={user.name || "user image"}
                width={24}
                height={24}
                src={user.picture ?? "/images/dummy.png"}
                className='rounded-full'
              />
              <div>{user.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
