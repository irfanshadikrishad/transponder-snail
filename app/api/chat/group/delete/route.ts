import { withAuth } from "@/utils/withAuth";
import { NextRequest } from "next/server";
import Chat from "@/models/chat";

export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { chatId } = await req.json();
    const delete_group = await Chat.findByIdAndDelete(chatId);
    return new Response(JSON.stringify(delete_group), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Error deleting group`,
        error: `${(error as Error).message}`,
      }),
      {
        status: 500,
      }
    );
  }
});
