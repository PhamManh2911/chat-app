import { LOGIN_URL } from "@/config/urls";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const { accessToken } = await getAccessToken();

    console.log(params.id);
    console.log(accessToken);

    return <div>My posts {params.id}</div>;
  } catch (_) {
    redirect(LOGIN_URL);
  }
}
