import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/user";
import database from "@/utils/database";

const SECRET = process.env.SECRET;

export async function auth0(req: NextRequest) {
  try {
    await database();

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "Unauthorized! No Token." },
        { status: 401 }
      );

    const token = authHeader.split(" ")[1];
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized! Invalid Token." },
        { status: 401 }
      );

    const decoded = jwt.verify(token, SECRET as string);

    const user = await User.findOne({
      email: (decoded as JwtPayload).email,
    }).select("-password");
    if (!user)
      return NextResponse.json(
        { message: "Unauthorized! User Not Found." },
        { status: 401 }
      );

    return { user };
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized! Invalid Token.", error },
      { status: 401 }
    );
  }
}
