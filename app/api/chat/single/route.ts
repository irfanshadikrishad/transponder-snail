import Chat from "@/models/chat";
import User from "@/models/user";
import { withAuth } from "@/utils/withAuth";

export const POST = withAuth(async (req: Request, user: any) => {
  const { userId } = await req.json();

  if (!userId) {
    console.log("UserId param not sent with request");
    return new Response(
      JSON.stringify({ message: "UserId param not sent with request" }),
      { status: 400 }
    );
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return new Response(JSON.stringify(isChat[0]), { status: 200 });
  } else {
    try {
      const createdChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [user._id, userId],
      });
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return new Response(JSON.stringify(FullChat), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: `${(error as Error).message}` }),
        { status: 500 }
      );
    }
  }
});
