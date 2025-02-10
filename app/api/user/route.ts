import { withAuth } from "@/utils/withAuth";
import { NextRequest } from "next/server";
import User from "@/models/user";

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const userx = await User.findOne({ _id: user.id }).select({ password: 0 });
    if (userx) {
      return new Response(JSON.stringify(userx), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "User Not Found" }), {
        status: 404,
      });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `${(error as Error).message}` }),
      { status: 500 }
    );
  }
});
