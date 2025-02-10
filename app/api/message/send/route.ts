import { withAuth } from "@/utils/withAuth";
import { NextRequest } from "next/server";
import Message from "@/models/message";
import User from "@/models/user";
import Chat from "@/models/chat";

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { chatId, content } = await req.json();
    if (!chatId || !content) {
      return new Response(JSON.stringify({ message: "Invalid request" }), {
        status: 400,
      });
    } else {
      let message = await Message.create({
        sender: user.id,
        content,
        chat: chatId,
      });

      message = await message.populate("sender", "name avatar");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name avatar email",
      });

      await Chat.findByIdAndUpdate(chatId, {
        latest: message,
      });

      return new Response(JSON.stringify(message), { status: 200 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `${(error as Error).message}` }),
      { status: 500 }
    );
  }
});
