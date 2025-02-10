import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/utils/auth";

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const auth = await auth0(req);

    if (auth instanceof NextResponse) return auth;

    return handler(req, auth.user);
  };
}
