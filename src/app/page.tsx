import { getSession } from "@auth0/nextjs-auth0";

import { LOGIN_URL } from "@/config/urls";
import { redirect } from "next/navigation";

type UserClaim = {
  given_name?: string;
  family_name?: string;
  nickname?: string;
  picture?: string;
  updated_at: Date;
  email: string;
};

declare module "@auth0/nextjs-auth0" {
  interface Claims extends UserClaim {}
}

export default async function Home() {
  const user = (await getSession())?.user;

  if (user) redirect("/chat");
  else redirect(LOGIN_URL);
}
