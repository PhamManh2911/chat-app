import { Chat } from "@/components";
import { LOGIN_URL } from "@/config/urls";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Page() {
  try {
    const { accessToken } = await getAccessToken();

    return <Chat accessToken={accessToken} />;
  } catch (_) {
    redirect(LOGIN_URL);
  }
}
