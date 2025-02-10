import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user";
import { auth0 } from "@/utils/auth";
import database from "@/utils/database";

export async function GET(req: NextRequest) {
  try {
    await database();
    const auth = await auth0(req);

    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const search = req.nextUrl.searchParams.get("search") || "";

    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .find({ _id: { $ne: user._id } })
      .select("-password");

    if (users.length > 0) {
      return NextResponse.json(users, { status: 200 });
    } else {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(`[allUsers] ${(error as Error).message}`);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
