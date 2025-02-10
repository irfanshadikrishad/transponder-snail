import database from "@/utils/database";
import pkg from "bcryptjs";
import User from "@/models/user";

const { genSaltSync, hashSync } = pkg;
const SALT = genSaltSync(Number(process.env.SALT));

export async function POST(request: Request) {
  try {
    await database();
    const { name, email, password, avatar } = await request.json();
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields must filled properly." }),
        { status: 400 }
      );
    } else {
      const isExist = await User.findOne({ email });
      if (isExist) {
        return new Response(
          JSON.stringify({ message: "User already exists, you can log in." }),
          { status: 400 }
        );
      } else {
        const hashedPassword = hashSync(password, SALT);
        const user = new User({
          name,
          email,
          password: hashedPassword,
          avatar,
        });
        const savedUser = await user.save();
        return new Response(
          JSON.stringify({
            id: savedUser._id,
            email: savedUser.email,
            token: savedUser.genJWT(),
          }),
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.log(`[register] ${(error as Error).message}`);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}
