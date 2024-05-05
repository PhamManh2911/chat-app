import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "./database";

export const getUser = async () => {
  const user = (await getSession())?.user;

  if (!user?.email) return null;

  const currentUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!currentUser) return null;
  return currentUser;
};
