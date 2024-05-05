import { Session, handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

import { prisma } from "@/services/database";

const afterCallback = async (
  req: NextRequest,
  session: Session,
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  state?: { [key: string]: any }
) => {
  const { email, given_name, family_name, nickname, name, picture } = session.user;
  const userData = {
    email,
    firstName: given_name,
    lastName: family_name,
    nickname,
    name,
    picture,
    lastOnline: new Date()
  };

  await prisma.user.upsert({
    where: { email },
    create: userData,
    update: userData
  });

  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback })
});
