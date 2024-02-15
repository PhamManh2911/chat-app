import Image from "next/image";

import { getSession } from "@auth0/nextjs-auth0";

export default async function ProfileServer() {
  const session = await getSession();
  const user = session?.user;

  return user ? (
    <div className="flex gap-2 justify-center items-center">
      <Image
        src={user.picture ?? "/images/dummy.png"}
        alt={user.name ?? "user picture"}
        width={40}
        height={40}
        style={{ borderRadius: "50%" }}
      />
      <h2>{user.name ?? "User"}</h2>
    </div>
  ) : (
    <a href="/api/auth/login">Login</a>
  );
}
