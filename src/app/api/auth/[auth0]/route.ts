import { Session, handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

import { prima } from "@/services/database";

const afterCallback = async (
  req: NextRequest,
  session: Session,
  state?: { [key: string]: any }
) => {
  const { email, given_name, family_name, nickname, name, picture } =
    session.user;
  const userData = {
    email,
    firstName: given_name,
    lastName: family_name,
    nickname,
    name,
    picture,
    lastOnline: new Date(),
  };

  await prima.user.upsert({
    where: { email },
    create: userData,
    update: userData,
  });

  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});
