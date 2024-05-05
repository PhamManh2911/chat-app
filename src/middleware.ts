import { User } from "@prisma/client";
import { NextResponse } from "next/server";

declare module "next/server" {
  interface NextRequest {
    currentUser?: User;
  }
}

export async function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image).*)"]
};
