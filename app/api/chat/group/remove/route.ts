import { withAuth } from "@/utils/withAuth";
import { NextRequest } from "next/server";
import Chat from "@/models/chat";

export const PUT = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { chatId, userId } = await req.json();
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", { password: 0 })
      .populate("isAdmin", { password: 0 });

    return new Response(JSON.stringify(updatedChat), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Error removing user from chat.`,
        error: `${(error as Error).message}`,
      }),
      { status: 500 }
    );
  }
});
