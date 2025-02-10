import { withAuth } from "@/utils/withAuth";
import Chat from "@/models/chat";
import { NextRequest } from "next/server";

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    let { users, name } = await req.json();
    if (users.length < 2) {
      return new Response(
        JSON.stringify({ message: "Group chat must have at least 2 users." }),
        { status: 400 }
      );
    } else {
      await users.push(user);
      const groupChat = await Chat.create({
        name: name,
        users: users,
        isGroup: true,
        isAdmin: user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", { password: 0 })
        .populate("isAdmin", { password: 0 });

      return new Response(JSON.stringify(fullGroupChat), { status: 201 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Error creating group chat.`,
        error: `${(error as Error).message}`,
      }),
      {
        status: 500,
      }
    );
  }
});
