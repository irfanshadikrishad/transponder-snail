import { withAuth } from "@/utils/withAuth";
import { NextRequest } from "next/server";
import Chat from "@/models/chat";
import User from "@/models/user";

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: user.id } },
    })
      .populate("users", { password: 0 })
      .populate("latest")
      .populate("isAdmin", { password: 0 })
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latest.sender",
      select: "name avatar email",
    });

    return new Response(JSON.stringify(chats), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `${(error as Error).message}` }),
      { status: 500 }
    );
  }
});
