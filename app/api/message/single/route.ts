import { withAuth } from "@/utils/withAuth";
import { NextRequest } from "next/server";
import Message from "@/models/message";

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { chatId } = await req.json();
    const message = await Message.find({ chat: chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    if (message.length <= 0) {
      return new Response(JSON.stringify({ message: "No message found!" }), {
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(message), { status: 200 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `${(error as Error).message}` }),
      { status: 500 }
    );
  }
});
